# Portofoliu Tiberiu Militaru

Site web bilingv (Română / Engleză) de prezentare pentru servicii de dezvoltare web, automatizări, administrare baze de date și consultanță IT.

## Tehnologii

- Vite 8 + JavaScript modular (`src/swarm/SwarmEngine.js`)
- ESLint 10 + Node test runner (`tests/*.test.js`)
- Deploy și funcții API pe Vercel (`vercel.json`, `/api/healthz`)

## Dezvoltare și verificare

```bash
npm install
npm run dev         # server local Vite
npm run gatekeeper  # eslint --max-warnings=0, npm test, vite build și npm audit prod
```

## Producție

- URL: https://www.tiberiumilitaru.ro
