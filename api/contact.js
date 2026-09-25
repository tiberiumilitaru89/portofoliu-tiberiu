export default async function handler(req, res) {
    // 1. CORS & Preflight checks
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // 3. Extract payload
        const body = req.body;
        
        // 4. Honeypot check (Server-side defense)
        // If the hidden '_gotcha' field is filled, it's a bot. Silently drop it.
        if (body._gotcha && body._gotcha.trim() !== '') {
            return res.status(200).json({ success: true, message: 'Bot trapped silently.' });
        }

        // 5. Fetch secret Formspree URL from Vercel Environment Variables
        // This keeps the endpoint entirely invisible from the frontend
        const FORMSPREE_URL = process.env.FORMSPREE_URL;

        if (!FORMSPREE_URL) {
            console.error('Critical: FORMSPREE_URL environment variable is missing in Vercel settings.');
            return res.status(500).json({ error: 'Server configuration error.' });
        }

        // 6. Forward the request to Formspree securely from the Vercel Node.js Server
        const response = await fetch(FORMSPREE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: body.name,
                email: body.email,
                type: body.type,
                message: body.message,
                _replyto: body.email // Allows replying directly to the user
            })
        });

        const data = await response.json();

        // 7. Send the response back to our frontend
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
