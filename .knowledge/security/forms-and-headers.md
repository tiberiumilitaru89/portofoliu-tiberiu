---
id: forms-and-headers
domain: security
last_verified: 2026-10-07
dependencies: ["portfolio-root-index"]
---

# Securitate, Rute & Formulare

## 1. Măsuri Defensive Formular Contact & API
* **Câmp Honeypot (`_gotcha`):** ascuns de CSS/ARIA pentru stoparea botilor automați fără consum de backend.
* **Rate Limiting Serverless (Sliding Window):** Prag de maximum 5 cereri per minut per IP client (`x-forwarded-for` / `x-real-ip`) returnând `429 Too Many Requests`.
* **Mascarea Endpoint-ului:** Endpoint-ul real Formspree este stocat exclusiv în variabilele de mediu Vercel (`process.env.FORMSPREE_URL`).
* **Validare pe Client & Server:** Regex strict pentru email, lungimi minime pentru text.

## 2. Navigare Externă Securizată & Terminal CLI Sanitization
* **Link-uri externe:** Toate link-urile către resurse terțe utilizează obligatoriu `rel="noopener noreferrer"` și `target="_blank"`.
* **Terminal CLI Isolation (Zero DOM-XSS):** Comenzile tastate de utilizator și mesajele de eroare pentru comenzi nerecunoscute sunt randate exclusiv prin noduri de text pure (`textContent`), împiedicând orice injecție HTML/XSS în arborele DOM.

## 3. Politici de Redirecționare & Izolare Domeniu Canonic
* Redirecționare permanentă (308) din domeniul implicit Vercel (`portofoliu-tiberiu.vercel.app`) către domeniul canonic de producție (`https://www.tiberiumilitaru.ro/:path*`).
* Redirecționarea se execută strict la nivel de Edge în `vercel.json` (fără scripturi client-side redundante în HTML).
* Izolare strictă prin condiția de `host` în `vercel.json` pentru a împiedica buclele infinite de redirect (`ERR_TOO_MANY_REDIRECTS`).


