---
id: seo-and-indexing
domain: business-rules
last_verified: 2026-10-01
dependencies: ["portfolio-root-index", "profile-and-services"]
---

# Strategie SEO, Indexare Tehnică & Cuvinte Cheie

## 1. Identitate Canonică & Crawlability (SSOT)
* **Canonical URL:** `https://www.tiberiumilitaru.ro/`
* **Robots Policy (`public/robots.txt`):**
  - Permite accesul tuturor motoarelor de căutare (`User-agent: *`, `Allow: /`).
  - Referențiază sitemap-ul canonic: `https://www.tiberiumilitaru.ro/sitemap.xml`.
* **Sitemap (`public/sitemap.xml`):**
  - Declară URL-ul rădăcină canonic cu frecvență `monthly` și prioritate `1.0`.

## 2. Clustere de Cuvinte Cheie Vizate

### A. Brand Personal (Clasare #1 garantată)
* `Militaru Tiberiu Nicolae`
* `Tiberiu Nicolae Militaru`
* `Tiberiu Militaru`
* `Militaru Tiberiu IT`

### B. Geografic / Căutări Locale (Ploiești & Prahova)
* `consultanta IT Ploiesti`
* `dezvoltare aplicatii web Ploiesti`
* `creare sistem CRM Ploiesti`
* `programator Ploiesti`
* `optimizare baze de date Ploiesti`

### C. B2B / Soluții Software & Consultanță
* `dezvoltare MVP startup` / `dezvoltare platforme SaaS`
* `sisteme CRM personalizate`
* `arhitectura baze de date SQL` / `optimizare interogari SQL`
* `automatizari procese afaceri`
* `mentenanta software si consultanta IT`

## 3. Date Structurate (Schema.org / JSON-LD)
Pentru consolidarea Knowledge Graph și Rich Snippets, antetul paginii conține un graf JSON-LD hibrid:
1. **Entitatea `Person` (`#person`):**
   - Nume oficial, denumiri alternative, rol profesional (`IT Consultant & Full-Stack Solutions`).
   - Legături sociale verificate (`sameAs`: LinkedIn, GitHub).
   - Localizare geografică: Ploiești, Prahova, România.
   - Lista explicită de competențe (`knowsAbout`).
2. **Entitatea `ProfessionalService` (`#service`):**
   - Serviciu profesional IT cu arie de deservire locală și națională (`areaServed`).
   - Catalog de oferte (`OfferCatalog`) aliniat celor 4 piloni oficiali de servicii.

## 4. Pași Operaționali Post-Lansare
1. **Google Search Console:**
   - Adăugare proprietate domeniu `www.tiberiumilitaru.ro`.
   - Trimitere `https://www.tiberiumilitaru.ro/sitemap.xml`.
2. **Google Business Profile (Opțional / Recomandat):**
   - Profil de companie/profesionist independent pe Ploiești pentru afișare pe Google Maps la căutări locale.
