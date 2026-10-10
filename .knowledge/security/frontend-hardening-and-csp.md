---
id: portfolio-security-and-csp
domain: security
dependencies: [portofoliu-tiberiu-root]
last_verified: 2026-10-10
---

# Securitate Frontend, CSP & Mutații DOM Zero-Trust

## 1. Content Security Policy (Strict CSP Level 3)
Configurat la nivel de antete HTTP în `vercel.json`:
- `script-src 'self'`: Zero execuție de scripturi inline, zero dependențe externe nesigure, fără clauza `'strict-dynamic'` care ar anula compatibilitatea cu resursele `'self'`.
- `style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com`: Zero dependență de stiluri inline dinamice în codul sursă; toate stările vizuale sunt controlate prin clase CSS sau proprietăți personalizate CSS (CSS custom properties).
- `frame-ancestors 'none'`: Protecție completă împotriva atacurilor de tip Clickjacking.
- `X-Content-Type-Options: nosniff`: Prevenirea interpretării eronate de tipuri MIME.

## 2. Zero-Trust DOM Mutation
- Este interzisă utilizarea directă și nefiltrată a lui `innerHTML`.
- Randarea șirurilor i18n cu markup bogat sau a liniilor de terminal se efectuează exclusiv prin funcția sanitară `safeSetHTML()`, care folosește un `<template>` intermediar și aplică o listă albă strictă de tag-uri (`STRONG`, `EM`, `SPAN`, `B`, `I`, `BR`, `A`, `P`, `DIV`, `CODE`) și atribute (`class`, `href`, `target`, `rel`, `title`). Orice nod nespecificat este eliminat chirurgical.
- Nodurile textuale pure folosesc obligatoriu `textContent` sau `document.createTextNode()`.

## 3. Separare Absolută CSS vs JS
- Zero utilizare de atribute inline `style="..."` în fișierele HTML.
- Efectele interactive (înclinare 3D carduri, bară progres scroll) utilizează proprietăți CSS native (`--tilt-x`, `--tilt-y`, `--scroll-progress`) manipulate prin `style.setProperty()`, fără injectare de template literals în string-uri de stil.
