// In-memory sliding window rate limiter for Serverless container defense
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;
const MIN_HUMAN_INTERACTION_MS = 2500; // Time-based bot trap threshold

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

export default async function handler(req, res) {
    // 1. CORS & Preflight checks
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 2.1 Sliding Window Rate Limiting (Anti-flood / DoS defense)
    const forwarded = req.headers['x-forwarded-for'];
    const clientIp = typeof forwarded === 'string' 
        ? forwarded.split(',')[0].trim() 
        : (req.socket?.remoteAddress || 'unknown');

    if (isRateLimited(clientIp)) {
        return res.status(429).json({ error: 'Too many requests. Please wait a minute before submitting again.' });
    }

    try {
        // 3. Extract payload
        const body = req.body || {};
        
        // 4. Honeypot check (Server-side invisible bot trap)
        if (body._gotcha && typeof body._gotcha === 'string' && body._gotcha.trim() !== '') {
            return res.status(200).json({ success: true, message: 'Bot trapped silently.' });
        }

        // 4.1 Time-based bot defense (Submissions faster than human threshold are dropped)
        if (typeof body._formDuration === 'number' && body._formDuration < MIN_HUMAN_INTERACTION_MS) {
            return res.status(200).json({ success: true, message: 'Bot trapped silently.' });
        }

        // 4.2 Sanitization and boundary validation
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

        // 5. Fetch secret Formspree URL from Vercel Environment Variables
        const FORMSPREE_URL = process.env.FORMSPREE_URL;

        if (!FORMSPREE_URL) {
            console.error('Critical: FORMSPREE_URL environment variable is missing in Vercel settings.');
            return res.status(500).json({ error: 'Server configuration error.' });
        }

        // 6. Forward sanitized payload to Formspree securely
        const response = await fetch(FORMSPREE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: sanitizedName,
                email: sanitizedEmail,
                type: sanitizedType,
                message: sanitizedMessage,
                _replyto: sanitizedEmail
            })
        });

        const data = await response.json();

        // 7. Send the response back to frontend
        if (response.ok) {
            return res.status(200).json({ success: true, data });
        } else {
            console.error('Formspree rejected the request:', data);
            return res.status(400).json({ error: 'Failed to send message via provider.', details: data });
        }
        
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal Server Error.' });
    }
}
