---
id: portfolio-business-rules
domain: business-rules
dependencies: [portofoliu-tiberiu-root]
last_verified: 2026-10-10
---

# Reguli de Business, Conversie & Localizare (i18n)

## 1. Localizare Bilingvă (RO / EN)
- Limba implicită este Română (`ro`).
- Comutarea limbii actualizează atributul `lang` pe tagul `<html>`, titlul documentului și sincronizează toate nodurile cu atribut `data-i18n`.
- Preferința utilizatorului este memorată în `localStorage` sub cheia `portfolio_lang`, cu fallback determinist la memoria volatila în cazul blocajului de stocare (private browsing/sandbox).

## 2. Terminal Emulator Interactiv
- Comenzile acceptate: `help`, `services`, `projects`, `skills`, `experience`, `contact`, `cv`, `matrix`, `theme`, `lang`, `clear`.
- Output-ul este igienizat conform standardului Zero-Trust DOM Mutation.
- Comanda `matrix` comută modul canvas animat, optimizat pentru rate de cadre fluide (60 FPS) cu oprire controlată via `cancelAnimationFrame()`.

## 3. Formular de Contact & Protecție Anti-Spam
- Protecție pe client prin câmp Honeypot (`.honeypot-field` ascuns complet via CSS).
- Validare semantică a câmpurilor obligatorii (Nume, Email valid, Mesaj) înainte de dispatch către `/api/contact`.
