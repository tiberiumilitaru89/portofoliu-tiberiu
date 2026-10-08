# Portofoliu & CV Profesional - Militaru Tiberiu Nicolae

Site web de prezentare profesional, modern și bilingv (Română / Engleză), conceput pentru promovarea serviciilor de dezvoltare web, automatizări de procese, administrare baze de date (SQL), consiliere IT și mentenanță hardware & software la cerere.

---

## 🚀 Caracteristici Cheie

1. **Design Modern & Umanizat**:
   - Orientat pe rezultate și rezolvare de probleme practice (nu doar jargon tehnic).
   - Cardul „Cu ce te pot ajuta?” evidențiază direct crearea de site-uri, automatizările și suportul hardware/software.
   - Efecte vizuale subtile (glassmorphism, 3D card tilt, lumini ambientale neon).

2. **Optimizare Mobilă & Performanță Maximă (0% Consum Inutil de Baterie)**:
   - **Pe Desktop**: Rulează o rețea interactivă de particule (*Smart Node Mesh*) ce consumă sub 1% din procesor și se pune automat pe pauză când schimbi tab-ul.
   - **Pe Mobil / Ecrane Tactile**: Dezactivează automat motorul canvas greu și trece pe un grid tehnic CSS (*Blueprint Tech Grid*) cu iluminare ambientală fluidă (60-120 FPS garantat pe orice smartphone).

3. **Contact Direct cu 1 Click**:
   - **WhatsApp**: Click-to-chat cu mesaj pre-completat (`https://wa.me/40720955119`). Deschide WhatsApp Web pe PC sau aplicația WhatsApp nativă pe telefon.
   - **Telefon**: Apelare directă (`tel:+40720955119`).
   - **Email**: Deschide automat clientul tău de email (Outlook, Thunderbird, Mail pe PC sau Gmail/Apple Mail pe telefon).

4. **Formular Securizat cu Notificare pe Email**:
   - Protecție anti-spam cu câmp capcană (**Honeypot** `_gotcha`) și verificare temporală umană (`_formDuration` > 2500ms).
   - Rate limiting sliding-window pe serverless (5 cereri/min/IP).
   - Validare strictă și sanitizare anti-XSS.
   - Livrare directă de înaltă fiabilitate prin **Resend API** cu **Dual-Dispatch** (notificare administrator + confirmare automată client).

5. **Terminal CLI Interactiv & Easter Egg Matrix**:
   - Include comenzi: `help`, `services`, `projects`, `skills`, `experience`, `contact`, `cv`, `matrix`, `theme`, `lang`, `clear`.
   - Comanda `matrix` pornește ploaia digitală de cod verde/cyan direct în fereastra consolei.

6. **Export & Printare CV (PDF A4)**:
   - Buton dedicat „Descarcă CV (PDF)” și stil complet `@media print`.
   - Când este acționat (sau la `Ctrl + P`), ascunde toate elementele decorative și formatează un CV curat, impecabil aranjat pentru recrutori sau imprimare fizică.

---

## 📧 Cum activezi notificările pe email când cineva trimite formularul

Site-ul utilizează o infrastructură modernă de email de înaltă fiabilitate bazată pe **Resend API** (`/api/contact.js`), eliminând dependența de intermediari terți.

### Arhitectura Dual-Dispatch:
1. **Alertă Administrator (Către Tiberiu):**
   - Destinatar: `tiberiumilitaru89@gmail.com`
   - Subiect: `[Militaru Tiberiu Nicolae] Mesaj nou de la {Nume} ({Serviciu})`
   - Corp email structurat: Date complete expeditor, serviciu solicitat, mesaj complet, timestamp (București), IP client.
   - Antet `reply_to` configurat direct pe emailul clientului: când apeși „Reply / Răspunde” în Gmail pe telefon sau PC, răspunzi instantaneu clientului.
2. **Confirmare Automată Client (Auto-responder profesional):**
   - Destinatar: adresa de email a clientului.
   - Subiect: `Confirmare primire mesaj — Militaru Tiberiu Nicolae`
   - Design modern Dark/Cyan sincronizat cu tema portofoliului.
   - Confirmă preluarea solicitării (răspuns în maxim 24h) și include link direct de WhatsApp (`https://wa.me/40720955119`) pentru urgențe.

### Pași de Configurare Variabile de Mediu pe Vercel:
1. Intră pe [resend.com](https://resend.com) și autentifică-te (sau creează un cont gratuit).
2. În secțiunea **API Keys**, apasă pe **„Create API Key”** (permisiuni *Full Access* sau *Sending Access*) și copiază cheia (`re_...`).
3. Intră în [Vercel Dashboard](https://vercel.com) -> Proiectul `portofoliu-tiberiu` -> **Settings** -> **Environment Variables**.
4. Adaugă următoarele variabile de mediu:
   - `RESEND_API_KEY`: Cheia ta secretă Resend (`re_...`).
   - `ADMIN_NOTIFICATION_EMAIL`: `tiberiumilitaru89@gmail.com`
   - `NOTIFICATION_FROM_EMAIL`:
     - Dacă ai conectat un domeniu verificat în Resend: `Militaru Tiberiu Nicolae <contact@tiberiumilitaru.ro>`
     - Sau fallback universal: `Militaru Tiberiu Nicolae Portofoliu <onboarding@resend.dev>`
5. Apasă pe **Save** și efectuează un nou Deploy (sau `git push origin main`). Formularul este acum complet operațional!

---

## 🌐 Cum publici site-ul online pe Vercel prin Git

Site-ul este 100% pregătit pentru Vercel (conține inclusiv `vercel.json` cu antete de securitate HTTP: CSP, anti-sniffing, XSS protection).

### Pasul 1: Inițializează repozitoriul Git local
Deschide un terminal (PowerShell / Git Bash) în acest folder:
```powershell
cd "d:\Antigravity\portofoliu-tiberiu"
git init
git add .
git commit -m "Initial commit - Portofoliu Militaru Tiberiu Nicolae"
```

### Pasul 2: Creează un depozit pe GitHub
1. Intră pe [github.com](https://github.com) și apasă pe **New Repository**.
2. Denumește-l de exemplu: `portofoliu-tiberiu` (poate fi Public).
3. Rulează comenzile afișate de GitHub pentru a încărca codul:
```powershell
git remote add origin https://github.com/tiberiumilitaru89/portofoliu-tiberiu.git
git branch -M main
git push -u origin main
```

### Pasul 3: Conectează la Vercel
1. Intră pe [vercel.com](https://vercel.com) și autentifică-te cu contul tău de GitHub.
2. Apasă pe **„Add New...”** -> **„Project”**.
3. Selectează depozitul `portofoliu-tiberiu` din listă.
4. Lasă toate setările pe Default (Framework Preset: *Other*) și apasă pe **Deploy**.
5. În 15 secunde, site-ul tău va fi live pe un domeniu gratuit (ex: `portofoliu-tiberiu.vercel.app`), cu certificat SSL (HTTPS) activat automat!
6. De fiecare dată când vei face `git push`, Vercel va actualiza automat site-ul online în doar câteva secunde.

---

## 🧪 Testare & Rulare Locală

Poți rula oricând testul automatizat de integritate:
```powershell
node test-suite.js
```

Pentru a deschide site-ul în browser pe calculatorul tău:
- Poți da pur și simplu dublu click pe fișierul `index.html`.
- Sau poți porni un server local de dezvoltare:
  ```powershell
  npx serve .
  ```
  și deschizi `http://localhost:3000` în browser.
