---
id: forms-and-headers
domain: security
last_verified: 2026-10-10
dependencies: ["portfolio-root-index"]
---

# Securitate, Rute & Formulare

## 1. Arhitectură Defensivă Formular Contact & API (`api/contact.js`)
* **Infrastructură Directă de Înaltă Fiabilitate (Resend API):**
  * Migrare completă de la agregatori terți (Formspree) la apeluri native HTTPS către `https://api.resend.com/emails`.
  * **Dual-Dispatch Inteligent:**
    1. *Alertă Administrator (Către Tiberiu):* Trimisă la `tiberiumilitaru89@gmail.com` cu date complete, timestamp București și `reply_to` dinamic setat pe emailul clientului pentru răspuns instantaneu la 1 click din Gmail / mobil.
    2. *Auto-responder Profesional Client (Non-blocant):* Trimis clientului cu design modern Dark/Cyan sincronizat cu tema portofoliului, confirmare în 24h și buton direct către WhatsApp (`https://wa.me/40720955119`) pentru urgențe.
* **Reziliență & Circuit Breaker determinist:** Fiecare apel extern utilizează `AbortSignal.timeout(10000)`. Dacă auto-responderul opțional eșuează sau întâmpină timeout, tranzacția principală nu este blocată și utilizatorul web primește confirmarea cu status `200 OK`.
* **Capcană Time-Based Anti-Bot & Durată Obligatorie:** Monitorizare strictă a duratei de interacțiune (`_formDuration`). Submisiile lipsite de timestamp sau realizate în sub 2.500 ms (specifice bot-urilor) sunt neutralizate silențios cu status `200 OK` fără apelare de furnizor extern.
* **Câmp Honeypot (`_gotcha`):** Câmp ascuns via CSS/ARIA; dacă este completat, este considerat atac automatizat și este dropped silențios.
* **Sanitizare, Encodare & Validare Strictă:**
  * Curățare tag-uri HTML prin regex (`<[^>]*>?`).
  * Encodare completă a entităților HTML (`escapeHtml`: `&`, `<`, `>`, `"`, `'`) la interpolarea în șabloanele de email pentru a elimina riscul de Email HTML Injection / XSS.
  * Validare regex RFC email și limite stricte de lungime (nume: 2-100, email: max 120, mesaj: 10-5000 caractere).
* **Rate Limiting Serverless (Sliding Window):** Prag de maximum 5 cereri per minut per IP client (`x-real-ip` / `x-vercel-ip` / `x-forwarded-for`) cu curățare automată la peste 500 de intrări în memorie.
* **Frontend Error Segregation & Zero Data Loss:** Răspunsurile HTTP sunt diferențiate granular (`429` Too Many Requests, `400` Bad Request, `500/502` Server Error, conexiune offline). În caz de eșec, inputurile utilizatorului **nu sunt șterse**, permițând retrimiterea sau contactarea directă pe WhatsApp.
* **Trasabilitate Forensică & Protecție PII:**
  * Logare structurată JSON (fără `console.log` simplu) ce include `correlation_id` unic (`msg_...`), timestamp ISO și detalii descriptive.
  * Datele PII sunt mascate în logurile de sistem (`maskEmail`, `maskIp`) pentru conformitate și audit de securitate.
* **Variabile de Mediu Vercel:**
  * `RESEND_API_KEY`: Cheie privată de expediere Resend.
  * `ADMIN_NOTIFICATION_EMAIL`: Destinatar notificări admin (implicit `tiberiumilitaru89@gmail.com`).
  * `NOTIFICATION_FROM_EMAIL`: Identitate expeditor (`Militaru Tiberiu Nicolae <contact@tiberiumilitaru.ro>` sau fallback domeniu verificat).

## 2. Antete HTTP de Securitate Enterprise (`vercel.json`)
* **Strict-Transport-Security (HSTS):** `max-age=63072000; includeSubDomains; preload` forțează criptarea strictă HTTPS timp de 2 ani.
* **Content-Security-Policy (CSP):** Directivă restrictivă `default-src 'self'` cu eliminare completă a `'unsafe-inline'` din `script-src` (`script-src 'self'`). Scripturile executabile sunt permise exclusiv din bundle-ul propriu, blocând la nivel de nucleu al browserului orice încercare de injectare XSS. Resursele externe autorizate sunt strict segregate: fonturi și stiluri FontAwesome (Cloudflare) și Google Fonts (`style-src` / `font-src`), clickjacking-ul blocat prin `frame-ancestors 'none'`.
* **Cross-Origin-Opener-Policy (COOP):** `same-origin` pentru izolarea contextului de execuție în memorie.
* **Standard Headers:** `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

## 3. Navigare Externă Securizată & Defense-in-Depth DOM
* **Floating WhatsApp Button (`#floatingWhatsappBtn`):**
  * Poziționare fixă la colțul ecranului (`bottom: 24px; right: 24px`), suprapusă ergonomic cu butonul `.back-to-top` (`bottom: 84px`).
  * Indicator vizual dinamic de stare (*live pulse dot*) și rutare automată a mesajelor contextuale bilingve (RO/EN) în funcție de limba selectată pe site.
  * Toate legăturile externe folosesc obligatoriu `rel="noopener noreferrer"` și `target="_blank"`.
* **Terminal CLI Isolation & Omnidirectional Synchronization:** 
  * Comenzile tastate de utilizator și mesajele de eroare sunt randate exclusiv prin noduri de text pure (`textContent`), împiedicând orice injecție HTML/XSS în arborele DOM.
  * Sincronizare automată pe toate punctele de intrare: buton Hero (`#heroTerminalBtn`), meniu nav desktop (`.nav-link`), meniu mobil drawer (`.mobile-nav-link`), scurtătură globală de tastatură (`Ctrl+K` / `Cmd+K`) și auto-deschidere la accesare cu hash URL (`#terminal`).
  * Butonul de închidere al ferestrei ascunde secțiunea (`display: none`) și oprește animația Matrix.
* **i18n Safe DOM Mutation:**
  * Motorul de traducere discriminează automat între text pur și fragmente HTML. Peste 95% din etichete sunt randate nativ prin `textContent` (viteză maximă și imunitate matematică la injectare DOM), `innerHTML` fiind activat strict dacă stringul conține markup valid (`<`).
* **Modal Semantic CSS Decoupling:**
  * Eliminarea completă a stilurilor inline (`style="..."`) din JavaScript; structurarea se face prin clase CSS semantice (`.project-modal-group`, `.project-modal-heading`, `.project-modal-results`), asigurând separarea deplină și conformitatea cu politicile stricte CSP.

## 4. Politici de Redirecționare & Izolare Domeniu Canonic
* Redirecționare permanentă (308) din domeniul implicit Vercel (`portofoliu-tiberiu.vercel.app`) către domeniul canonic de producție (`https://www.tiberiumilitaru.ro/:path*`).
* Redirecționarea se execută strict la nivel de Edge în `vercel.json` (fără scripturi client-side redundante în HTML).
* Izolare strictă prin condiția de `host` în `vercel.json` pentru a împiedica buclele infinite de redirect (`ERR_TOO_MANY_REDIRECTS`).
