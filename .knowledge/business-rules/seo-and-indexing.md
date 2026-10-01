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

## 4. Stare Operațională & Verificare (Finalizată)
1. **Domeniu & Nameservere:**
   - Domeniu achiziționat pe Hostico: `tiberiumilitaru.ro`.
   - Nameservere delegate către Vercel: `ns1.vercel-dns.com` și `ns2.vercel-dns.com`.
   - Certificat SSL Let's Encrypt emis și activ pe `https://www.tiberiumilitaru.ro`.
   - Redirect 308 permanent de la apex (`tiberiumilitaru.ro`) la `www.tiberiumilitaru.ro`.
2. **Google Search Console:**
   - Proprietate verificată la nivel de Prefix URL: `https://www.tiberiumilitaru.ro`.
   - Verificare realizată prin tag HTML `<meta name="google-site-verification" content="XqIbLUjbY74iclfNMUNN1UMPC8ojfiur3dvNZCt7W6Q" />`.
   - Sitemap `/sitemap.xml` trimis și validat cu status verde: **Succes** (1 pagină descoperită la 1 oct. 2026).
3. **Google Business Profile (Pas Următor Opțional):**
   - Profil de profesionist independent în Ploiești pentru prezență pe Google Maps.

