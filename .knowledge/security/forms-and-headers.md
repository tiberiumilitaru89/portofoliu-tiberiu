---
id: forms-and-headers
domain: security
last_verified: 2026-10-02
dependencies: ["portfolio-root-index"]
---

# Securitate, Rute & Formulare

## 1. Măsuri Defensive Formular Contact
* Câmp Honeypot (`_gotcha`) ascuns de CSS/ARIA pentru stoparea botilor automați.
* Validare pe server prin endpoint securizat Formspree cu `POST`.
* Validare strictă de regex email pe client înainte de trimitere.
* Sanitizare input împotriva injecțiilor de script / XSS.

## 2. Navigare Externă Securizată
* Toate link-urile către resurse externe (GitHub, LinkedIn, WhatsApp, Demo-uri) utilizează obligatoriu:
  `rel="noopener noreferrer"` și `target="_blank"`.

## 3. Politici de Redirecționare & Izolare Domeniu Canonic
* Redirecționare permanentă (308/301) din domeniul implicit Vercel (`portofoliu-tiberiu.vercel.app`) către domeniul canonic de producție (`https://www.tiberiumilitaru.ro/:path*`).
* Izolare strictă prin condiția de `host` în `vercel.json` pentru a împiedica buclele infinite de redirect (`ERR_TOO_MANY_REDIRECTS`) cauzate de partajarea aceluiași deployment Vercel între domenii.

