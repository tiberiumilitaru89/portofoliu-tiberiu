---
id: forms-and-headers
domain: security
last_verified: 2026-10-01
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
