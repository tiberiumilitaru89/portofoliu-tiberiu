# REGULI LOCALE DE SECURITATE ȘI DEZVOLTARE — PORTOFOLIU TIBERIU

Acest fișier este încărcat automat de Antigravity ori de câte ori lucrează în acest workspace.

## 1. FRONTEND DEFENSE-IN-DEPTH & ZERO-TRUST DOM MUTATION
- **Interzicerea Prezumției de Date Sigure (No Trusted-Data Assumption):** 
  Este strict interzisă utilizarea `innerHTML` pentru injectarea de conținut pe baza prezumției că datele sunt „locale”, „hardcodate” sau „statice”.
  - Orice mutație de nod textual folosește obligatoriu `textContent` sau `document.createTextNode()`.
  - Randarea de markup bogat se face fie prin elemente DOM create programatic, fie prin discriminare strictă (se verifică prezența tag-urilor `<`, iar în lipsa lor se forțează `textContent`).
- **Separare Absolută CSS vs JS (Zero Inline Styling):**
  - Este strict interzisă injectarea atributelor de stil inline (`style="..."`) în template literals sau prin `element.setAttribute('style', ...)` în JavaScript.
  - Toate stările vizuale dinamice se controlează exclusiv prin clase CSS semantice predefinite în `src/styles.css`.
- **Politici CSP Fără Compromisuri de Bundler:**
  - În configurările `Content-Security-Policy` din `vercel.json`, directiva `script-src` nu va conține NICIODATĂ clauza `'unsafe-inline'`.
  - Tot codul executabil trebuie să fie livrat prin fișiere bundle externe (`'self'`) sau validat prin hash-uri criptografice SHA-256.

## 2. BARIERĂ PRE-COMMIT: SIMULAREA SCANNERULUI NEMILOS
Înainte de a prezenta orice modificare de cod ca fiind finalizată, se efectuează un audit mental prin ochii unui auditor ostil (SonarQube, OWASP ZAP, Mozilla Observatory):
- Există vreun `innerHTML` sau `unsafe-inline` pe care un scanner automat îl va semnala drept vulnerabilitate?
- Dacă răspunsul este da, codul este respins instantaneu și corectat înainte de livrare.
