// @ts-check
const CORRELATION_ID_REGEX = /^[a-zA-Z0-9_-]{8,64}$/;

export default function handler(req, res) {
    const incomingCorrId = typeof req?.headers?.['x-correlation-id'] === 'string'
        ? req.headers['x-correlation-id'].trim()
        : '';
    const correlationId = CORRELATION_ID_REGEX.test(incomingCorrId)
        ? incomingCorrId
        : 'hlth_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);

    if (typeof res.setHeader === 'function') {
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('X-Correlation-ID', correlationId);
    }

    if (req?.method && req.method !== 'GET' && req.method !== 'HEAD') {
        if (typeof res.setHeader === 'function') {
            res.setHeader('Content-Type', 'application/problem+json');
        }
        return res.status(405).json({
            type: 'https://www.tiberiumilitaru.ro/problems/http-405',
            title: 'Method Not Allowed',
            status: 405,
            detail: 'Only GET and HEAD requests are supported on /healthz.',
            instance: '/api/healthz',
            correlation_id: correlationId,
            error: 'Method Not Allowed'
        });
    }

    return res.status(200).json({
        status: 'ok',
        service: 'portofoliu-tiberiu',
        timestamp: new Date().toISOString(),
        correlation_id: correlationId
    });
}
