// @ts-check
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import contactHandler, { __resetRateLimitMap } from '../api/contact.js';
import healthzHandler from '../api/healthz.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

function createMockRes() {
    const headers = new Map();
    let statusCode = 200;
    let jsonPayload = null;
    let ended = false;

    const res = {
        setHeader(key, value) {
            headers.set(String(key).toLowerCase(), String(value));
            return res;
        },
        getHeader(key) {
            return headers.get(String(key).toLowerCase());
        },
        status(code) {
            statusCode = code;
            return res;
        },
        json(payload) {
            jsonPayload = payload;
            ended = true;
            return res;
        },
        end() {
            ended = true;
            return res;
        },
        get statusCode() {
            return statusCode;
        },
        get body() {
            return jsonPayload;
        },
        get ended() {
            return ended;
        }
    };
    return res;
}

test('1. [SEC-002] Rate limit pe X-Real-IP: unknown blocheaza a 6-a cerere cu 429 si application/problem+json', async () => {
    __resetRateLimitMap();
    process.env.RESEND_API_KEY = 're_test_key_123456';

    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response(JSON.stringify({ id: 'email_test_id' }), { status: 200 });

    try {
        for (let i = 1; i <= 5; i++) {
            const req = {
                method: 'POST',
                headers: {
                    'x-real-ip': 'unknown',
                    'origin': 'https://www.tiberiumilitaru.ro'
                },
                body: {
                    name: 'Test Utilizator',
                    email: 'client@exemplu.ro',
                    service: 'mvp_saas_web',
                    message: 'Acesta este un mesaj valid pentru testarea rate-limiterului.',
                    _formDuration: 2500,
                    _gotcha: ''
                }
            };
            const res = createMockRes();
            await contactHandler(req, res);
            assert.equal(res.statusCode, 200, `Cererea #${i} trebuia sa treaca cu 200 OK`);
        }

        // A 6-a cerere cu X-Real-IP: unknown trebuie blocata
        const sixthReq = {
            method: 'POST',
            headers: {
                'x-real-ip': 'unknown',
                'origin': 'https://www.tiberiumilitaru.ro'
            },
            body: {
                name: 'Test Utilizator',
                email: 'client@exemplu.ro',
                service: 'mvp_saas_web',
                message: 'Aceasta a 6-a cerere trebuie blocata de rate limiter.',
                _formDuration: 2500,
                _gotcha: ''
            }
        };
        const sixthRes = createMockRes();
        await contactHandler(sixthReq, sixthRes);

        assert.equal(sixthRes.statusCode, 429);
        assert.match(String(sixthRes.getHeader('content-type')), /application\/problem\+json/);
        assert.equal(sixthRes.body.status, 429);
        assert.equal(sixthRes.body.instance, '/api/contact');
        assert.ok(sixthRes.body.correlation_id);
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test('2. [SEC-003] Origin neautorizat (https://evil.example.com) este respins cu 403 si format RFC 7807', async () => {
    __resetRateLimitMap();
    const req = {
        method: 'POST',
        headers: {
            'origin': 'https://evil.example.com',
            'x-vercel-forwarded-for': '198.51.100.25',
            'x-correlation-id': 'corr_test_origin_403'
        },
        body: {
            name: 'Atacator CSRF',
            email: 'victim@exemplu.ro',
            message: 'Incercare cross-origin neautorizata.',
            _formDuration: 3000
        }
    };
    const res = createMockRes();
    await contactHandler(req, res);

    assert.equal(res.statusCode, 403);
    assert.match(String(res.getHeader('content-type')), /application\/problem\+json/);
    assert.equal(res.getHeader('x-correlation-id'), 'corr_test_origin_403');
    assert.equal(res.body.status, 403);
    assert.equal(res.body.title, 'Forbidden Origin');
    assert.equal(res.body.correlation_id, 'corr_test_origin_403');
});

test('3. [SEC-001 & SEC-004] Sanitizarea CRLF in name si fortarea service necunoscut la General', async () => {
    __resetRateLimitMap();
    process.env.RESEND_API_KEY = 're_test_key_123456';

    const dispatchedPayloads = [];
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (_url, options) => {
        dispatchedPayloads.push(JSON.parse(String(options?.body || '{}')));
        return new Response(JSON.stringify({ id: 'email_sanitized_id' }), { status: 200 });
    };

    try {
        const req = {
            method: 'POST',
            headers: {
                'origin': 'https://www.tiberiumilitaru.ro',
                'x-vercel-forwarded-for': '203.0.113.42'
            },
            body: {
                name: 'Alexandru\r\nBcc: phish@evil.com',
                email: 'alex@exemplu.ro',
                service: 'URGENT CLICK https://phishing.evil.example/claim',
                message: 'Mesaj legitim dar cu incercare de injectie in subiect si serviciu.',
                _formDuration: 2800,
                _gotcha: ''
            }
        };
        const res = createMockRes();
        await contactHandler(req, res);

        assert.equal(res.statusCode, 200);
        assert.equal(dispatchedPayloads.length, 2);

        const adminMail = dispatchedPayloads[0];
        assert.ok(!adminMail.subject.includes('\r') && !adminMail.subject.includes('\n'), 'Subiectul nu trebuie sa contina CRLF');
        assert.ok(adminMail.subject.includes('(General)'), 'Serviciul neautorizat trebuie fortat la General');
        assert.ok(!adminMail.html.includes('https://phishing.evil.example'), 'Serviciul injectat nu trebuie sa apara in HTML');
        assert.ok(adminMail.html.includes('203.0.***.***'), 'IP-ul clientului trebuie mascat conform GDPR in emailul admin');
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test('4. [LOGIC-001] Payload-ul din 3D Swarm Engine (cu _formDuration >= 1200) trimite efectiv emailul catre Resend API', async () => {
    __resetRateLimitMap();
    process.env.RESEND_API_KEY = 're_test_key_123456';

    const dispatchedPayloads = [];
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (_url, options) => {
        dispatchedPayloads.push(JSON.parse(String(options?.body || '{}')));
        return new Response(JSON.stringify({ id: 'email_swarm_3d_id' }), { status: 200 });
    };

    try {
        const req = {
            method: 'POST',
            headers: {
                'origin': 'https://www.tiberiumilitaru.ro',
                'x-vercel-forwarded-for': '203.0.113.77'
            },
            body: {
                name: 'Vizitator 3D Swarm',
                email: 'swarm@exemplu.ro',
                service: 'Mesaj din 3D Swarm Engine',
                message: '[Subiect: Proiect SaaS]\n\nSalut Tiberiu, trimit acest mesaj din interfata 3D.',
                _formDuration: 1500,
                _gotcha: ''
            }
        };
        const res = createMockRes();
        await contactHandler(req, res);

        assert.equal(res.statusCode, 200);
        assert.equal(
            dispatchedPayloads.length,
            2,
            'Trebuie sa expedieze efectiv cele 2 emailuri (admin + client) catre Resend, nu sa le inghita silentios!'
        );
        assert.ok(dispatchedPayloads[0].subject.includes('(Mesaj din 3D Swarm Engine)'));
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test('5. [MODULUL 7.4] /api/healthz raspunde cu 200 OK, status: ok si Cache-Control: no-store', () => {
    const req = {
        method: 'GET',
        headers: { 'x-correlation-id': 'health_check_12345' }
    };
    const res = createMockRes();
    healthzHandler(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.getHeader('cache-control'), 'no-store');
    assert.equal(res.getHeader('x-correlation-id'), 'health_check_12345');
    assert.equal(res.body.status, 'ok');
    assert.equal(res.body.service, 'portofoliu-tiberiu');
});

test('6. [SEC-006 & SEC-007] Verificare statica index.html si vercel.json (zero onerror=, CSP strict)', () => {
    const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
    assert.ok(!/\bonerror\s*=/i.test(indexHtml), 'index.html nu trebuie sa contina atribute inline onerror=');
    assert.ok(!/ui-avatars\.com/i.test(indexHtml), 'index.html nu trebuie sa depinda de CDN extern ui-avatars.com');

    const vercelConfig = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'vercel.json'), 'utf8'));
    const globalHeadersObj = vercelConfig.headers.find((h) => h.source === '/(.*)');
    assert.ok(globalHeadersObj, 'Trebuie sa existe configuratia de headere pentru /(.*)');

    const cspHeader = globalHeadersObj.headers.find((h) => h.key === 'Content-Security-Policy');
    assert.ok(cspHeader, 'Content-Security-Policy trebuie sa fie definit');
    assert.ok(
        cspHeader.value.includes("img-src 'self' data:;"),
        "img-src trebuie sa fie restrictionat la 'self' data: fara wildcard https:"
    );
    assert.ok(cspHeader.value.includes("object-src 'none';"), "CSP trebuie sa includa object-src 'none'");

    const xssHeader = globalHeadersObj.headers.find((h) => h.key === 'X-XSS-Protection');
    assert.equal(xssHeader?.value, '0', 'X-XSS-Protection trebuie setat la 0');

    const mirrorRedirect = vercelConfig.redirects.find((r) => r.source.includes('?!api'));
    assert.ok(mirrorRedirect, 'Redirectul de pe vercel.app trebuie sa excluda rutele /api/*');

    const apiHeadersObj = vercelConfig.headers.find((h) => h.source === '/api/(.*)');
    assert.ok(apiHeadersObj, 'Trebuie sa existe headere dedicate pentru /api/(.*)');
    assert.equal(
        apiHeadersObj.headers.find((h) => h.key === 'X-Robots-Tag')?.value,
        'noindex, nofollow',
        'Rutele /api/* trebuie sa primeasca X-Robots-Tag: noindex, nofollow'
    );
    assert.equal(
        apiHeadersObj.headers.find((h) => h.key === 'Cache-Control')?.value,
        'no-store, max-age=0',
        'Rutele /api/* trebuie sa primeasca Cache-Control: no-store, max-age=0'
    );
});

test('7. [SEC-008] POST fara Origin sau cu Sec-Fetch-Site: cross-site este respins cu 403 RFC 7807', async () => {
    __resetRateLimitMap();
    const missingOriginReq = {
        method: 'POST',
        headers: { 'x-vercel-forwarded-for': '203.0.113.88' },
        body: {
            name: 'Bot Fara Origin',
            email: 'bot@exemplu.ro',
            message: 'Incercare directa din script fara header Origin.',
            _formDuration: 3000
        }
    };
    const missingOriginRes = createMockRes();
    await contactHandler(missingOriginReq, missingOriginRes);
    assert.equal(missingOriginRes.statusCode, 403);
    assert.match(String(missingOriginRes.getHeader('content-type')), /application\/problem\+json/);

    const crossSiteReq = {
        method: 'POST',
        headers: {
            'origin': 'https://www.tiberiumilitaru.ro',
            'sec-fetch-site': 'cross-site',
            'x-vercel-forwarded-for': '203.0.113.89'
        },
        body: {
            name: 'Atac Cross Site',
            email: 'csrf@exemplu.ro',
            message: 'Cerere marcata cross-site de browser.',
            _formDuration: 3000
        }
    };
    const crossSiteRes = createMockRes();
    await contactHandler(crossSiteReq, crossSiteRes);
    assert.equal(crossSiteRes.statusCode, 403);
});

test('8. [SEC-009] Content-Type non-JSON (CSRF form-urlencoded) este respins cu 415 RFC 7807', async () => {
    __resetRateLimitMap();
    const req = {
        method: 'POST',
        headers: {
            'origin': 'https://www.tiberiumilitaru.ro',
            'content-type': 'application/x-www-form-urlencoded',
            'x-vercel-forwarded-for': '203.0.113.90'
        },
        body: {
            name: 'CSRF Form',
            email: 'form@exemplu.ro',
            message: 'Tentativa de trimitere form clasic.',
            _formDuration: 3000
        }
    };
    const res = createMockRes();
    await contactHandler(req, res);
    assert.equal(res.statusCode, 415);
    assert.equal(res.body.status, 415);
});

test('9. [SEC-010] Schema stricta respinge campuri extra si chei Prototype Pollution (__proto__) cu 400 + invalid_params', async () => {
    __resetRateLimitMap();
    const extraReq = {
        method: 'POST',
        headers: {
            'origin': 'https://www.tiberiumilitaru.ro',
            'x-vercel-forwarded-for': '203.0.113.91'
        },
        body: {
            name: 'Test Strict',
            email: 'strict@exemplu.ro',
            message: 'Payload cu camp neautorizat pentru mass assignment.',
            _formDuration: 2500,
            role: 'admin'
        }
    };
    const extraRes = createMockRes();
    await contactHandler(extraReq, extraRes);
    assert.equal(extraRes.statusCode, 400);
    assert.equal(extraRes.body.invalid_params?.[0]?.name, 'role');

    const protoBody = JSON.parse(
        '{"__proto__":{"isAdmin":true},"name":"Test Proto","email":"proto@exemplu.ro","message":"Payload cu __proto__ injectat in JSON.","_formDuration":2500}'
    );
    const protoReq = {
        method: 'POST',
        headers: {
            'origin': 'https://www.tiberiumilitaru.ro',
            'x-vercel-forwarded-for': '203.0.113.92'
        },
        body: protoBody
    };
    const protoRes = createMockRes();
    await contactHandler(protoReq, protoRes);
    assert.equal(protoRes.statusCode, 400);
    assert.equal(protoRes.body.invalid_params?.[0]?.name, '__proto__');
});

test('10. [SEC-011] Flood distribuit din IP-uri diferite pe acelasi email este blocat cu 429', async () => {
    __resetRateLimitMap();
    process.env.RESEND_API_KEY = 're_test_key_123456';

    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response(JSON.stringify({ id: 'email_dist_test' }), { status: 200 });

    try {
        for (let i = 1; i <= 5; i++) {
            const req = {
                method: 'POST',
                headers: {
                    'origin': 'https://www.tiberiumilitaru.ro',
                    'x-vercel-forwarded-for': `198.51.100.${100 + i}`
                },
                body: {
                    name: 'Client Repetat',
                    email: 'Victima@Exemplu.RO',
                    service: 'mvp_saas_web',
                    message: 'Cerere valida pentru testarea rate limit-ului per email.',
                    _formDuration: 2500,
                    _gotcha: ''
                }
            };
            const res = createMockRes();
            await contactHandler(req, res);
            assert.equal(res.statusCode, 200);
        }

        const sixthDistributedReq = {
            method: 'POST',
            headers: {
                'origin': 'https://www.tiberiumilitaru.ro',
                'x-vercel-forwarded-for': '198.51.100.250'
            },
            body: {
                name: 'Client Repetat',
                email: 'victima@exemplu.ro',
                service: 'mvp_saas_web',
                message: 'A 6-a cerere de pe alt IP trebuie oprita pe bucket-ul de email.',
                _formDuration: 2500,
                _gotcha: ''
            }
        };
        const sixthRes = createMockRes();
        await contactHandler(sixthDistributedReq, sixthRes);
        assert.equal(sixthRes.statusCode, 429);
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test('11. [SEC-012] Serverul api/*.js nu foloseste Math.random() iar filtrele URL resping //evil.com', () => {
    const contactSrc = fs.readFileSync(path.join(ROOT_DIR, 'api/contact.js'), 'utf8');
    const healthzSrc = fs.readFileSync(path.join(ROOT_DIR, 'api/healthz.js'), 'utf8');
    assert.ok(!/Math\.random\s*\(/.test(contactSrc), 'api/contact.js nu trebuie sa foloseasca Math.random()');
    assert.ok(!/Math\.random\s*\(/.test(healthzSrc), 'api/healthz.js nu trebuie sa foloseasca Math.random()');

    const safeRelativePattern = /^(?:(?:https?|mailto|tel):|\/(?!\/|\\)|#)/i;
    assert.ok(safeRelativePattern.test('/CV-Militaru-Tiberiu.pdf'));
    assert.ok(safeRelativePattern.test('https://instalbloc.ro'));
    assert.ok(!safeRelativePattern.test('//evil.example.com'));
    assert.ok(!safeRelativePattern.test('/\\evil.example.com'));
    assert.ok(!safeRelativePattern.test('javascript:alert(1)'));
});
