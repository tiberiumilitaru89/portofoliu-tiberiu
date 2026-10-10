---
id: portfolio-static-state-and-storage
domain: database
dependencies: [portofoliu-tiberiu-root]
last_verified: 2026-10-10
---

# Gestiune Stare Client & Izolare Date

## 1. Persistență Locală Sigură (`SafeStorage`)
- Toate citirile și scrierile de preferințe de utilizator (temă vizuală `portfolio_theme`, limbă `portfolio_lang`) sunt încapsulate prin modulul `SafeStorage`.
- În eventualitatea blocării accesului la `window.localStorage` (navigare privată, restricții de securitate browser), `SafeStorage` face fallback transparent la o memorie internă volatilă în-memorie (`memCache`), eliminând complet riscul de excepții neprinse `SecurityError` sau prăbușiri de execuție.

## 2. Imutabilitate & State FSM
- Tema aplicației este modelată strict ca două stări disjuncte: `'dark' | 'light'`.
- Limba aplicației este modelată ca: `'ro' | 'en'`.
- Nicio stare nedefinită sau ambiguă nu poate fi persistată.
