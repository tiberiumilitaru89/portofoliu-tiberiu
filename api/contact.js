// @ts-check
import { createHash, randomUUID } from 'node:crypto';

// Hybrid distributed + in-memory sliding window rate limiter for Serverless defense
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minut
const RATE_LIMIT_WINDOW_SECONDS = 60;
const MAX_REQUESTS_PER_WINDOW = 5;
const MIN_HUMAN_INTERACTION_MS = 1200; // Prag minim de interacțiune umană anti-bot (1.2s)
const MAX_HUMAN_INTERACTION_MS = 24 * 60 * 60 * 1000; // Limită superioară realistă (24h)
const MAX_PAYLOAD_BYTES = 16384; // 16 KB Denial-of-Wallet guard

const PROD_ALLOWED_ORIGINS = [
    'https://www.tiberiumilitaru.ro',
    'https://tiberiumilitaru.ro'
];

const DEV_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173'
];

const ALLOWED_FETCH_SITES = new Set(['same-origin', 'same-site']);

const ALLOWED_BODY_KEYS = new Set([
    'name',
    'email',
    '_replyto',
    'service',
    'type',
    'message',
    '_gotcha',
    '_formDuration'
]);

const FORBIDDEN_PROTO_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

const ALLOWED_SERVICES = new Set([
    'mvp_saas_web',
    'crm_automatizare',
    'baza_date_sql',
    'it_consultanta',
    'altele',
    'General',
    'Mesaj din 3D Swarm Engine'
]);

const CORRELATION_ID_REGEX = /^[a-zA-Z0-9_-]{8,64}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,62}[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

function getAllowedOrigins() {
    if (process.env.VERCEL_ENV === 'production') {
        return new Set(PROD_ALLOWED_ORIGINS);
    }
    return new Set([...PROD_ALLOWED_ORIGINS, ...DEV_ALLOWED_ORIGINS]);
}

export function __resetRateLimitMap() {
    rateLimitMap.clear();
}

function normalizeRateLimitIp(ip) {
    const trimmed = typeof ip === 'string' ? ip.trim() : '';
    return (!trimmed || trimmed.toLowerCase() === 'unknown') ? 'global_unknown_ip' : trimmed;
}

function cleanupRateLimits() {
    if (rateLimitMap.size > 500) {
        const now = Date.now();
        for (const [key, record] of rateLimitMap.entries()) {
            if (now - record.startTime > RATE_LIMIT_WINDOW_MS) {
                rateLimitMap.delete(key);
            }
        }
    }
}

function isMemoryRateLimited(fullKey) {
    cleanupRateLimits();

    const now = Date.now();
    const record = rateLimitMap.get(fullKey);

    if (!record || now - record.startTime > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.set(fullKey, { count: 1, startTime: now });
        return false;
    }

    if (record.count >= MAX_REQUESTS_PER_WINDOW) {
        return true;
    }

    record.count += 1;
    return false;
}

async function isBucketRateLimited(redisKey, fallbackKey) {
    const kvUrl = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '').trim();
    const kvToken = (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '').trim();

    if (kvUrl && kvToken) {
        try {
            const res = await fetch(`${kvUrl.replace(/\/$/, '')}/pipeline`, {
                method: 'POST',
                signal: AbortSignal.timeout(1500),
                headers: {
                    'Authorization': `Bearer ${kvToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify([
                    ['INCR', redisKey],
                    ['EXPIRE', redisKey, RATE_LIMIT_WINDOW_SECONDS, 'NX']
                ])
            });
            if (res.ok) {
                const data = await res.json();
                const currentCount = Array.isArray(data) && data[0] ? Number(data[0].result) : 1;
                return currentCount > MAX_REQUESTS_PER_WINDOW;
            }
        } catch (_) {
            // Fallback la in-memory store dacă store-ul distribuit nu răspunde în 1.5s
        }
    }

    return isMemoryRateLimited(fallbackKey);
}

async function isRateLimited(ip) {
    const bucketKey = normalizeRateLimitIp(ip);
    return isBucketRateLimited(`rl:contact:${bucketKey}`, `ip:${bucketKey}`);
}

async function isEmailRateLimited(normalizedEmail) {
    const emailHash = createHash('sha256').update(normalizedEmail.toLowerCase()).digest('hex').slice(0, 24);
    return isBucketRateLimited(`rl:contact:email:${emailHash}`, `email:${emailHash}`);
}

function sanitize(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/<[^>]*>?/gm, '').replace(/[\r\n\0]+/g, ' ').trim();
}

function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function maskEmail(email) {
    if (typeof email !== 'string') return '***';
    const parts = email.split('@');
    if (parts.length !== 2) return '***';
    const [user, domain] = parts;
    if (!user) return `***@${domain}`;
    const maskedUser = user.length <= 2 ? `${user[0]}*` : `${user[0]}***${user.slice(-1)}`;
    return `${maskedUser}@${domain}`;
}

function maskIp(ip) {
    if (typeof ip !== 'string') return '***';
    const parts = ip.split('.');
    if (parts.length === 4) {
        return `${parts[0]}.${parts[1]}.***.***`;
    }
    return ip.slice(0, 7) + '***';
}

function logStructured(level, event, correlationId, details = {}) {
    const entry = {
        timestamp: new Date().toISOString(),
        correlation_id: correlationId,
        level,
        event,
        ...details
    };
    if (level === 'error') {
        console.error(JSON.stringify(entry));
    } else if (level === 'warn') {
        console.warn(JSON.stringify(entry));
    } else {
        console.info(JSON.stringify(entry));
    }
}

function buildAdminEmailHtml({ name, email, service, message, dateFormatted, clientIp }) {
    return `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mesaj Nou Portofoliu</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; padding: 24px 12px; margin: 0; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
    <div style="background: #0f172a; padding: 20px 24px; border-bottom: 3px solid #06b6d4;">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; color: #38bdf8;">
        Portofoliu Militaru Tiberiu Nicolae &bull; Alertă Mesaj Nou
      </div>
      <h1 style="margin: 8px 0 0 0; font-size: 19px; font-weight: 700; color: #ffffff;">
        Solicitare nouă: ${escapeHtml(service)}
      </h1>
    </div>
    <div style="padding: 24px;">
      <p style="color: #475569; font-size: 14px; margin-top: 0; margin-bottom: 20px; line-height: 1.5;">
        A fost recepționat un mesaj nou prin intermediul formularului de contact de pe site:
      </p>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 14px; font-weight: 600; color: #0f172a; width: 32%; background: #f8fafc;">Expeditor:</td>
          <td style="padding: 10px 14px; color: #334155;">${escapeHtml(name)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 14px; font-weight: 600; color: #0f172a; background: #f8fafc;">Email:</td>
          <td style="padding: 10px 14px; color: #334155;">
            <a href="mailto:${escapeHtml(email)}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${escapeHtml(email)}</a>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 14px; font-weight: 600; color: #0f172a; background: #f8fafc;">Serviciu / Tip:</td>
          <td style="padding: 10px 14px; color: #334155;">
            <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; background: #e0f2fe; color: #0369a1; font-weight: 600; font-size: 12px;">${escapeHtml(service)}</span>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 14px; font-weight: 600; color: #0f172a; background: #f8fafc;">Data &amp; Ora:</td>
          <td style="padding: 10px 14px; color: #334155;">${escapeHtml(dateFormatted)} (București)</td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 14px; font-weight: 600; color: #0f172a; background: #f8fafc;">IP Client:</td>
          <td style="padding: 10px 14px; color: #64748b; font-family: monospace; font-size: 12px;">${escapeHtml(clientIp)}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 14px; background: #ffffff;">
            <div style="font-weight: 600; color: #0f172a; margin-bottom: 8px;">Conținut Mesaj:</div>
            <div style="background: #f8fafc; border-left: 3px solid #06b6d4; padding: 12px 14px; border-radius: 6px; font-size: 13px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">${escapeHtml(message)}</div>
          </td>
        </tr>
      </table>
      <div style="margin-top: 20px; padding: 14px; background: #ecfeff; border-radius: 8px; border-left: 4px solid #06b6d4;">
        <span style="font-size: 12px; color: #155e75; display: block; line-height: 1.5;">
          <strong>Răspuns Direct la 1 Click:</strong> Headerul <code>reply_to</code> este configurat direct pe adresa clientului (<code>${escapeHtml(email)}</code>). Când apeși „Răspunde / Reply” în Gmail pe telefon sau PC, mesajul tău va pleca direct către solicitant.
        </span>
      </div>
    </div>
    <div style="background: #f8fafc; padding: 14px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
      Platforma Portofoliu Militaru Tiberiu Nicolae &bull; <a href="https://www.tiberiumilitaru.ro" style="color: #0284c7; text-decoration: none;">www.tiberiumilitaru.ro</a>
    </div>
  </div>
</body>
</html>`;
}

function buildClientEmailHtml({ name, service, dateFormatted }) {
    return `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmare primire mesaj — Militaru Tiberiu Nicolae</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #070d19; padding: 24px 12px; margin: 0; color: #f1f5f9;">
  <div style="max-width: 600px; margin: 0 auto; background: #0f172a; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid #1e293b;">
    <div style="background: #0b1120; padding: 24px; border-bottom: 3px solid #06b6d4; text-align: center;">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; color: #38bdf8;">
        Militaru Tiberiu Nicolae &bull; Web &amp; IT Solutions
      </div>
      <h1 style="margin: 10px 0 0 0; font-size: 20px; font-weight: 700; color: #ffffff;">
        Confirmare Primire Mesaj
      </h1>
    </div>
    <div style="padding: 24px;">
      <p style="color: #cbd5e1; font-size: 15px; margin-top: 0; line-height: 1.6;">
        Salut, <strong style="color: #38bdf8;">${escapeHtml(name)}</strong>!
      </p>
      <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
        Îți mulțumesc pentru mesajul transmis și pentru interesul acordat serviciilor mele. Solicitarea ta privind <strong style="color: #22d3ee;">${escapeHtml(service)}</strong> a fost recepționată cu succes.
      </p>
      <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
        Voi analiza cerințele transmise și voi reveni cu un răspuns detaliat în cel mult <strong>24 de ore</strong>.
      </p>

      <div style="margin: 22px 0; padding: 14px 16px; background: #131d31; border: 1px solid #1e293b; border-radius: 8px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="color: #64748b; padding: 4px 0; width: 40%;">Serviciu solicitat:</td>
            <td style="color: #f1f5f9; font-weight: 600; padding: 4px 0;">${escapeHtml(service)}</td>
          </tr>
          <tr>
            <td style="color: #64748b; padding: 4px 0;">Data înregistrării:</td>
            <td style="color: #f1f5f9; padding: 4px 0;">${escapeHtml(dateFormatted)} (București)</td>
          </tr>
          <tr>
            <td style="color: #64748b; padding: 4px 0;">Status:</td>
            <td style="color: #34d399; font-weight: 600; padding: 4px 0;">&bull; Preluat / În analiză</td>
          </tr>
        </table>
      </div>

      <!-- Urgențe / WhatsApp Banner -->
      <div style="margin-top: 24px; padding: 18px; background: #082f49; border: 1px solid #0284c7; border-radius: 10px; text-align: center;">
        <div style="font-size: 13px; font-weight: 600; color: #7dd3fc; margin-bottom: 6px;">
          Ai o urgență tehnică sau un termen strâns?
        </div>
        <p style="font-size: 12px; color: #bae6fd; margin: 0 0 14px 0; line-height: 1.5;">
          Îmi poți trimite oricând un mesaj direct pe WhatsApp pentru o discuție rapidă:
        </p>
        <a href="https://wa.me/40720955119" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #06b6d4; color: #082f49; font-weight: 700; font-size: 13px; padding: 10px 20px; border-radius: 6px; text-decoration: none;">
          Scrie-mi pe WhatsApp (+40 720 955 119)
        </a>
      </div>

      <!-- Signature -->
      <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #1e293b; color: #94a3b8; font-size: 13px; line-height: 1.6;">
        <strong style="color: #f1f5f9;">Militaru Tiberiu Nicolae</strong><br />
        <span style="color: #64748b; font-size: 12px;">Web Developer &amp; IT Consultant</span><br />
        <span style="color: #64748b; font-size: 12px;">Website: <a href="https://www.tiberiumilitaru.ro" style="color: #38bdf8; text-decoration: none;">www.tiberiumilitaru.ro</a> &bull; Email: <a href="mailto:contact@tiberiumilitaru.ro" style="color: #38bdf8; text-decoration: none;">contact@tiberiumilitaru.ro</a> &bull; Telefon: +40 720 955 119</span>
      </div>
    </div>
    <div style="background: #090e1a; padding: 14px 24px; text-align: center; border-top: 1px solid #1e293b; font-size: 11px; color: #64748b;">
      Confirmare automată generată de platforma www.tiberiumilitaru.ro &bull; Ploiești, România
    </div>
  </div>
</body>
</html>`;
}

function sendProblem(res, status, title, detail, correlationId, invalidParams = []) {
    if (typeof res.setHeader === 'function') {
        res.setHeader('Content-Type', 'application/problem+json');
        res.setHeader('Cache-Control', 'no-store, max-age=0');
        res.setHeader('X-Correlation-ID', correlationId);
    }
    const payload = {
        type: `https://www.tiberiumilitaru.ro/problems/http-${status}`,
        title,
        status,
        detail,
        instance: '/api/contact',
        correlation_id: correlationId,
        error: detail
    };
    if (invalidParams.length > 0) {
        payload.invalid_params = invalidParams;
    }
    return res.status(status).json(payload);
}

function resolveClientIp(req) {
    const vercelForwarded = req.headers?.['x-vercel-forwarded-for'];
    const vercelIp = req.headers?.['x-vercel-ip'];
    const forwarded = req.headers?.['x-forwarded-for'];
    const realIp = req.headers?.['x-real-ip'];
    return (typeof vercelForwarded === 'string' && vercelForwarded.trim() ? vercelForwarded.split(',')[0].trim() : '')
        || (typeof vercelIp === 'string' && vercelIp.trim() ? vercelIp.trim() : '')
        || req.socket?.remoteAddress
        || (typeof forwarded === 'string' && forwarded.trim() ? forwarded.split(',')[0].trim() : '')
        || (typeof realIp === 'string' && realIp.trim() ? realIp.trim() : '')
        || 'unknown';
}

function validateContactStructure(rawBody) {
    if (rawBody === null || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
        return { ok: false, status: 400, title: 'Validation Error', detail: 'Structura cererii trebuie să fie un obiect JSON valid.', invalidParams: [{ name: 'body', reason: 'Obiect JSON invalid.' }] };
    }
    const proto = Object.getPrototypeOf(rawBody);
    if (proto !== Object.prototype && proto !== null) {
        return { ok: false, status: 400, title: 'Validation Error', detail: 'Structură de obiect nepermisă.', invalidParams: [{ name: 'body', reason: 'Prototip neautorizat.' }] };
    }

    const keys = Object.getOwnPropertyNames(rawBody);
    for (const key of keys) {
        if (FORBIDDEN_PROTO_KEYS.has(key) || !ALLOWED_BODY_KEYS.has(key)) {
            return {
                ok: false,
                status: 400,
                title: 'Validation Error',
                detail: 'Cererea conține câmpuri neautorizate.',
                invalidParams: [{ name: key, reason: 'Câmp nepermis în payload.' }]
            };
        }
    }

    if (Buffer.byteLength(JSON.stringify(rawBody), 'utf8') > MAX_PAYLOAD_BYTES) {
        return { ok: false, status: 413, title: 'Payload Too Large', detail: 'Dimensiunea cererii depășește limita admisă.', invalidParams: [] };
    }

    return { ok: true, body: rawBody };
}

async function sendResendEmail({ apiKey, from, to, replyTo, subject, html }) {
    return fetch('https://api.resend.com/emails', {
        method: 'POST',
        signal: AbortSignal.timeout(10000),
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from,
            to,
            reply_to: replyTo,
            subject,
            html
        })
    });
}

export default async function handler(req, res) {
    const incomingCorrId = typeof req.headers?.['x-correlation-id'] === 'string'
        ? req.headers['x-correlation-id'].trim()
        : '';
    const correlationId = CORRELATION_ID_REGEX.test(incomingCorrId)
        ? incomingCorrId
        : `msg_${randomUUID().replace(/-/g, '').slice(0, 12)}`;

    if (typeof res.setHeader === 'function') {
        res.setHeader('Cache-Control', 'no-store, max-age=0');
        res.setHeader('X-Correlation-ID', correlationId);
    }

    // 1. CORS Origin, Sec-Fetch-Site & Preflight Validation
    const allowedOrigins = getAllowedOrigins();
    const origin = typeof req.headers?.['origin'] === 'string' ? req.headers['origin'].trim() : '';
    const secFetchSite = typeof req.headers?.['sec-fetch-site'] === 'string'
        ? req.headers['sec-fetch-site'].trim().toLowerCase()
        : '';

    if (origin && !allowedOrigins.has(origin)) {
        logStructured('warn', 'Forbidden origin blocked', correlationId, { origin });
        return sendProblem(res, 403, 'Forbidden Origin', 'Originea cererii nu este autorizată.', correlationId);
    }
    if (secFetchSite && !ALLOWED_FETCH_SITES.has(secFetchSite)) {
        logStructured('warn', 'Forbidden cross-site fetch blocked', correlationId, { secFetchSite });
        return sendProblem(res, 403, 'Forbidden Origin', 'Originea cererii nu este autorizată.', correlationId);
    }
    if (origin && allowedOrigins.has(origin) && typeof res.setHeader === 'function') {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, X-Correlation-ID');
        res.setHeader('Vary', 'Origin');
    }

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    // 2. Doar cereri POST permise + Origin obligatoriu pe POST
    if (req.method !== 'POST') {
        return sendProblem(res, 405, 'Method Not Allowed', 'Method Not Allowed', correlationId);
    }

    if (!origin || !allowedOrigins.has(origin)) {
        logStructured('warn', 'Missing or disallowed Origin on POST blocked', correlationId, { origin: origin || 'missing' });
        return sendProblem(res, 403, 'Forbidden Origin', 'Originea cererii nu este autorizată.', correlationId);
    }

    const contentType = typeof req.headers?.['content-type'] === 'string'
        ? req.headers['content-type'].trim().toLowerCase()
        : '';
    if ((process.env.VERCEL && !contentType.startsWith('application/json')) || (contentType && !contentType.startsWith('application/json'))) {
        return sendProblem(res, 415, 'Unsupported Media Type', 'Cererea trebuie transmisă în format application/json.', correlationId);
    }

    // 2.1 Sliding Window Rate Limiting per IP (Anti-flood / DoS defense)
    const clientIp = resolveClientIp(req);
    if (await isRateLimited(clientIp)) {
        logStructured('warn', 'Rate limit exceeded for IP', correlationId, { ip: maskIp(clientIp) });
        return sendProblem(res, 429, 'Too Many Requests', 'Prea multe cereri. Te rog să aștepți un minut înainte de a trimite din nou.', correlationId);
    }

    // 2.2 Denial-of-Wallet Payload Size Guard (max 16 KB pre-parse header + post-parse verify)
    const contentLength = Number(req.headers?.['content-length'] || 0);
    if (Number.isFinite(contentLength) && contentLength > MAX_PAYLOAD_BYTES) {
        logStructured('warn', 'Payload size limit exceeded', correlationId, { ip: maskIp(clientIp), contentLength });
        return sendProblem(res, 413, 'Payload Too Large', 'Dimensiunea cererii depășește limita admisă.', correlationId);
    }

    try {
        // 3. Validare strictă structură & anti-Prototype Pollution
        const structureCheck = validateContactStructure(req.body);
        if (!structureCheck.ok) {
            return sendProblem(
                res,
                structureCheck.status,
                structureCheck.title,
                structureCheck.detail,
                correlationId,
                structureCheck.invalidParams
            );
        }
        const { body } = structureCheck;

        // 4. Honeypot check (Capcană bot invizibilă pe server)
        if (body._gotcha !== undefined && typeof body._gotcha !== 'string') {
            return sendProblem(res, 400, 'Validation Error', 'Câmp invalid.', correlationId, [{ name: '_gotcha', reason: 'Tip invalid.' }]);
        }
        if (typeof body._gotcha === 'string' && body._gotcha.trim() !== '') {
            logStructured('warn', 'Bot trapped via honeypot field', correlationId, { ip: maskIp(clientIp) });
            return res.status(200).json({ success: true, message: 'Mesajul a fost recepționat.' });
        }

        // 4.1 Time-based bot defense (Submisiile fără durată, non-finite sau < 1.2s sunt neutralizate silențios)
        if (
            typeof body._formDuration !== 'number'
            || !Number.isFinite(body._formDuration)
            || body._formDuration < MIN_HUMAN_INTERACTION_MS
            || body._formDuration > MAX_HUMAN_INTERACTION_MS
        ) {
            logStructured('warn', 'Bot trapped via invalid or missing submission duration threshold', correlationId, {
                ip: maskIp(clientIp),
                durationMs: body._formDuration
            });
            return res.status(200).json({ success: true, message: 'Mesajul a fost recepționat.' });
        }

        // 4.2 Validare tipuri & sanitizare la graniță
        if (typeof body.name !== 'string') {
            return sendProblem(res, 400, 'Validation Error', 'Numele trebuie să conțină între 2 și 100 de caractere.', correlationId, [{ name: 'name', reason: 'Text invalid.' }]);
        }
        if (typeof body.email !== 'string') {
            return sendProblem(res, 400, 'Validation Error', 'Adresă de email invalidă.', correlationId, [{ name: 'email', reason: 'Text invalid.' }]);
        }
        if (typeof body.message !== 'string') {
            return sendProblem(res, 400, 'Validation Error', 'Mesajul trebuie să aibă între 10 și 5000 de caractere.', correlationId, [{ name: 'message', reason: 'Text invalid.' }]);
        }

        const sanitizedName = sanitize(body.name);
        const sanitizedEmail = sanitize(body.email);
        const rawServiceInput = body.service !== undefined ? body.service : (body.type !== undefined ? body.type : 'General');
        const rawService = typeof rawServiceInput === 'string' ? sanitize(rawServiceInput) : 'General';
        const sanitizedType = ALLOWED_SERVICES.has(rawService) ? rawService : 'General';
        const sanitizedMessage = sanitize(body.message);

        if (!sanitizedName || sanitizedName.length < 2 || sanitizedName.length > 100) {
            return sendProblem(res, 400, 'Validation Error', 'Numele trebuie să conțină între 2 și 100 de caractere.', correlationId, [{ name: 'name', reason: 'Lungime între 2 și 100 de caractere.' }]);
        }

        if (!sanitizedEmail || !EMAIL_REGEX.test(sanitizedEmail) || sanitizedEmail.length > 120) {
            return sendProblem(res, 400, 'Validation Error', 'Adresă de email invalidă.', correlationId, [{ name: 'email', reason: 'Format email invalid.' }]);
        }

        if (!sanitizedMessage || sanitizedMessage.length < 10 || sanitizedMessage.length > 5000) {
            return sendProblem(res, 400, 'Validation Error', 'Mesajul trebuie să aibă între 10 și 5000 de caractere.', correlationId, [{ name: 'message', reason: 'Lungime între 10 și 5000 de caractere.' }]);
        }

        // 4.3 Rate limiting secundar per destinatar/email (protecție împotriva flood-ului distribuit multi-IP)
        if (await isEmailRateLimited(sanitizedEmail)) {
            logStructured('warn', 'Rate limit exceeded for email', correlationId, { clientEmail: maskEmail(sanitizedEmail) });
            return sendProblem(res, 429, 'Too Many Requests', 'Prea multe cereri pentru această adresă. Te rog să aștepți un minut înainte de a trimite din nou.', correlationId);
        }

        // 5. Configurare variabile Resend API (suportă atât RESEND_API_KEY cât și RESENDAPIKEY)
        const rawKey = process.env.RESEND_API_KEY || process.env.RESENDAPIKEY || '';
        const apiKey = typeof rawKey === 'string' ? rawKey.trim() : '';
        const adminRecipient = process.env.ADMIN_NOTIFICATION_EMAIL || 'tiberiumilitaru89@gmail.com';
        const fromEmail = process.env.NOTIFICATION_FROM_EMAIL || 'Militaru Tiberiu Nicolae <contact@tiberiumilitaru.ro>';

        if (!process.env.ADMIN_NOTIFICATION_EMAIL) {
            logStructured('warn', 'Using fallback admin email recipient', correlationId, { recipient: maskEmail(adminRecipient) });
        }

        if (!apiKey) {
            logStructured('error', 'Configuration error: RESEND_API_KEY is missing in environment variables', correlationId);
            return sendProblem(res, 500, 'Configuration Error', 'Eroare de configurare server. Te rog să mă contactezi direct pe WhatsApp sau email.', correlationId);
        }

        const dateFormatted = new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' });
        const maskedClientIp = maskIp(clientIp);

        // 6. Expediere Alerta Administrator (Critică)
        const adminSubject = `[Militaru Tiberiu Nicolae] Mesaj nou de la ${sanitizedName} (${sanitizedType})`;
        const adminEmailHtml = buildAdminEmailHtml({
            name: sanitizedName,
            email: sanitizedEmail,
            service: sanitizedType,
            message: sanitizedMessage,
            dateFormatted,
            clientIp: maskedClientIp
        });

        const adminRes = await sendResendEmail({
            apiKey,
            from: fromEmail,
            to: [adminRecipient],
            replyTo: sanitizedEmail,
            subject: adminSubject,
            html: adminEmailHtml
        });

        if (!adminRes.ok) {
            logStructured('error', 'Resend API admin notification failed', correlationId, {
                status: adminRes.status
            });
            return sendProblem(res, 502, 'Bad Gateway', 'Eroare la transmiterea email-ului către serverul de mesagerie.', correlationId);
        }

        let adminData = null;
        try {
            adminData = await adminRes.json();
        } catch (_) {
            adminData = null;
        }

        logStructured('info', 'Admin notification delivered via Resend', correlationId, {
            resendId: adminData?.id,
            service: sanitizedType,
            clientEmail: maskEmail(sanitizedEmail)
        });

        // 7. Expediere Confirmare Automată Client (Dual-Dispatch Non-Blocant)
        try {
            const clientSubject = 'Confirmare primire mesaj — Militaru Tiberiu Nicolae';
            const clientEmailHtml = buildClientEmailHtml({
                name: sanitizedName,
                service: sanitizedType,
                dateFormatted
            });

            const clientRes = await sendResendEmail({
                apiKey,
                from: fromEmail,
                to: [sanitizedEmail],
                replyTo: adminRecipient,
                subject: clientSubject,
                html: clientEmailHtml
            });

            if (!clientRes.ok) {
                logStructured('warn', 'Client auto-responder rejected by Resend', correlationId, {
                    status: clientRes.status
                });
            } else {
                logStructured('info', 'Client auto-responder sent successfully', correlationId, {
                    clientEmail: maskEmail(sanitizedEmail)
                });
            }
        } catch (autoReplyError) {
            // Nu blocăm răspunsul de succes către client dacă auto-responderul opțional eșuează sau dă timeout
            logStructured('warn', 'Client auto-responder failed or timed out', correlationId, {
                errorName: autoReplyError instanceof Error ? autoReplyError.name : 'AutoReplyError'
            });
        }

        // 8. Răspuns de succes confirmat către frontend
        return res.status(200).json({ success: true, message: 'Mesajul tău a fost transmis cu succes!' });

    } catch (error) {
        logStructured('error', 'Unexpected server error in contact handler', correlationId, {
            errorName: error instanceof Error ? error.name : 'UnknownError'
        });
        return sendProblem(res, 500, 'Internal Server Error', 'A apărut o eroare neașteptată la procesarea solicitării.', correlationId);
    }
}
