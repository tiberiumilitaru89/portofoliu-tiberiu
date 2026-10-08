// In-memory sliding window rate limiter for Serverless container defense
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minut
const MAX_REQUESTS_PER_WINDOW = 5;
const MIN_HUMAN_INTERACTION_MS = 2500; // Prag minim de interacțiune umană anti-bot

function cleanupRateLimits() {
    if (rateLimitMap.size > 500) {
        const now = Date.now();
        for (const [ip, record] of rateLimitMap.entries()) {
            if (now - record.startTime > RATE_LIMIT_WINDOW_MS) {
                rateLimitMap.delete(ip);
            }
        }
    }
}

function isRateLimited(ip) {
    if (!ip || ip === 'unknown') return false;
    cleanupRateLimits();

    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now - record.startTime > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.set(ip, { count: 1, startTime: now });
        return false;
    }

    if (record.count >= MAX_REQUESTS_PER_WINDOW) {
        return true;
    }

    record.count += 1;
    return false;
}

function sanitize(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/<[^>]*>?/gm, '').trim();
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
    const maskedUser = user.length <= 2 ? user[0] + '*' : user[0] + '***' + user.slice(-1);
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
        Portofoliu Tiberiu Militaru &bull; Alertă Mesaj Nou
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
          <td style="padding: 10px 14px; color: #334155;">${dateFormatted} (București)</td>
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
            <td style="color: #f1f5f9; padding: 4px 0;">${dateFormatted} (București)</td>
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
        <span style="color: #64748b; font-size: 12px;">Website: <a href="https://www.tiberiumilitaru.ro" style="color: #38bdf8; text-decoration: none;">www.tiberiumilitaru.ro</a> &bull; Telefon: +40 720 955 119</span>
      </div>
    </div>
    <div style="background: #090e1a; padding: 14px 24px; text-align: center; border-top: 1px solid #1e293b; font-size: 11px; color: #64748b;">
      Confirmare automată generată de platforma www.tiberiumilitaru.ro &bull; Ploiești, România
    </div>
  </div>
</body>
</html>`;
}

export default async function handler(req, res) {
    const correlationId = 'msg_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);

    // 1. CORS & Preflight checks
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. Doar cereri POST permise
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 2.1 Sliding Window Rate Limiting (Anti-flood / DoS defense)
    const forwarded = req.headers['x-forwarded-for'];
    const clientIp = typeof forwarded === 'string'
        ? forwarded.split(',')[0].trim()
        : (req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown');

    if (isRateLimited(clientIp)) {
        logStructured('warn', 'Rate limit exceeded for IP', correlationId, { ip: maskIp(clientIp) });
        return res.status(429).json({ error: 'Prea multe cereri. Te rog să aștepți un minut înainte de a trimite din nou.' });
    }

    try {
        // 3. Extragere payload
        const body = req.body || {};

        // 4. Honeypot check (Capcană bot invizibilă pe server)
        if (body._gotcha && typeof body._gotcha === 'string' && body._gotcha.trim() !== '') {
            logStructured('warn', 'Bot trapped via honeypot field', correlationId, { ip: maskIp(clientIp) });
            return res.status(200).json({ success: true, message: 'Mesajul a fost recepționat.' });
        }

        // 4.1 Time-based bot defense (Submisiile mai rapide de 2.5s sunt ignorate)
        if (typeof body._formDuration === 'number' && body._formDuration < MIN_HUMAN_INTERACTION_MS) {
            logStructured('warn', 'Bot trapped via submission time threshold', correlationId, {
                ip: maskIp(clientIp),
                durationMs: body._formDuration
            });
            return res.status(200).json({ success: true, message: 'Mesajul a fost recepționat.' });
        }

        // 4.2 Sanitizare și validare la graniță
        const sanitizedName = sanitize(body.name);
        const sanitizedEmail = sanitize(body.email);
        const sanitizedType = sanitize(body.service || body.type || 'General');
        const sanitizedMessage = sanitize(body.message);

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!sanitizedName || sanitizedName.length < 2 || sanitizedName.length > 100) {
            return res.status(400).json({ error: 'Numele trebuie să conțină între 2 și 100 de caractere.' });
        }

        if (!sanitizedEmail || !emailRegex.test(sanitizedEmail) || sanitizedEmail.length > 120) {
            return res.status(400).json({ error: 'Adresă de email invalidă.' });
        }

        if (!sanitizedMessage || sanitizedMessage.length < 10 || sanitizedMessage.length > 5000) {
            return res.status(400).json({ error: 'Mesajul trebuie să aibă între 10 și 5000 de caractere.' });
        }

        // 5. Configurare variabile Resend API (suportă atât RESEND_API_KEY cât și RESENDAPIKEY)
        const rawKey = process.env.RESEND_API_KEY || process.env.RESENDAPIKEY || '';
        const apiKey = typeof rawKey === 'string' ? rawKey.trim() : '';
        const adminRecipient = process.env.ADMIN_NOTIFICATION_EMAIL || 'tiberiumilitaru89@gmail.com';
        const fromEmail = process.env.NOTIFICATION_FROM_EMAIL || 'Militaru Tiberiu Nicolae <contact@tiberiumilitaru.ro>';

        if (!apiKey) {
            logStructured('error', 'Configuration error: RESEND_API_KEY is missing in environment variables', correlationId);
            return res.status(500).json({ error: 'Eroare de configurare server. Te rog să mă contactezi direct pe WhatsApp sau email.' });
        }

        const dateFormatted = new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' });

        // 6. Expediere Alerta Administrator (Critică)
        const adminSubject = `[Portofoliu] Mesaj nou de la ${sanitizedName} (${sanitizedType})`;
        const adminEmailHtml = buildAdminEmailHtml({
            name: sanitizedName,
            email: sanitizedEmail,
            service: sanitizedType,
            message: sanitizedMessage,
            dateFormatted,
            clientIp
        });

        const adminRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            signal: AbortSignal.timeout(10000),
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: fromEmail,
                to: [adminRecipient],
                reply_to: sanitizedEmail,
                subject: adminSubject,
                html: adminEmailHtml
            })
        });

        if (!adminRes.ok) {
            const errorDetails = await adminRes.text();
            logStructured('error', 'Resend API admin notification failed', correlationId, {
                status: adminRes.status,
                details: errorDetails
            });
            return res.status(502).json({ error: 'Eroare la transmiterea email-ului către serverul de mesagerie.' });
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

            const clientRes = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                signal: AbortSignal.timeout(10000),
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: fromEmail,
                    to: [sanitizedEmail],
                    reply_to: adminRecipient,
                    subject: clientSubject,
                    html: clientEmailHtml
                })
            });

            if (!clientRes.ok) {
                const clientErr = await clientRes.text();
                logStructured('warn', 'Client auto-responder rejected by Resend', correlationId, {
                    status: clientRes.status,
                    details: clientErr
                });
            } else {
                logStructured('info', 'Client auto-responder sent successfully', correlationId, {
                    clientEmail: maskEmail(sanitizedEmail)
                });
            }
        } catch (autoReplyError) {
            // Nu blocăm răspunsul de succes către client dacă auto-responderul opțional eșuează sau dă timeout
            logStructured('warn', 'Client auto-responder failed or timed out', correlationId, {
                error: autoReplyError.message
            });
        }

        // 8. Răspuns de succes confirmat către frontend
        return res.status(200).json({ success: true, message: 'Mesajul tău a fost transmis cu succes!' });

    } catch (error) {
        logStructured('error', 'Unexpected server error in contact handler', correlationId, {
            error: error.message,
            stack: error.stack
        });
        return res.status(500).json({ error: 'A apărut o eroare neașteptată la procesarea solicitării.' });
    }
}
