/**
 * @file SwarmEngine.js
 * @description Master Unified 3D Neural Architecture & Deep-Space Engine pentru www.tiberiumilitaru.ro.
 *              Includes: 7 Foreground Nebulae, Deep-Space Starfield, 5 Distant Spiral Galaxies,
 *              360° Spherical Orbit + Wheel/Pinch Zoom, Keyboard Deck Controls (ESC/SPACE/Arrows/R),
 *              Mobile Touch-Orbit & Tap, and Automatic DOM URL Harvester.
 * @compliance ESLint v10 (--max-warnings=0) | Vite 8 Build | Vercel CSP | Zero-innerHTML | Zero Inline CSS
 */

import './swarm-engine.css';

/* ==========================================================================
   1. SINGLE SOURCE OF TRUTH (SSOT): BILINGUAL DATA & DISTANT GALAXIES
   ========================================================================== */

const UI_TEXT = {
  ro: {
    btnTitle: 'Lansează Arhitectura Neurală 3D (Swarm Engine)',
    modalTag: 'AVERTISMENT: SARCINĂ GPU EXTREMĂ',
    modalCode: 'SYS_TEMP_CRITICAL // 0x7F',
    modalTitle: 'Ești pe cale să colapsezi DOM-ul într-o singularitate 3D.',
    modalDescBase:
      'Acest modul dezactivează site-ul clasic și pornește o simulare fizică WebGL cu zeci de mii de particule, galaxii îndepărtate, rețele neurale și telemetrie în timp real.',
    modalDescMobile:
      ' Dacă ești pe un telefon mai vechi si/sau cu bateria slaba , o sa-ti transforme dispozitiul intr un prajitor de paine :)))))',
    btnCancel: '[ Înapoi la site-ul cuminte ]',
    btnConfirm: '[ Dă-i foc / Detonează ]',
    exitBtn: '◄ ÎNAPOI',
    swarm00Title: '00 SWARM',
    swarm00Sub: '181 noduri · 7 rubrici din site · nimic citit încă',
    ship08Title: '08 SHIP',
    ship08Sub: '181 noduri citite · 7 rubrici sincronizate 1:1 · 0 ghicite',
    controlsHint:
      '[DRAG: 360° ORBIT] · [SCROLL/PINCH: ZOOM] · [CLICK STEA/CARD: DETALII & LINK] · [SPACE: PAUZĂ] · [ESC: IEȘIRE]'
  },
  en: {
    btnTitle: 'Launch 3D Neural Architecture (Swarm Engine)',
    modalTag: 'WARNING: EXTREME GPU LOAD',
    modalCode: 'SYS_TEMP_CRITICAL // 0x7F',
    modalTitle: 'You are about to collapse the DOM into a 3D singularity.',
    modalDescBase:
      'This module deconstructs the standard website into a real-time WebGL simulation with tens of thousands of particles, distant galaxies, neural splines, and live telemetry.',
    modalDescMobile:
      ' If you are on an older phone and/or with low battery, it will turn your device into a toaster :)))))',
    btnCancel: '[ Stay on safe website ]',
    btnConfirm: '[ Burn the GPU / Detonate ]',
    exitBtn: '◄ BACK',
    swarm00Title: '00 SWARM',
    swarm00Sub: '181 words · 7 site sections · nothing read yet',
    ship08Title: '08 SHIP',
    ship08Sub: '181 words read · 7 sections synced 1:1 · 0 guessed',
    controlsHint:
      '[DRAG: 360° ORBIT] · [SCROLL/PINCH: ZOOM] · [CLICK STAR/CARD: DETAILS & LINK] · [SPACE: PAUSE] · [ESC: EXIT]'
  }
};

// Cele 5 Galaxii Spirale Îndepărtate ("Departe de tine" în spațiul cosmic profund)
const DISTANT_GALAXIES = [
  {
    id: 'M31-ANDROMEDA',
    designation: 'M31-DEEP // 2.54M ly',
    pos: { x: -125, y: 72, z: -185 },
    radius: 38,
    arms: 2,
    tiltX: 0.68,
    tiltZ: 0.42,
    coreRgb: [1.0, 0.91, 0.68],
    armRgb: [0.52, 0.44, 0.98]
  },
  {
    id: 'NGC-CYGNUS',
    designation: 'NGC-7000 // 4.10M ly',
    pos: { x: 145, y: -62, z: -210 },
    radius: 44,
    arms: 3,
    tiltX: -0.82,
    tiltZ: -0.35,
    coreRgb: [0.95, 0.98, 1.0],
    armRgb: [0.18, 0.78, 0.96]
  },
  {
    id: 'HELIOS-RING',
    designation: 'M51-WHIRLPOOL // 23.1M ly',
    pos: { x: 18, y: 128, z: -170 },
    radius: 32,
    arms: 2,
    tiltX: 0.45,
    tiltZ: -0.75,
    coreRgb: [1.0, 0.78, 0.35],
    armRgb: [0.96, 0.32, 0.58]
  },
  {
    id: 'CENTAURI-VOID',
    designation: 'NGC-5128 // 11.7M ly',
    pos: { x: -135, y: -88, z: 165 },
    radius: 40,
    arms: 2,
    tiltX: -0.55,
    tiltZ: 0.62,
    coreRgb: [0.85, 1.0, 0.92],
    armRgb: [0.18, 0.85, 0.68]
  },
  {
    id: 'ZENITH-PRIME',
    designation: 'IC-1101 // 1.04B ly',
    pos: { x: 138, y: 84, z: 155 },
    radius: 36,
    arms: 3,
    tiltX: 0.92,
    tiltZ: 0.25,
    coreRgb: [1.0, 0.82, 0.75],
    armRgb: [0.76, 0.38, 0.98]
  }
];

// Cele 7 Nebuloase mapate 1-la-1 cu rubricile și cardurile din index.html
const SWARM_CLUSTERS = [
  {
    id: 'home',
    rgb: [0.176, 0.831, 0.749],
    colorCss: '#2dd4bf',
    targetSelector: '#home',
    pos: { x: -18, y: 11, z: 6 },
    wordCount: 25,
    ro: {
      tab: 'acasă',
      title: '01 ACASĂ · PROFIL & VIZIUNE',
      subtitle: 'Militaru Tiberiu Nicolae · IT Consultant · Full-Stack Solutions',
      nodes: [
        {
          label: 'Militaru Tiberiu Nicolae',
          kind: 'owner',
          dx: -5.2,
          dy: 3.6,
          dz: 2.0,
          matchKey: 'github',
          desc: 'IT Consultant • Full-Stack Solutions. Transform ideile complexe în soluții digitale sigure, rapide și scalabile.',
          tags: ['IT Consultant', 'Full-Stack', 'Ploiești / Remote']
        },
        {
          label: 'Soluții Web & Automatizări',
          kind: 'role',
          dx: 5.6,
          dy: 2.8,
          dz: -2.0,
          desc: 'Dezvoltare aplicații web moderne, platforme SaaS și automatizări de fluxuri operaționale.',
          tags: ['Web Apps', 'SaaS', 'Automatizări']
        },
        {
          label: 'Baze de Date & Backend',
          kind: 'spec',
          dx: -6.2,
          dy: -3.2,
          dz: 3.5,
          desc: 'Arhitectură relațională SQL/NoSQL, securizare API și optimizare interogări critice.',
          tags: ['PostgreSQL', 'MS SQL', 'Node.js']
        },
        {
          label: 'Suport IT & Mentenanță',
          kind: 'approval',
          dx: 6.2,
          dy: -3.8,
          dz: 1.2,
          desc: 'Consultanță tehnică, audit de infrastructură, depanare hardware/software și SLA garantat.',
          tags: ['SLA 99.9%', 'RCA Tier 1/2', 'Audit IT']
        },
        {
          label: '5+ Ani · 99.9% Uptime · 100% Dedicat',
          kind: 'claim',
          dx: 0.8,
          dy: -6.2,
          dz: -2.8,
          desc: 'Peste 5 ani de experiență în IT, 99.9% uptime pe baze de date și 100% soluții personalizate.',
          tags: ['5+ Ani IT', '99.9% Uptime', '100% Soluții Dedicate']
        },
        {
          label: 'Solicită o Discuție · CV PDF',
          kind: 'release',
          dx: -0.6,
          dy: 6.2,
          dz: -2.2,
          matchKey: 'cv_pdf',
          desc: 'Inițiază o discuție directă sau descarcă CV-ul complet în format PDF.',
          tags: ['CV PDF', 'WhatsApp', 'Contact Direct']
        }
      ]
    },
    en: {
      tab: 'home',
      title: '01 HOME · PROFILE & VISION',
      subtitle: 'Militaru Tiberiu Nicolae · IT Consultant · Full-Stack Solutions',
      nodes: [
        {
          label: 'Militaru Tiberiu Nicolae',
          kind: 'owner',
          dx: -5.2,
          dy: 3.6,
          dz: 2.0,
          matchKey: 'github',
          desc: 'IT Consultant • Full-Stack Solutions. Turning complex requirements into secure, fast, and scalable digital systems.',
          tags: ['IT Consultant', 'Full-Stack', 'Ploiesti / Remote']
        },
        {
          label: 'Web Solutions & Automation',
          kind: 'role',
          dx: 5.6,
          dy: 2.8,
          dz: -2.0,
          desc: 'Modern web applications, SaaS platforms, and operational workflow automation.',
          tags: ['Web Apps', 'SaaS', 'Automation']
        },
        {
          label: 'Databases & Backend',
          kind: 'spec',
          dx: -6.2,
          dy: -3.2,
          dz: 3.5,
          desc: 'Relational SQL/NoSQL architecture, API hardening, and critical query optimization.',
          tags: ['PostgreSQL', 'MS SQL', 'Node.js']
        },
        {
          label: 'IT Support & Maintenance',
          kind: 'approval',
          dx: 6.2,
          dy: -3.8,
          dz: 1.2,
          desc: 'Technical consulting, infrastructure auditing, hardware/software troubleshooting, and SLA.',
          tags: ['99.9% SLA', 'Tier 1/2 RCA', 'IT Audit']
        },
        {
          label: '5+ Yrs · 99.9% Uptime · 100% Custom',
          kind: 'claim',
          dx: 0.8,
          dy: -6.2,
          dz: -2.8,
          desc: 'Over 5 years of hands-on IT experience, 99.9% database uptime, and 100% tailored solutions.',
          tags: ['5+ Yrs IT', '99.9% Uptime', '100% Custom']
        },
        {
          label: 'Book a Call · Download CV PDF',
          kind: 'release',
          dx: -0.6,
          dy: 6.2,
          dz: -2.2,
          matchKey: 'cv_pdf',
          desc: 'Start a direct conversation or download the full resume in PDF format.',
          tags: ['CV PDF', 'WhatsApp', 'Direct Contact']
        }
      ]
    }
  },
  {
    id: 'services',
    rgb: [0.22, 0.741, 0.973],
    colorCss: '#38bdf8',
    targetSelector: '#services',
    pos: { x: -4, y: 17, z: -8 },
    wordCount: 24,
    ro: {
      tab: 'servicii',
      title: '02 SERVICII & SOLUȚII IT',
      subtitle: 'cele 4 carduri de servicii din site · de la arhitectură la mentenanță',
      nodes: [
        {
          label: 'Aplicații Web, MVP & Platforme SaaS',
          kind: 'release',
          dx: -5.8,
          dy: 4.1,
          dz: 2.2,
          desc: 'Dezvolt aplicații web moderne, rapide și scalabile (React, Next.js, TypeScript), cu arhitectură curată, autentificare securizată și integrare plăți Stripe.',
          tags: ['React & Next.js', 'MVP Rapid', 'Plăți Stripe', 'UI/UX Responsive']
        },
        {
          label: 'Baze de Date, Arhitectură & Backend Sigur',
          kind: 'spec',
          dx: 5.8,
          dy: 3.4,
          dz: -2.0,
          desc: 'Proiectez, optimizez și administrez baze de date relaționale și NoSQL (PostgreSQL, MySQL, MS SQL, Supabase). Elimin blocajele de performanță și asigur integritatea datelor.',
          tags: ['PostgreSQL / MSSQL', 'Optimizare SQL', 'API REST', 'Backup & Securitate']
        },
        {
          label: 'Sisteme CRM & Automatizări de Procese',
          kind: 'claim',
          dx: -5.4,
          dy: -4.4,
          dz: 3.0,
          desc: 'Înlocuiesc fișierele Excel haotice cu aplicații interne personalizate, panouri de control (dashboards), generare automată de documente PDF și raportare în timp real.',
          tags: ['CRM Custom', 'Generare PDF', 'Dashboards', 'Fluxuri Automate']
        },
        {
          label: 'Consultanță IT, Diagnoză & Mentenanță',
          kind: 'approval',
          dx: 5.9,
          dy: -3.8,
          dz: 1.4,
          desc: 'Ofer suport tehnic dedicat (Tier 1/2), diagnosticare Root Cause Analysis (RCA), configurare rețele/sisteme și mentenanță proactivă pentru continuitatea afacerii.',
          tags: ['Suport Tier 1/2', 'Diagnoză RCA', 'Hardware & Rețea', 'Mentenanță SLA']
        }
      ]
    },
    en: {
      tab: 'services',
      title: '02 IT SERVICES & SOLUTIONS',
      subtitle: 'the 4 service cards from the site · architecture to maintenance',
      nodes: [
        {
          label: 'Web Apps, MVP & SaaS Platforms',
          kind: 'release',
          dx: -5.8,
          dy: 4.1,
          dz: 2.2,
          desc: 'Building fast, scalable modern web apps (React, Next.js, TypeScript) with clean architecture, secure auth, and Stripe billing integration.',
          tags: ['React & Next.js', 'Rapid MVP', 'Stripe Billing', 'Responsive UI/UX']
        },
        {
          label: 'Databases, Architecture & Secure Backend',
          kind: 'spec',
          dx: 5.8,
          dy: 3.4,
          dz: -2.0,
          desc: 'Designing, tuning, and administering relational and NoSQL databases (PostgreSQL, MySQL, MS SQL, Supabase) with high availability and integrity.',
          tags: ['PostgreSQL / MSSQL', 'SQL Tuning', 'REST APIs', 'Backup & Security']
        },
        {
          label: 'CRM Systems & Process Automation',
          kind: 'claim',
          dx: -5.4,
          dy: -4.4,
          dz: 3.0,
          desc: 'Replacing chaotic spreadsheets with custom internal tools, live dashboards, automated PDF generation, and real-time reporting.',
          tags: ['Custom CRM', 'PDF Generation', 'Dashboards', 'Automated Flows']
        },
        {
          label: 'IT Consulting, Diagnostics & Maintenance',
          kind: 'approval',
          dx: 5.9,
          dy: -3.8,
          dz: 1.4,
          desc: 'Dedicated Tier 1/2 technical support, Root Cause Analysis (RCA) diagnostics, network/system setup, and proactive SLA maintenance.',
          tags: ['Tier 1/2 Support', 'RCA Diagnostics', 'Hardware & Net', 'SLA Maintenance']
        }
      ]
    }
  },
  {
    id: 'about',
    rgb: [0.29, 0.871, 0.502],
    colorCss: '#4ade80',
    targetSelector: '#about',
    pos: { x: 22, y: 9, z: -4 },
    wordCount: 25,
    ro: {
      tab: 'despre mine',
      title: '03 DESPRE MINE · VIZIUNE & METRICI',
      subtitle: 'cardurile și statisticile din rubrica Despre Mine (#about)',
      nodes: [
        {
          label: 'Orientat pe Rezultate',
          kind: 'rule',
          dx: -5.4,
          dy: 4.2,
          dz: 2.5,
          desc: 'Fiecare linie de cod și fiecare interogare SQL sunt scrise cu un scop clar: viteză, securitate și valoare măsurabilă pentru afacerea ta.',
          tags: ['Performanță', 'Securitate', 'Valoare Măsurabilă']
        },
        {
          label: 'Comunicare Transparentă',
          kind: 'approval',
          dx: 5.8,
          dy: 3.4,
          dz: -1.8,
          desc: 'Fără jargon tehnic inutil. Explic soluțiile pe înțelesul tău, ofer estimări reale și te țin la curent în fiecare etapă a proiectului.',
          tags: ['Fără Jargon', 'Estimări Reale', 'Transparență']
        },
        {
          label: '5+ Ani Experiență IT',
          kind: 'claim',
          dx: -6.2,
          dy: -3.8,
          dz: 2.2,
          desc: 'Peste 5 ani de experiență continuă în suport tehnic, digitalizare, administrare baze de date și dezvoltare Full-Stack.',
          tags: ['5+ Ani', 'Full-Stack', 'Enterprise IT']
        },
        {
          label: '99.9% Uptime Baze de Date',
          kind: 'spec',
          dx: 5.5,
          dy: -4.6,
          dz: -2.4,
          desc: 'Disponibilitate critică asigurată prin monitorizare proactivă, indecși optimizați și politici stricte de backup & recovery.',
          tags: ['99.9% Uptime', 'Zero Data Loss', 'High Availability']
        },
        {
          label: '40% Reducere Timp SQL',
          kind: 'claim',
          dx: 0.2,
          dy: 6.2,
          dz: 3.4,
          desc: 'Optimizare demonstrată a timpilor de răspuns la interogări complexe și raportări prin refactoring SQL și indexare.',
          tags: ['-40% Query Time', 'SQL Tuning', 'Indexare']
        },
        {
          label: '15+ Tehnologii & Limbaje',
          kind: 'file',
          dx: -0.4,
          dy: -6.2,
          dz: -3.2,
          desc: 'Ecosistem tehnic complet: JavaScript/TypeScript, React, Next.js, Node.js, SQL, Python, PHP, C++ și infrastructură cloud.',
          tags: ['15+ Tehnologii', 'Frontend & Backend', 'Cloud & DevOps']
        }
      ]
    },
    en: {
      tab: 'about me',
      title: '03 ABOUT ME · VISION & METRICS',
      subtitle: 'highlights and metric cards from About Me (#about)',
      nodes: [
        {
          label: 'Results-Driven Engineering',
          kind: 'rule',
          dx: -5.4,
          dy: 4.2,
          dz: 2.5,
          desc: 'Every line of code and SQL query is written with a clear goal: speed, security, and measurable business value.',
          tags: ['Performance', 'Security', 'Measurable ROI']
        },
        {
          label: 'Transparent Communication',
          kind: 'approval',
          dx: 5.8,
          dy: 3.4,
          dz: -1.8,
          desc: 'No unnecessary jargon. Clear explanations, realistic estimates, and transparent progress updates at every stage.',
          tags: ['Clear Comms', 'Realistic Estimates', 'Transparency']
        },
        {
          label: '5+ Years IT Experience',
          kind: 'claim',
          dx: -6.2,
          dy: -3.8,
          dz: 2.2,
          desc: 'Over 5 years of continuous experience across IT support, digitalization, database administration, and Full-Stack development.',
          tags: ['5+ Years', 'Full-Stack', 'Enterprise IT']
        },
        {
          label: '99.9% Database Uptime',
          kind: 'spec',
          dx: 5.5,
          dy: -4.6,
          dz: -2.4,
          desc: 'Mission-critical availability backed by proactive monitoring, tuned indexes, and strict backup & recovery policies.',
          tags: ['99.9% Uptime', 'Zero Data Loss', 'High Availability']
        },
        {
          label: '40% SQL Query Speedup',
          kind: 'claim',
          dx: 0.2,
          dy: 6.2,
          dz: 3.4,
          desc: 'Proven reduction in complex query and reporting execution times through SQL refactoring and indexing.',
          tags: ['-40% Query Time', 'SQL Tuning', 'Indexing']
        },
        {
          label: '15+ Technologies & Languages',
          kind: 'file',
          dx: -0.4,
          dy: -6.2,
          dz: -3.2,
          desc: 'Full technical stack: JavaScript/TypeScript, React, Next.js, Node.js, SQL, Python, PHP, C++, and cloud tooling.',
          tags: ['15+ Technologies', 'Frontend & Backend', 'Cloud & DevOps']
        }
      ]
    }
  },
  {
    id: 'projects',
    rgb: [0.98, 0.8, 0.082],
    colorCss: '#facc15',
    targetSelector: '#projects',
    pos: { x: 16, y: -11, z: 8 },
    wordCount: 42,
    ro: {
      tab: 'portofoliu',
      title: '04 PORTOFOLIU · PROIECTE ÎN PRODUCȚIE',
      subtitle: 'cele 5 proiecte din site · click pe [↗ LIVE] / [↗ GITHUB] / [📋 STUDIU CAZ]',
      nodes: [
        {
          label: 'Aplicație CRM & Gestiune Servicii (Instalbloc)',
          kind: 'release',
          dx: -6.8,
          dy: 4.5,
          dz: 2.4,
          matchKey: 'proj3',
          projectKey: 'proj3',
          category: 'crm',
          desc: 'Platformă B2B Edge SSR pe Cloudflare Workers & R2 pentru digitalizarea asociațiilor de proprietari. Raportare avarii cu SLA 96h, compresie foto WebP și 0€ costuri hosting.',
          tags: ['Next.js 15', 'Cloudflare Workers', 'Cloudflare R2', 'Turso LibSQL', 'Drizzle ORM']
        },
        {
          label: 'Platformă Civică & Audit Urban (Viziune Urbană Ploiești)',
          kind: 'file',
          dx: 6.8,
          dy: 4.1,
          dz: -2.0,
          matchKey: 'proj4',
          projectKey: 'proj4',
          category: 'civic',
          desc: 'Platformă interactivă de raportare civică și monitorizare a infrastructurii urbane, cu hartă dinamică, clasificare sesizări și panou transparent de audit.',
          tags: ['React 19', 'TypeScript', 'Hărți Interactive', 'Civic Tech']
        },
        {
          label: 'CV Builder Pro & ATS Analyzer (SaaS)',
          kind: 'spec',
          dx: -6.4,
          dy: -4.8,
          dz: 3.6,
          matchKey: 'proj1',
          projectKey: 'proj1',
          category: 'saas',
          desc: 'Aplicație SaaS completă pentru crearea CV-urilor optimizate ATS, cu scor de compatibilitate în timp real, export PDF prin microserviciu Puppeteer și plăți Stripe.',
          tags: ['React', 'Firebase / Firestore', 'Stripe Webhooks', 'Puppeteer PDF']
        },
        {
          label: 'Magazin Online cu Chat Live (Florărie)',
          kind: 'claim',
          dx: 6.4,
          dy: -4.6,
          dz: 1.5,
          matchKey: 'proj2',
          projectKey: 'proj2',
          category: 'ecommerce',
          desc: 'Sistem e-commerce complet cu gestiune stocuri în timp real, coș de cumpărături, panou de administrare comenzi și suport clienți prin chat live WebSockets.',
          tags: ['Node.js', 'WebSockets', 'MySQL', 'E-Commerce', 'Cod Privat (Client)']
        },
        {
          label: 'Portofoliu Tiberiu & Universal 3D Engine',
          kind: 'owner',
          dx: 0.0,
          dy: 6.6,
          dz: -3.0,
          matchKey: 'proj5',
          projectKey: 'proj5',
          category: 'saas',
          desc: 'Platforma curentă: arhitectură Vanilla Vite ultra-rapidă, conformă Strict CSP (Zero-innerHTML), cu emulator CLI și motor WebGL 3D Neural Swarm.',
          tags: ['Vanilla ES6+', 'WebGL Shaders', 'Strict CSP', 'Vite 8']
        }
      ]
    },
    en: {
      tab: 'portfolio',
      title: '04 PORTFOLIO · PRODUCTION PROJECTS',
      subtitle: 'the 5 site projects · click [↗ LIVE] / [↗ GITHUB] / [📋 CASE STUDY]',
      nodes: [
        {
          label: 'CRM & Service Management App (Instalbloc)',
          kind: 'release',
          dx: -6.8,
          dy: 4.5,
          dz: 2.4,
          matchKey: 'proj3',
          projectKey: 'proj3',
          category: 'crm',
          desc: 'B2B platform running Edge SSR on Cloudflare Workers & R2 for homeowner associations. 96h SLA incidents, client-side WebP compression, and zero hosting costs.',
          tags: ['Next.js 15', 'Cloudflare Workers', 'Cloudflare R2', 'Turso LibSQL', 'Drizzle ORM']
        },
        {
          label: 'Civic Platform & Urban Audit (Viziune Urbana Ploiesti)',
          kind: 'file',
          dx: 6.8,
          dy: 4.1,
          dz: -2.0,
          matchKey: 'proj4',
          projectKey: 'proj4',
          category: 'civic',
          desc: 'Interactive civic reporting and urban infrastructure monitoring platform with dynamic mapping, issue tracking, and public audit dashboard.',
          tags: ['React 19', 'TypeScript', 'Interactive Maps', 'Civic Tech']
        },
        {
          label: 'CV Builder Pro & ATS Analyzer (SaaS)',
          kind: 'spec',
          dx: -6.4,
          dy: -4.8,
          dz: 3.6,
          matchKey: 'proj1',
          projectKey: 'proj1',
          category: 'saas',
          desc: 'Full SaaS application for building ATS-optimized resumes with live compatibility scoring, Puppeteer microservice PDF export, and Stripe billing.',
          tags: ['React', 'Firebase / Firestore', 'Stripe Webhooks', 'Puppeteer PDF']
        },
        {
          label: 'E-Commerce Store with Live Chat (Flower Shop)',
          kind: 'claim',
          dx: 6.4,
          dy: -4.6,
          dz: 1.5,
          matchKey: 'proj2',
          projectKey: 'proj2',
          category: 'ecommerce',
          desc: 'Complete e-commerce system featuring real-time inventory management, shopping cart, order admin panel, and live WebSocket customer chat.',
          tags: ['Node.js', 'WebSockets', 'MySQL', 'E-Commerce', 'Private Client Code']
        },
        {
          label: 'Tiberiu Portfolio & Universal 3D Engine',
          kind: 'owner',
          dx: 0.0,
          dy: 6.6,
          dz: -3.0,
          matchKey: 'proj5',
          projectKey: 'proj5',
          category: 'saas',
          desc: 'This platform: ultra-fast Vanilla Vite architecture, Strict CSP compliant (Zero-innerHTML), interactive CLI, and native WebGL 3D Neural Swarm.',
          tags: ['Vanilla ES6+', 'WebGL Shaders', 'Strict CSP', 'Vite 8']
        }
      ]
    }
  },
  {
    id: 'skills',
    rgb: [0.984, 0.443, 0.522],
    colorCss: '#fb7185',
    targetSelector: '#skills',
    pos: { x: -20, y: -9, z: -5 },
    wordCount: 33,
    ro: {
      tab: 'competențe',
      title: '05 COMPETENȚE & ARSENAL TEHNIC',
      subtitle: 'cele 4 carduri de competențe + limbi străine din #skills',
      nodes: [
        {
          label: 'Dezvoltare Frontend & UI',
          kind: 'file',
          dx: -5.6,
          dy: 4.1,
          dz: 2.5,
          desc: 'Construiesc interfețe rapide, responsive și accesibile: HTML5/CSS3 (95%), JavaScript ES6+/TypeScript (90%), React & Next.js (85%), Tailwind & Bootstrap (90%).',
          tags: ['HTML5 & CSS3 (95%)', 'JS ES6+ / TS (90%)', 'React & Next.js (85%)', 'Tailwind (90%)']
        },
        {
          label: 'Backend & Baze de Date',
          kind: 'spec',
          dx: 5.8,
          dy: 3.4,
          dz: -2.0,
          desc: 'Arhitectură server-side și gestiune date: SQL PostgreSQL/MySQL/MS SQL (90%), Node.js & Express (85%), PHP & Python (80%), Supabase/Firebase/Turso (85%).',
          tags: ['SQL: PG / MySQL / MSSQL (90%)', 'Node.js & Express (85%)', 'PHP & Python (80%)', 'Supabase / Turso (85%)']
        },
        {
          label: 'Hardware, Suport & Mentenanță',
          kind: 'approval',
          dx: -5.8,
          dy: -4.2,
          dz: 2.8,
          desc: 'Diagnosticare și asamblare PC/Laptop (95%), Administrare Windows/Linux/Server (90%), Rețelistică LAN/WAN/VPN/Routing (85%), Securitate & Backup (90%).',
          tags: ['Diagnoză PC/Laptop (95%)', 'Win / Linux Server (90%)', 'Rețelistică VPN (85%)', 'Backup & Security (90%)']
        },
        {
          label: 'DevOps, Limbaje OOP & Unelte',
          kind: 'rule',
          dx: 5.8,
          dy: -4.0,
          dz: -1.8,
          desc: 'Ecosistem complet de inginerie software: Git & GitHub, C/C++, Java (OOP), RESTful APIs, Postman, Linux CLI, Vercel, Docker și ERP/CRM Systems.',
          tags: ['Git & GitHub', 'C/C++ & Java OOP', 'REST APIs', 'Docker & Vercel', 'ERP / CRM']
        },
        {
          label: 'Limbi Străine: RO · EN (C1) · DE (B2)',
          kind: 'claim',
          dx: 0.0,
          dy: 6.1,
          dz: -3.2,
          desc: 'Comunicare tehnică și de business: Română (Limbă Maternă), Engleză (C1 — Utilizator Experimentat), Germană (B2 — Utilizator Independent).',
          tags: ['Română (Nativ)', 'Engleză (C1 Avansat)', 'Germană (B2 Intermediar)']
        }
      ]
    },
    en: {
      tab: 'skills',
      title: '05 SKILLS & TECHNICAL ARSENAL',
      subtitle: 'the 4 skill category cards + languages from #skills',
      nodes: [
        {
          label: 'Frontend & UI Development',
          kind: 'file',
          dx: -5.6,
          dy: 4.1,
          dz: 2.5,
          desc: 'Fast, responsive, accessible interfaces: HTML5/CSS3 (95%), JavaScript ES6+/TypeScript (90%), React & Next.js (85%), Tailwind & Bootstrap (90%).',
          tags: ['HTML5 & CSS3 (95%)', 'JS ES6+ / TS (90%)', 'React & Next.js (85%)', 'Tailwind (90%)']
        },
        {
          label: 'Backend & Databases',
          kind: 'spec',
          dx: 5.8,
          dy: 3.4,
          dz: -2.0,
          desc: 'Server-side & data engineering: SQL PostgreSQL/MySQL/MS SQL (90%), Node.js & Express (85%), PHP & Python (80%), Supabase/Firebase/Turso (85%).',
          tags: ['SQL: PG / MySQL / MSSQL (90%)', 'Node.js & Express (85%)', 'PHP & Python (80%)', 'Supabase / Turso (85%)']
        },
        {
          label: 'Hardware, Support & Maintenance',
          kind: 'approval',
          dx: -5.8,
          dy: -4.2,
          dz: 2.8,
          desc: 'PC/Laptop Diagnostics & Assembly (95%), Windows/Linux/Server Admin (90%), LAN/WAN/VPN Networking (85%), Security & Backup (90%).',
          tags: ['PC Diagnostics (95%)', 'Win / Linux Server (90%)', 'VPN Networking (85%)', 'Backup & Security (90%)']
        },
        {
          label: 'DevOps, OOP Languages & Tooling',
          kind: 'rule',
          dx: 5.8,
          dy: -4.0,
          dz: -1.8,
          desc: 'Software engineering ecosystem: Git & GitHub, C/C++, Java (OOP), RESTful APIs, Postman, Linux CLI, Vercel, Docker, and ERP/CRM Systems.',
          tags: ['Git & GitHub', 'C/C++ & Java OOP', 'REST APIs', 'Docker & Vercel', 'ERP / CRM']
        },
        {
          label: 'Languages: RO · EN (C1) · DE (B2)',
          kind: 'claim',
          dx: 0.0,
          dy: 6.1,
          dz: -3.2,
          desc: 'Technical and business fluency: Romanian (Native), English (C1 — Proficient User), German (B2 — Independent User).',
          tags: ['Romanian (Native)', 'English (C1 Advanced)', 'German (B2 Intermediate)']
        }
      ]
    }
  },
  {
    id: 'experience',
    rgb: [0.655, 0.545, 0.98],
    colorCss: '#a78bfa',
    targetSelector: '#experience',
    pos: { x: -2, y: -17, z: 5 },
    wordCount: 18,
    ro: {
      tab: 'experiență',
      title: '06 EXPERIENȚĂ & EDUCAȚIE',
      subtitle: 'cele 5 carduri cronologice din rubrica Experiență (#experience)',
      nodes: [
        {
          label: 'Administrator Baze de Date (DBA) · Corpul Experților',
          kind: 'owner',
          dx: -5.6,
          dy: 3.6,
          dz: 2.2,
          desc: '2026 - Prezent: Administrare, optimizare și securizare baze de date, automatizare raportări SQL și asigurarea integrității și disponibilității datelor.',
          tags: ['DBA', 'SQL Tuning', 'Securitate Date', '2026 - Prezent']
        },
        {
          label: 'Asistent Manager & Coordonator Digitalizare · SIATI SRL',
          kind: 'claim',
          dx: 5.8,
          dy: 2.6,
          dz: -2.0,
          desc: '2018 - 2024 (6 ani): Coordonarea proceselor de digitalizare, implementare soluții ERP/CRM, gestiune baze de date clienți și optimizare fluxuri operaționale.',
          tags: ['Digitalizare', 'ERP / CRM', 'Gestiune Date', '2018 - 2024']
        },
        {
          label: 'Tehnician IT (Suport Nivel 1 și 2) · GFR',
          kind: 'spec',
          dx: -4.8,
          dy: -4.8,
          dz: 3.0,
          desc: 'Grup Feroviar Român: Suport tehnic hardware/software pentru infrastructură critică, depanare rețele, configurare stații de lucru și rezolvare tichete SLA.',
          tags: ['IT Support Tier 1/2', 'Rețelistică', 'Hardware', 'Grup Feroviar Român']
        },
        {
          label: 'Studii Analist Programator (Nivel 5) · Colegiul „Elie Radu”',
          kind: 'approval',
          dx: 5.4,
          dy: -4.2,
          dz: 1.2,
          desc: '2024 - 2026: Specializare postliceală în proiectarea algoritmilor, baze de date relaționale, programare orientată pe obiecte (OOP) și dezvoltare software.',
          tags: ['Analist Programator', 'Algoritmi & OOP', 'Baze de Date', '2024 - 2026']
        },
        {
          label: 'Master & Licență în Management · Univ. Bioterra',
          kind: 'approval',
          dx: 0.0,
          dy: 5.8,
          dz: -3.0,
          desc: 'Formare academică în management organizațional, analiză economică, gestiunea proiectelor și optimizarea resurselor.',
          tags: ['Master Management', 'Inginerie Economică', 'Project Management']
        }
      ]
    },
    en: {
      tab: 'experience',
      title: '06 EXPERIENCE & EDUCATION',
      subtitle: 'the 5 timeline cards from Experience & Education (#experience)',
      nodes: [
        {
          label: 'Database Administrator (DBA) · Corpul Expertilor',
          kind: 'owner',
          dx: -5.6,
          dy: 3.6,
          dz: 2.2,
          desc: '2026 - Present: Database administration, query tuning, security hardening, automated SQL reporting, and high-availability data governance.',
          tags: ['DBA', 'SQL Tuning', 'Data Security', '2026 - Present']
        },
        {
          label: 'Assistant Manager & Digitalization Coordinator · SIATI',
          kind: 'claim',
          dx: 5.8,
          dy: 2.6,
          dz: -2.0,
          desc: '2018 - 2024 (6 yrs): Led company digitalization, ERP/CRM implementation, client database management, and operational workflow automation.',
          tags: ['Digitalization', 'ERP / CRM', 'Data Management', '2018 - 2024']
        },
        {
          label: 'IT Technician (Tier 1 & 2 Support) · GFR',
          kind: 'spec',
          dx: -4.8,
          dy: -4.8,
          dz: 3.0,
          desc: 'Grup Feroviar Roman: Hardware/software technical support for critical infrastructure, network troubleshooting, workstation setup, and SLA ticketing.',
          tags: ['Tier 1/2 Support', 'Networking', 'Hardware', 'Critical Infra']
        },
        {
          label: 'Programmer Analyst Studies (Level 5) · Elie Radu College',
          kind: 'approval',
          dx: 5.4,
          dy: -4.2,
          dz: 1.2,
          desc: '2024 - 2026: Advanced specialization in algorithm design, relational databases, object-oriented programming (OOP), and software development.',
          tags: ['Programmer Analyst', 'Algorithms & OOP', 'Databases', '2024 - 2026']
        },
        {
          label: 'MSc & BSc in Management · Bioterra University',
          kind: 'approval',
          dx: 0.0,
          dy: 5.8,
          dz: -3.0,
          desc: 'Academic degree in organizational management, economic analysis, project management, and resource optimization.',
          tags: ['MSc Management', 'Economic Engineering', 'Project Management']
        }
      ]
    }
  },
  {
    id: 'contact',
    rgb: [0.984, 0.573, 0.235],
    colorCss: '#fb923c',
    targetSelector: '#contact',
    pos: { x: 2, y: 1, z: 12 },
    wordCount: 14,
    ro: {
      tab: 'contact',
      title: '07 CONTACT & CANALE DIRECTE',
      subtitle: 'toate canalele din rubrica Contact (#contact) · click pentru acțiune',
      nodes: [
        {
          label: 'WhatsApp Direct: +40 720 955 119',
          kind: 'release',
          dx: -5.4,
          dy: 3.4,
          dz: 2.2,
          matchKey: 'whatsapp',
          desc: 'Canalul cel mai rapid pentru discuții tehnice, estimări de proiect sau urgențe IT.',
          tags: ['WhatsApp Instant', '+40 720 955 119', 'Răspuns Rapid']
        },
        {
          label: 'Telefon: +40 720 955 119',
          kind: 'owner',
          dx: 5.6,
          dy: 3.2,
          dz: -1.4,
          matchKey: 'phone',
          desc: 'Apel telefonic direct pentru consultanță IT, arhitectură software și suport.',
          tags: ['Apel Direct', '+40 720 955 119', 'Ploiești / Remote']
        },
        {
          label: 'Email: contact@tiberiumilitaru.ro',
          kind: 'spec',
          dx: -5.2,
          dy: -4.2,
          dz: 2.8,
          matchKey: 'email',
          desc: 'Trimite specificațiile proiectului sau solicitarea de ofertă pe adresa oficială.',
          tags: ['contact@tiberiumilitaru.ro', 'Ofertă Tehnică', 'B2B / B2C']
        },
        {
          label: 'Descarcă CV Complet (PDF)',
          kind: 'file',
          dx: 5.4,
          dy: -4.0,
          dz: -2.0,
          matchKey: 'cv_pdf',
          desc: 'Versiunea oficială PDF a CV-ului cu întregul istoric profesional, proiecte și competențe.',
          tags: ['CV-Militaru-Tiberiu.pdf', 'Download Direct', 'PDF']
        },
        {
          label: 'LinkedIn & GitHub Repositories',
          kind: 'approval',
          dx: 0.0,
          dy: 5.6,
          dz: -2.8,
          matchKey: 'linkedin',
          desc: 'Profilul profesional LinkedIn și codul sursă al proiectelor publice pe GitHub.',
          tags: ['LinkedIn', 'GitHub Open-Source', 'Portofoliu Cod']
        },
        {
          label: 'Formular Contact Direct (#contact)',
          kind: 'claim',
          dx: 0.2,
          dy: -5.8,
          dz: 1.8,
          matchKey: 'contact_form',
          desc: 'Completează formularul securizat din pagină pentru a trimite un mesaj direct în inbox.',
          tags: ['Formular Web', 'Anti-Spam', 'Răspuns < 24h']
        }
      ]
    },
    en: {
      tab: 'contact',
      title: '07 CONTACT & DIRECT CHANNELS',
      subtitle: 'all channels from the Contact section (#contact) · click for action',
      nodes: [
        {
          label: 'WhatsApp Direct: +40 720 955 119',
          kind: 'release',
          dx: -5.4,
          dy: 3.4,
          dz: 2.2,
          matchKey: 'whatsapp',
          desc: 'Fastest channel for technical discussions, project estimates, or urgent IT support.',
          tags: ['Instant WhatsApp', '+40 720 955 119', 'Fast Reply']
        },
        {
          label: 'Phone: +40 720 955 119',
          kind: 'owner',
          dx: 5.6,
          dy: 3.2,
          dz: -1.4,
          matchKey: 'phone',
          desc: 'Direct phone call for IT consulting, software architecture, and support.',
          tags: ['Direct Call', '+40 720 955 119', 'Ploiesti / Remote']
        },
        {
          label: 'Email: contact@tiberiumilitaru.ro',
          kind: 'spec',
          dx: -5.2,
          dy: -4.2,
          dz: 2.8,
          matchKey: 'email',
          desc: 'Send your project specifications or RFP to the official email address.',
          tags: ['contact@tiberiumilitaru.ro', 'Technical Quote', 'B2B / B2C']
        },
        {
          label: 'Download Full Resume (PDF)',
          kind: 'file',
          dx: 5.4,
          dy: -4.0,
          dz: -2.0,
          matchKey: 'cv_pdf',
          desc: 'Official PDF resume containing the complete professional history, projects, and skills.',
          tags: ['CV-Militaru-Tiberiu.pdf', 'Direct Download', 'PDF']
        },
        {
          label: 'LinkedIn & GitHub Repositories',
          kind: 'approval',
          dx: 0.0,
          dy: 5.6,
          dz: -2.8,
          matchKey: 'linkedin',
          desc: 'Professional LinkedIn profile and public open-source repositories on GitHub.',
          tags: ['LinkedIn', 'GitHub Open-Source', 'Code Portfolio']
        },
        {
          label: 'Direct Contact Form (#contact)',
          kind: 'claim',
          dx: 0.2,
          dy: -5.8,
          dz: 1.8,
          matchKey: 'contact_form',
          desc: 'Fill out the secure on-page contact form to send a message straight to the inbox.',
          tags: ['Web Form', 'Anti-Spam', 'Reply < 24h']
        }
      ]
    }
  }
];

const KIND_STYLES = {
  owner: { border: '#facc15', fill: 'rgba(250, 204, 21, 0.14)', text: '#fef08a' },
  role: { border: '#2dd4bf', fill: 'rgba(45, 212, 191, 0.14)', text: '#99f6e4' },
  claim: { border: '#38bdf8', fill: 'rgba(56, 189, 248, 0.14)', text: '#bae6fd' },
  spec: { border: '#60a5fa', fill: 'rgba(96, 165, 250, 0.14)', text: '#dbeafe' },
  release: { border: '#4ade80', fill: 'rgba(74, 222, 128, 0.14)', text: '#bbf7d0' },
  file: { border: '#a3e635', fill: 'rgba(163, 230, 53, 0.14)', text: '#ecfccb' },
  approval: { border: '#c084fc', fill: 'rgba(192, 132, 252, 0.14)', text: '#f3e8ff' },
  rule: { border: '#fb7185', fill: 'rgba(251, 113, 133, 0.16)', text: '#ffe4e6' }
};

const GATEKEEPER_CODE_LINES = [
  '# gatekeeper.ts · 1:1 site DOM graph',
  'graph = sync_dom("tiberiumilitaru.ro")',
  'spider = Crawler(legs=16, tent=22)',
  'for rubric in graph.rubrics_7:',
  '  spider.walk_to(rubric.star_core)',
  '  for card in rubric.emerge_cards():',
  '    spider.bind_synapse(card)',
  '    if card.section == "portofoliu":',
  '      attach_live_project_link(card)',
  '    if card.kind == "rule":',
  '      enforce_strict_csp(card)',
  'return verify_release(score=98)'
];

const CASE_STUDIES_DATA = {
  ro: {
    proj3: {
      title: 'InstalBloc — Portal Administrare & Contorizare',
      badge: 'SaaS / PropTech (2026)',
      challenge:
        'Asociațiile de proprietari pierdeau zeci de ore lunar cu centralizarea manuală a indecșilor de apă pe hârtie și WhatsApp, generând erori de calcul la întreținere și lipsă de transparență.',
      architecture:
        'Aplicație web modulară cu interfață intuitivă pentru locatari (raportare indecși în 15 secunde de pe mobil) și dashboard administrativ cu validare automată a consumului, istoric și export direct pentru listele de plată.',
      results: [
        'Timpul de colectare și verificare a indecșilor redus cu 85%',
        'Zero erori de transcriere între contorul locatarului și tabelul centralizator',
        'Interfață Mobile-First adaptată inclusiv pentru utilizatori non-tehnici'
      ],
      stack: ['HTML5 / CSS3', 'JavaScript (ES6+)', 'State Management', 'Vercel Edge', 'Responsive UI']
    },
    proj4: {
      title: 'Viziune Urbană Ploiești — Platformă CivicTech',
      badge: 'CivicTech / Smart City (2026)',
      challenge:
        'Cetățenii nu aveau un canal vizual și centralizat prin care să urmărească proiectele de infrastructură ale orașului sau să raporteze punctual problemele din cartiere.',
      architecture:
        'Portal interactiv de transparență decizională și consultare publică, structurat pe piloni de dezvoltare urbană, raportare geo-localizată a sesizărilor și afișare clară a bugetelor și stadiilor de execuție.',
      results: [
        'Scor 100/100 Google Lighthouse la Performanță și Accesibilitate',
        'Arhitectură scalabilă pregătită pentru trafic civic ridicat fără latență',
        'Design modern, instituțional și accesibil de pe orice dispozitiv'
      ],
      stack: ['Semantic HTML5', 'Modern CSS Grid', 'Vanilla JS', 'Web Accessibility (WCAG)', 'SEO']
    },
    proj1: {
      title: 'CV Builder Pro — Generator CV compatibil ATS',
      badge: 'HR Tech / Web App (2026)',
      challenge:
        'Peste 70% dintre CV-urile clasice sunt respinse automat de sistemele ATS (Applicant Tracking Systems) din cauza formatării complexe sau a lipsei structurii semantice.',
      architecture:
        'Single-Page Application cu randare în timp real (Live Preview), validare automată a câmpurilor, persistență locală securizată și motor de export PDF vectorial care păstrează textul 100% selectabil și lizibil pentru roboții de recrutare.',
      results: [
        'Compatibilitate 100% cu filtrele ATS corporatiste',
        'Generare instantanee a PDF-ului direct în browser (fără latență de server)',
        'Peste 15 secțiuni personalizabile în timp real'
      ],
      stack: ['JavaScript ES6+', 'HTML2PDF / Print Engine', 'LocalStorage State', 'Firebase Hosting']
    },
    proj2: {
      title: 'Florărie E-Commerce — Magazin Online & Gestiune',
      badge: 'E-Commerce / Retail (Proiect Privat NDA)',
      challenge:
        'Gestionarea comenzilor telefonice în perioadele de vârf (1–8 Martie, Valentine’s Day) ducea la blocaje operaționale și desincronizări ale stocului de flori proaspete.',
      architecture:
        'Platformă completă de comerț electronic cu coș de cumpărături dinamic, selector de intervale de livrare prin curier propriu, mesaj personalizat pe felicitare și panou intern de gestiune a comenzilor.',
      results: [
        'Creșterea valorii medii a coșului (AOV) prin upsell automat la checkout',
        'Eliminarea suprapunerilor de comenzi în zilele cu volum critic',
        'Notă: Codul sursă și instanța live sunt private conform clauzei de confidențialitate (NDA)'
      ],
      stack: ['E-Commerce UI', 'Cart State Machine', 'Order Checkout Flow', 'Responsive Mobile']
    },
    proj5: {
      title: 'Portofoliu Arhitectural & 3D Swarm Engine',
      badge: 'Zero-Trust Web & WebGL (2026)',
      challenge:
        'Construirea unei platforme personale care să demonstreze simultan rigoare inginerească de nivel enterprise (Zero-Trust DOM, Strict CSP) și capabilități grafice avansate (WebGL 3D) fără librării grele.',
      architecture:
        'Arhitectură hibridă cu 0 dependențe de runtime: site ultrarapid (Scor 100 PageSpeed) cuplat cu un motor WebGL custom (TiberiuSwarmEngine) care transformă întregul DOM într-o constelație 3D interactivă cu sintetizator audio WebAudio.',
      results: [
        '0 vulnerabilități XSS (fără innerHTML, fără inline styles, CSP strict)',
        'Motor 3D cu 60.000+ particule rulat nativ în GPU prin GLSL Shaders',
        'Pipeline CI/CD determinist validat prin Gatekeeper (ESLint + Vite Build)'
      ],
      stack: ['Vanilla Vite', 'Custom WebGL / GLSL', 'WebAudio Synth', 'Strict CSP', 'Node.js API']
    }
  },
  en: {
    proj3: {
      title: 'InstalBloc — HOA Management & Metering Portal',
      badge: 'SaaS / PropTech (2026)',
      challenge:
        'Homeowners associations wasted dozens of hours monthly collecting water meter readings via paper and WhatsApp, causing billing errors and lack of transparency.',
      architecture:
        'Modular web application featuring a 15-second mobile meter submission flow for residents and an admin dashboard with automated consumption validation, history tracking, and billing export.',
      results: [
        'Reduced monthly meter collection and verification time by 85%',
        'Zero transcription errors between resident meters and master spreadsheets',
        'Mobile-first interface tailored for non-technical users'
      ],
      stack: ['HTML5 / CSS3', 'JavaScript (ES6+)', 'State Management', 'Vercel Edge', 'Responsive UI']
    },
    proj4: {
      title: 'Ploiești Urban Vision — CivicTech Platform',
      badge: 'CivicTech / Smart City (2026)',
      challenge:
        'Citizens lacked a centralized visual hub to track municipal infrastructure projects or submit geo-targeted neighborhood issue reports.',
      architecture:
        'Interactive public consultation and transparency portal structured around urban development pillars, geo-tagged civic reporting, and clear budget/stage tracking.',
      results: [
        '100/100 Google Lighthouse score in Performance and Accessibility',
        'Scalable static-first architecture handling high civic traffic with zero latency',
        'Clean institutional UX accessible across all mobile and desktop devices'
      ],
      stack: ['Semantic HTML5', 'Modern CSS Grid', 'Vanilla JS', 'Web Accessibility (WCAG)', 'SEO']
    },
    proj1: {
      title: 'CV Builder Pro — ATS-Compliant Resume Generator',
      badge: 'HR Tech / Web App (2026)',
      challenge:
        'Over 70% of standard resumes are automatically rejected by corporate ATS (Applicant Tracking Systems) due to broken layouts or non-semantic formatting.',
      architecture:
        'Single-Page Application with real-time live preview, field validation, local state persistence, and a vector PDF export engine that keeps text 100% selectable and machine-readable.',
      results: [
        '100% compatibility with corporate ATS parsers',
        'Instant client-side PDF generation with zero server latency',
        'Over 15 customizable resume sections with real-time layout sync'
      ],
      stack: ['JavaScript ES6+', 'HTML2PDF / Print Engine', 'LocalStorage State', 'Firebase Hosting']
    },
    proj2: {
      title: 'Flower Shop E-Commerce — Online Store & Inventory',
      badge: 'E-Commerce / Retail (Private NDA Project)',
      challenge:
        'Managing phone orders during peak floral seasons (Valentine’s Day, March 1–8) caused operational bottlenecks and fresh-stock desynchronization.',
      architecture:
        'Full e-commerce storefront with dynamic cart state machine, delivery time-slot scheduling, custom greeting card builder, and internal order management dashboard.',
      results: [
        'Increased Average Order Value (AOV) via automated checkout upsells',
        'Eliminated order collisions during peak holiday traffic',
        'Note: Source code and live deployment are private under client NDA'
      ],
      stack: ['E-Commerce UI', 'Cart State Machine', 'Order Checkout Flow', 'Responsive Mobile']
    },
    proj5: {
      title: 'Architectural Portfolio & 3D Swarm Engine',
      badge: 'Zero-Trust Web & WebGL (2026)',
      challenge:
        'Building a personal engineering platform that simultaneously demonstrates enterprise Zero-Trust security (Strict CSP, zero innerHTML) and custom 3D WebGL graphics without heavy frameworks.',
      architecture:
        'Zero-dependency hybrid architecture: a 100-score PageSpeed static site paired with a custom WebGL engine (TiberiuSwarmEngine) that transforms the live DOM into an interactive 3D universe with procedural WebAudio synthesis.',
      results: [
        'Zero XSS surface (no innerHTML, no inline styles, strict CSP)',
        '60,000+ particle 3D universe rendered natively on GPU via custom GLSL shaders',
        'Deterministic Gatekeeper CI pipeline (ESLint max-warnings=0 + Vite build)'
      ],
      stack: ['Vanilla Vite', 'Custom WebGL / GLSL', 'WebAudio Synth', 'Strict CSP', 'Node.js API']
    }
  }
};

/* ==========================================================================
   2. PROCEDURAL WEB AUDIO SYNTHESIZER (ZERO EXTERNAL MP3 FILES)
   ========================================================================== */

class SwarmAudioSynth {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.isMuted = false;
    this.droneActive = false;
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.isMuted ? 0 : 0.28;
    this.master.connect(this.ctx.destination);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(this.isMuted ? 0 : 0.28, this.ctx.currentTime, 0.04);
    }
    return this.isMuted;
  }

  playImplosion() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(195, now);
    osc.frequency.exponentialRampToValueAtTime(26, now + 1.45);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(950, now);
    filter.frequency.exponentialRampToValueAtTime(80, now + 1.45);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 1.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.55);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);

    osc.start(now);
    osc.stop(now + 1.6);
  }

  playBigBang() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(115, now);
    sub.frequency.exponentialRampToValueAtTime(22, now + 1.35);

    subGain.gain.setValueAtTime(0.7, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    sub.connect(subGain);
    subGain.connect(this.master);
    sub.start(now);
    sub.stop(now + 1.45);

    const bufLen = Math.floor(this.ctx.sampleRate * 1.1);
    const buf = this.ctx.createBuffer(1, bufLen, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, now);
    filter.frequency.exponentialRampToValueAtTime(110, now + 1.05);

    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(0.35, now);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

    noise.connect(filter);
    filter.connect(nGain);
    nGain.connect(this.master);
    noise.start(now);

    this.startDrone();
  }

  startDrone() {
    if (!this.ctx || this.droneActive) return;
    const now = this.ctx.currentTime;

    const dGain = this.ctx.createGain();
    dGain.gain.setValueAtTime(0.001, now);
    dGain.gain.linearRampToValueAtTime(0.09, now + 1.8);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 135;

    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sawtooth';
    this.droneOsc2.type = 'triangle';
    this.droneOsc1.frequency.value = 55;
    this.droneOsc2.frequency.value = 55.35;

    this.droneOsc1.connect(filter);
    this.droneOsc2.connect(filter);
    filter.connect(dGain);
    dGain.connect(this.master);

    this.droneOsc1.start(now);
    this.droneOsc2.start(now);
    this.droneActive = true;
  }

  playPing(type = 'hover') {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(960, now);
      osc.frequency.exponentialRampToValueAtTime(1440, now + 0.05);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'read') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(500 + Math.random() * 420, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.035);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.16);
      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.22);
    }

    osc.connect(gain);
    gain.connect(this.master);
  }

  playPortalRestore() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // ACT 1 (0.00s - 0.50s): Reverse Gravitational Suction into #swarmAtomicBtn
    const suckOsc = this.ctx.createOscillator();
    const suckFilter = this.ctx.createBiquadFilter();
    const suckGain = this.ctx.createGain();

    suckOsc.type = 'sawtooth';
    suckOsc.frequency.setValueAtTime(520, now);
    suckOsc.frequency.exponentialRampToValueAtTime(68, now + 0.48);

    suckFilter.type = 'bandpass';
    suckFilter.Q.value = 5.5;
    suckFilter.frequency.setValueAtTime(1600, now);
    suckFilter.frequency.exponentialRampToValueAtTime(140, now + 0.48);

    suckGain.gain.setValueAtTime(0.01, now);
    suckGain.gain.linearRampToValueAtTime(0.18, now + 0.22);
    suckGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    suckOsc.connect(suckFilter);
    suckFilter.connect(suckGain);
    suckGain.connect(this.master);
    suckOsc.start(now);
    suckOsc.stop(now + 0.52);

    // ACT 2 (0.46s - 0.95s): Quantum Critical Mass & Anamorphic Flash in #swarmAtomicBtn
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(155, now + 0.46);
    subOsc.frequency.exponentialRampToValueAtTime(34, now + 0.98);

    subGain.gain.setValueAtTime(0.001, now + 0.46);
    subGain.gain.linearRampToValueAtTime(0.38, now + 0.52);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.05);

    subOsc.connect(subGain);
    subGain.connect(this.master);
    subOsc.start(now + 0.46);
    subOsc.stop(now + 1.08);

    // ACT 3 (0.52s - 1.55s): Holographic Laser Projection Arpeggio (Ejecting DOM from #swarmAtomicBtn)
    const chordNotes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    chordNotes.forEach((freq, idx) => {
      const startT = now + 0.52 + idx * 0.085;
      const chime = this.ctx.createOscillator();
      const cGain = this.ctx.createGain();
      chime.type = idx % 2 === 0 ? 'triangle' : 'sine';
      chime.frequency.setValueAtTime(freq * 0.5, startT);
      chime.frequency.exponentialRampToValueAtTime(freq, startT + 0.09);

      cGain.gain.setValueAtTime(0.001, startT);
      cGain.gain.linearRampToValueAtTime(0.085, startT + 0.04);
      cGain.gain.exponentialRampToValueAtTime(0.001, startT + 0.48);

      chime.connect(cGain);
      cGain.connect(this.master);
      chime.start(startT);
      chime.stop(startT + 0.5);
    });
  }

  stopAll() {
    if (this.droneOsc1) {
      try {
        this.droneOsc1.stop();
        this.droneOsc2.stop();
      } catch (_e) {
        // Ignorăm dacă sunt deja oprite
      }
      this.droneOsc1 = null;
      this.droneOsc2 = null;
    }
    this.droneActive = false;
  }
}

/* ==========================================================================
   3. MULTI-LAYER COSMIC GLSL SHADERS & SPHERICAL 360° CAMERA RIG
   ========================================================================== */

// aLayer: 0.0 = Cele 7 Nebuloase Principale | 1.0 = Deep-Space Stars | 2.0 = Galaxii Îndepărtate
const VERTEX_SRC = `
  attribute vec3 aPos;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aLayer;

  uniform mat4 uProjView;
  uniform float uTime;
  uniform vec2 uPortalNDC;
  uniform float uPortalMix;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;
    vec3 p = aPos;
    vAlpha = 0.86;

    if (aLayer < 0.5) {
      p.x += sin(uTime * 0.75 + aPos.y * 0.45) * 0.22;
      p.y += cos(uTime * 0.65 + aPos.x * 0.45) * 0.22;
      p.z += sin(uTime * 0.55 + aPos.z * 0.45) * 0.22;
    } else if (aLayer < 1.5) {
      vAlpha = 0.52 + 0.45 * sin(uTime * 2.4 + aPos.x * 11.3 + aPos.y * 7.1);
    } else {
      p.x += sin(uTime * 0.22 + aPos.z * 0.08) * 0.45;
      p.y += cos(uTime * 0.22 + aPos.x * 0.08) * 0.45;
      vAlpha = 0.72;
    }

    vec4 clip = uProjView * vec4(p, 1.0);
    if (uPortalMix > 0.001 && clip.w > 0.0) {
      vec2 ndc = clip.xy / clip.w;
      vec2 delta = ndc - uPortalNDC;
      float swirl = uPortalMix * 3.4 * (1.0 + aLayer * 0.28);
      float c = cos(swirl);
      float s = sin(swirl);
      vec2 spun = vec2(delta.x * c - delta.y * s, delta.x * s + delta.y * c);
      float pull = pow(1.0 - uPortalMix, 2.25);
      vec2 finalNDC = uPortalNDC + spun * pull;
      clip.xy = finalNDC * clip.w;
      vAlpha *= (1.0 - uPortalMix * 0.65);
    }
    float scale = (aLayer > 0.5) ? 310.0 : 225.0;
    gl_PointSize = clamp(aSize * (scale / max(1.0, clip.w)), 1.0, 22.0);
    gl_Position = clip;
  }
`;

const FRAGMENT_SRC = `
  precision mediump float;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.06, d) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

class Camera3DRig {
  constructor() {
    this.pos = { x: 0, y: 0, z: 56 };
    this.target = { x: 0, y: 0, z: 0 };
    this.fovRad = (54 * Math.PI) / 180;
    this.aspect = window.innerWidth / window.innerHeight;
    this.near = 0.1;
    this.far = 900.0; // Suficient de adânc pentru galaxiile de la R = 320
    this.projViewMatrix = new Float32Array(16);
  }

  updateMatrix() {
    this.aspect = window.innerWidth / Math.max(1, window.innerHeight);

    let z0 = this.pos.x - this.target.x;
    let z1 = this.pos.y - this.target.y;
    let z2 = this.pos.z - this.target.z;
    let len = Math.hypot(z0, z1, z2) || 1;
    z0 /= len;
    z1 /= len;
    z2 /= len;

    let x0 = z2;
    let x1 = 0;
    let x2 = -z0;
    len = Math.hypot(x0, x1, x2) || 1;
    x0 /= len;
    x1 /= len;
    x2 /= len;

    const y0 = z1 * x2 - z2 * x1;
    const y1 = z2 * x0 - z0 * x2;
    const y2 = z0 * x1 - z1 * x0;

    const tx = -(x0 * this.pos.x + x1 * this.pos.y + x2 * this.pos.z);
    const ty = -(y0 * this.pos.x + y1 * this.pos.y + y2 * this.pos.z);
    const tz = -(z0 * this.pos.x + z1 * this.pos.y + z2 * this.pos.z);

    const f = 1.0 / Math.tan(this.fovRad * 0.5);
    const nf = 1.0 / (this.near - this.far);
    const p0 = f / this.aspect;
    const p5 = f;
    const p10 = (this.far + this.near) * nf;
    const p14 = 2 * this.far * this.near * nf;

    const m = this.projViewMatrix;
    m[0] = p0 * x0;
    m[1] = p5 * y0;
    m[2] = p10 * z0;
    m[3] = -z0;

    m[4] = p0 * x1;
    m[5] = p5 * y1;
    m[6] = p10 * z1;
    m[7] = -z1;

    m[8] = p0 * x2;
    m[9] = p5 * y2;
    m[10] = p10 * z2;
    m[11] = -z2;

    m[12] = p0 * tx;
    m[13] = p5 * ty;
    m[14] = p10 * tz + p14;
    m[15] = -tz;
  }

  projectPoint(x, y, z) {
    const m = this.projViewMatrix;
    const cx = m[0] * x + m[4] * y + m[8] * z + m[12];
    const cy = m[1] * x + m[5] * y + m[9] * z + m[13];
    const cz = m[2] * x + m[6] * y + m[10] * z + m[14];
    const cw = m[3] * x + m[7] * y + m[11] * z + m[15];

    if (cw <= 0.1) {
      return { x: -9999, y: -9999, z: 99, visible: false };
    }
    const ndcX = cx / cw;
    const ndcY = cy / cw;
    const ndcZ = cz / cw;

    return {
      x: (ndcX * 0.5 + 0.5) * window.innerWidth,
      y: (-(ndcY * 0.5) + 0.5) * window.innerHeight,
      z: ndcZ,
      visible: ndcZ < 1.0
    };
  }
}

/* ==========================================================================
   4. MASTER SWARM ENGINE CLASS (WITH 360 ORBIT, DEEP SPACE & DOM LINK HARVESTER)
   ========================================================================== */

export class TiberiuSwarmEngine {
  constructor() {
    this.audio = new SwarmAudioSynth();
    this.cam = new Camera3DRig();
    this.lang = this.detectLanguage();

    this.state = 'IDLE'; // IDLE | MODAL | IMPLODING | SINGULARITY | EXPLODING | SWARM_LIVE | RESTORING
    this.stateStart = 0;
    this.bootTime = 0;
    this.frameCount = 0;
    this.rafId = null;

    this.originX = window.innerWidth * 0.5;
    this.originY = 30;
    this.portalMix = 0;
    this.deviceProfile = 'desktop';
    this.vortexParticles = [];
    this.shockwaves = [];

    // WebGL Buffers & Counts
    this.gl = null;
    this.glProgram = null;
    this.glColorBuffer = null;
    this.glColorsArray = null;
    this.glTotalPoints = 0;
    this.ptsPerCluster = 0;
    this.uProjViewLoc = null;
    this.uTimeLoc = null;
    this.uPortalNDCLoc = null;
    this.uPortalMixLoc = null;

    // 360° Spherical Orbit State (Yaw, Pitch, Distance around camTargetLook)
    this.currentStageIdx = -1;
    this.stageTimer = 0;
    this.autoPlay = true;
    this.clusterActivatedAt = {};
    this.hoveredStarIdx = null;
    this.pressedCard = null;
    this.pressedStarIdx = null;
    this.lastFrameTime = 0;

    this.orbitYaw = 0;
    this.orbitPitch = 0.05;
    this.orbitDist = 54;
    this.targetYaw = 0;
    this.targetPitch = 0.05;
    this.targetDist = 54;
    this.camTargetLook = { x: 0, y: 0, z: 0 };

    // Pointer / Touch Drag & Pinch State
    this.isDragging = false;
    this.dragMovedPx = 0;
    this.lastPointerX = 0;
    this.lastPointerY = 0;
    this.lastPinchDist = 0;
    this.mouseNDC = { x: 0, y: 0 };
    this.mouseX = -999;
    this.mouseY = -999;

    // Spider 3D
    this.spiderPos3D = { x: -18, y: 11, z: 6 };
    this.spiderTarget3D = { x: -18, y: 11, z: 6 };
    this.spiderTrail = [];
    for (let i = 0; i < 24; i++) {
      this.spiderTrail.push({ x: -18, y: 11, z: 6 });
    }

    // Harvested External Links Map (din DOM-ul real al paginii)
    this.harvestedLinks = {};
    this.portfolioFilter = 'all';
    this.hudCollapsed = false;
    this.warpBoost = 0;
    this.restoreDomTriggered = false;
    this.restoreJumpSelector = null;
    this.restoreShockwaves = [];
    this.restoreCardsSnapshot = [];
    this.restoreStarsSnapshot = [];
    this.restoreSpiderSnapshot = null;
    this.restoreDomBlocks = [];
    this.restoreEmergeEls = [];
    this.activeDockCards = [];

    this.projectedCards = [];
    this.hoveredCard = null;
    this.selectedCard = null;
    this.logs = [];
    this.lastLogTick = 0;
    this.displayedScore = 0;
    this.panelCtxs = {};
    this.dom = {};

    this.onResize = this.onResize.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.loop = this.loop.bind(this);
  }

  init() {
    this.harvestDOMLinks();
    this.injectAtomicButton();
    this.buildMasterDOM();
    this.observeParentLang();
    this.registerTerminalCommand();

    window.addEventListener('resize', this.onResize, { passive: true });
    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
    window.addEventListener('mouseup', this.onMouseUp, { passive: true });
    window.addEventListener('keydown', this.onKeyDown);
  }

  /**
   * Actualizează în timp real coordonatele sub-pixel ale butonului #swarmAtomicBtn pe orice rezoluție.
   */
  syncAtomicOrigin() {
    const btn = this.dom.atomicBtn || document.getElementById('swarmAtomicBtn');
    if (btn) {
      const rect = btn.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        this.originX = rect.left + rect.width * 0.5;
        this.originY = rect.top + rect.height * 0.5;
      }
    }
  }

  /**
   * Clasifică determinist profilul dispozitivului: 'phone' | 'tablet' | 'desktop' | 'ultrawide'.
   */
  getDeviceProfile() {
    const w = window.innerWidth;
    const h = Math.max(1, window.innerHeight);
    if (w < 768) return 'phone';
    if (w < 1100) return 'tablet';
    if (w >= 1920 || w / h > 2.05) return 'ultrawide';
    return 'desktop';
  }

  /**
   * Execută acțiunea primară a unui card (deschidere link extern Live/GitHub, Studiu de Caz sau Formular Contact).
   */
  triggerCardPrimaryAction(c) {
    if (!c) return false;
    if (c.primaryUrl) {
      this.openExternalUrl(c.primaryUrl);
      return true;
    }
    if (c.projectKey) {
      this.openCaseStudyDrawer(c.projectKey, c);
      return true;
    }
    if (c.matchKey === 'contact_form') {
      this.openContactDrawer();
      return true;
    }
    return false;
  }

  /**
   * Deschide în siguranță o adresă URL externă sau de protocol (inclusiv pe iOS Safari / Android Chrome în touchend).
   */
  openExternalUrl(url) {
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    if (!url.startsWith('mailto:') && !url.startsWith('tel:')) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    a.className = 'is-hidden';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  /**
   * Detectează dacă utilizatorul accesează site-ul de pe un dispozitiv mobil / tabletă
   * pentru afișarea condiționată a avertismentului despre baterie („prăjitor de pâine”).
   */
  isMobileDevice() {
    const ua = navigator.userAgent || '';
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isSmallScreen = window.innerWidth <= 900;
    return isMobileUA || (isTouch && isSmallScreen);
  }

  getModalDescription() {
    const t = UI_TEXT[this.lang];
    return this.isMobileDevice() ? `${t.modalDescBase}${t.modalDescMobile}` : t.modalDescBase;
  }

  /**
   * Scanează cardurile reale din #projects și #contact din index.html
   * și copiază exact adresele URL (Live Demo, GitHub, WhatsApp, Email, Telefon, CV PDF)
   * folosind atributul determinist data-project="proj1..proj5".
   */
  harvestDOMLinks() {
    this.harvestedLinks = {
      whatsapp: { live: 'https://wa.me/40720955119', github: null },
      phone: { live: 'tel:+40720955119', github: null },
      email: { live: 'mailto:contact@tiberiumilitaru.ro', github: null },
      cv_pdf: { live: '/CV-Militaru-Tiberiu.pdf', github: null },
      linkedin: {
        live: 'https://www.linkedin.com/in/tiberiu-militaru-nicolae89',
        github: 'https://github.com/tiberiumilitaru89'
      },
      github: { live: null, github: 'https://github.com/tiberiumilitaru89' },
      proj3: {
        live: 'https://instalbloc.ro',
        github: 'https://github.com/tiberiumilitaru89/instalbloc'
      },
      proj4: {
        live: 'https://viziuneurbanaploiesti.ro',
        github: 'https://github.com/tiberiumilitaru89/viziune-urbana-ploiesti'
      },
      proj1: {
        live: 'https://cvsmartats.web.app/',
        github: 'https://github.com/tiberiumilitaru89/cv-builder-ats'
      },
      proj2: {
        live: null,
        github: null,
        isPrivate: true
      },
      proj5: {
        live: 'https://tiberiumilitaru.ro',
        github: 'https://github.com/tiberiumilitaru89/portofoliu-tiberiu'
      }
    };

    const projectSection = document.getElementById('projects');
    if (projectSection) {
      const cards = projectSection.querySelectorAll('.project-card[data-project], article[data-project]');
      cards.forEach((card) => {
        const projKey = card.getAttribute('data-project');
        if (!projKey || !this.harvestedLinks[projKey]) return;

        let liveUrl = null;
        let githubUrl = null;

        const links = card.querySelectorAll('a[href]');
        links.forEach((a) => {
          const href = a.getAttribute('href') || '';
          const txt = (a.textContent || '').toLowerCase();
          if (!href || href === '#' || href.startsWith('javascript:')) return;

          if (href.includes('github.com') || txt.includes('github')) {
            githubUrl = href;
          } else if (txt.includes('live') || txt.includes('demo') || href.startsWith('http')) {
            liveUrl = href;
          }
        });

        if (liveUrl || githubUrl) {
          this.harvestedLinks[projKey] = {
            live: liveUrl || this.harvestedLinks[projKey].live || null,
            github: githubUrl || this.harvestedLinks[projKey].github || null,
            isPrivate: Boolean(this.harvestedLinks[projKey].isPrivate && !liveUrl && !githubUrl)
          };
        }
      });
    }

    // Alias-uri de siguranță
    this.harvestedLinks.instalbloc = this.harvestedLinks.proj3;
    this.harvestedLinks.viziune = this.harvestedLinks.proj4;
    this.harvestedLinks['cv builder'] = this.harvestedLinks.proj1;
    this.harvestedLinks['florărie'] = this.harvestedLinks.proj2;
    this.harvestedLinks['portofoliu tiberiu'] = this.harvestedLinks.proj5;
  }

  detectLanguage() {
    const langSpan = document.getElementById('langCurrentText');
    if (langSpan && langSpan.textContent) {
      return langSpan.textContent.trim().toLowerCase() === 'en' ? 'en' : 'ro';
    }
    const htmlLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    return htmlLang.startsWith('en') ? 'en' : 'ro';
  }

  observeParentLang() {
    const langSpan = document.getElementById('langCurrentText');
    if (!langSpan) return;
    const obs = new MutationObserver(() => {
      const detected = this.detectLanguage();
      if (detected !== this.lang) {
        this.setLanguage(detected, false);
      }
    });
    obs.observe(langSpan, { childList: true, characterData: true, subtree: true });
  }

  setLanguage(nextLang, syncParent = true) {
    this.lang = nextLang === 'en' ? 'en' : 'ro';
    const t = UI_TEXT[this.lang];

    if (syncParent) {
      const currentParentLang = this.detectLanguage();
      if (currentParentLang !== this.lang) {
        const parentLangBtn = document.getElementById('langToggleBtn');
        if (parentLangBtn) parentLangBtn.click();
      }
    }

    if (this.dom.atomicBtn) {
      this.dom.atomicBtn.setAttribute('title', t.btnTitle);
      this.dom.atomicBtn.setAttribute('aria-label', t.btnTitle);
    }
    if (this.dom.modalTag) this.dom.modalTag.textContent = t.modalTag;
    if (this.dom.modalTitle) this.dom.modalTitle.textContent = t.modalTitle;
    if (this.dom.modalDesc) this.dom.modalDesc.textContent = this.getModalDescription();
    if (this.dom.btnCancel) this.dom.btnCancel.textContent = t.btnCancel;
    if (this.dom.btnConfirm) this.dom.btnConfirm.textContent = t.btnConfirm;
    if (this.dom.langBtn) {
      this.dom.langBtn.textContent = this.lang === 'ro' ? 'RO ▸ EN' : 'EN ▸ RO';
    }
    if (this.dom.exitBtn) this.dom.exitBtn.textContent = t.exitBtn;
    if (this.dom.bHint) this.dom.bHint.textContent = t.controlsHint;

    if (this.dom.tabBtns) {
      SWARM_CLUSTERS.forEach((c, idx) => {
        this.dom.tabBtns[idx].textContent = c[this.lang].tab;
      });
    }

    if (this.state === 'SWARM_LIVE') {
      this.updateStageBanner();
      this.updateCardDock();
      if (this.selectedCard) {
        const cluster = SWARM_CLUSTERS[this.selectedCard.clusterIdx];
        if (cluster) {
          const nodeIdx = Number(this.selectedCard.id.split('-').pop()) || 0;
          const updatedNode = cluster[this.lang].nodes[nodeIdx];
          if (updatedNode) {
            this.selectedCard.label = updatedNode.label;
            this.selectedCard.desc = updatedNode.desc || '';
            this.selectedCard.tags = updatedNode.tags || [];
            this.selectedCard.clusterTitle = cluster[this.lang].title;
            this.openInspectorForCard(this.selectedCard);
          }
        }
      }
    }
  }

  createAtomicSVG() {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 36 36');
    svg.setAttribute('class', 'swarm-atomic-svg');
    svg.setAttribute('aria-hidden', 'true');

    ['swarm-orbit swarm-orbit-1', 'swarm-orbit swarm-orbit-2', 'swarm-orbit swarm-orbit-3'].forEach(
      (cls) => {
        const el = document.createElementNS(ns, 'ellipse');
        el.setAttribute('cx', '18');
        el.setAttribute('cy', '18');
        el.setAttribute('rx', '15');
        el.setAttribute('ry', '5.5');
        el.setAttribute('class', cls);
        svg.appendChild(el);
      }
    );

    const core = document.createElementNS(ns, 'circle');
    core.setAttribute('cx', '18');
    core.setAttribute('cy', '18');
    core.setAttribute('r', '3.2');
    core.setAttribute('class', 'swarm-core');
    svg.appendChild(core);

    return svg;
  }

  injectAtomicButton() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'swarmAtomicBtn';
    btn.className = 'swarm-atomic-btn';
    btn.setAttribute('title', UI_TEXT[this.lang].btnTitle);
    btn.setAttribute('aria-label', UI_TEXT[this.lang].btnTitle);

    const badge = document.createElement('span');
    badge.className = 'swarm-atomic-badge';
    badge.textContent = '3D';

    btn.append(this.createAtomicSVG(), badge);
    btn.addEventListener('click', () => this.openBatteryWarning());
    this.dom.atomicBtn = btn;

    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn && themeBtn.parentNode) {
      themeBtn.parentNode.insertBefore(btn, themeBtn);
      return;
    }

    const navControls = document.querySelector('.nav-controls');
    if (navControls) {
      navControls.prepend(btn);
      return;
    }

    document.body.appendChild(btn);
  }

  buildMasterDOM() {
    const t = UI_TEXT[this.lang];

    const root = document.createElement('div');
    root.className = 'swarm-root';

    const webglCanvas = document.createElement('canvas');
    webglCanvas.className = 'swarm-webgl-canvas';

    const hudCanvas = document.createElement('canvas');
    hudCanvas.className = 'swarm-hud-canvas';
    hudCanvas.addEventListener('mousedown', this.onMouseDown);
    hudCanvas.addEventListener('wheel', this.onWheel, { passive: false });
    hudCanvas.addEventListener('touchstart', this.onTouchStart, { passive: false });
    hudCanvas.addEventListener('touchmove', this.onTouchMove, { passive: false });
    hudCanvas.addEventListener('touchend', this.onTouchEnd, { passive: true });

    // --- 1. MODALUL DE BATERIE / GPU ---
    const backdrop = document.createElement('div');
    backdrop.className = 'swarm-modal-backdrop';

    const modal = document.createElement('div');
    modal.className = 'swarm-modal';

    const mHead = document.createElement('div');
    mHead.className = 'swarm-modal-header';

    const mTag = document.createElement('span');
    mTag.className = 'swarm-modal-tag';
    mTag.textContent = t.modalTag;

    const mCode = document.createElement('span');
    mCode.className = 'swarm-modal-code';
    mCode.textContent = t.modalCode;
    mHead.append(mTag, mCode);

    const mTitle = document.createElement('h2');
    mTitle.className = 'swarm-modal-title';
    mTitle.textContent = t.modalTitle;

    const mDesc = document.createElement('p');
    mDesc.className = 'swarm-modal-desc';
    mDesc.textContent = this.getModalDescription();

    const telemetryBox = document.createElement('div');
    telemetryBox.className = 'swarm-telemetry-box';
    telemetryBox.textContent = 'Scanning GPU & Battery telemetry...';

    const mActions = document.createElement('div');
    mActions.className = 'swarm-modal-actions';

    const btnCancel = document.createElement('button');
    btnCancel.type = 'button';
    btnCancel.className = 'swarm-btn';
    btnCancel.textContent = t.btnCancel;
    btnCancel.addEventListener('click', () => this.closeBatteryWarning());

    const btnConfirm = document.createElement('button');
    btnConfirm.type = 'button';
    btnConfirm.className = 'swarm-btn swarm-btn-danger';
    btnConfirm.textContent = t.btnConfirm;
    btnConfirm.addEventListener('click', () => this.triggerSingularity());

    mActions.append(btnCancel, btnConfirm);
    modal.append(mHead, mTitle, mDesc, telemetryBox, mActions);
    backdrop.appendChild(modal);

    // --- 2. TOP HEADER STACK ---
    const headerStack = document.createElement('div');
    headerStack.className = 'swarm-header-stack';

    const strip = document.createElement('div');
    strip.className = 'swarm-metrics-strip';

    const mLeft = document.createElement('div');
    mLeft.className = 'swarm-metrics-left';

    const brand = document.createElement('span');
    brand.className = 'swarm-hud-brand';
    brand.textContent = 'SWARM prompt-crawler';
    mLeft.appendChild(brand);

    const addMetric = (label, initVal) => {
      const wrap = document.createElement('span');
      wrap.textContent = label;
      const val = document.createElement('span');
      val.className = 'swarm-metric-val';
      val.textContent = initVal;
      wrap.appendChild(val);
      mLeft.appendChild(wrap);
      return val;
    };

    this.dom.mLegs = addMetric('LEGS', '16');
    this.dom.mTent = addMetric('TENTACLES', '22');
    this.dom.mWords = addMetric('WORDS READ', '0/181');
    this.dom.mLinks = addMetric('LINKS', '0');
    this.dom.mFlags = addMetric('FLAGS', '0');
    this.dom.mTime = addMetric('T', '0.00');
    this.dom.mFrame = addMetric('FRAME', '0000');

    const mRight = document.createElement('div');
    mRight.className = 'swarm-metrics-right';

    const cvBtn = document.createElement('a');
    cvBtn.className = 'swarm-hud-btn swarm-hud-btn-cv';
    cvBtn.href = '/CV-Militaru-Tiberiu.pdf';
    cvBtn.target = '_blank';
    cvBtn.rel = 'noopener noreferrer';
    cvBtn.textContent = '📄 CV PDF';

    const cliBtn = document.createElement('button');
    cliBtn.type = 'button';
    cliBtn.className = 'swarm-hud-btn swarm-hud-btn-cli';
    cliBtn.textContent = '>_ TERMINAL';
    cliBtn.addEventListener('click', () => this.openCliDrawer());

    const muteBtn = document.createElement('button');
    muteBtn.type = 'button';
    muteBtn.className = 'swarm-hud-btn';
    muteBtn.textContent = 'AUDIO: ON';
    muteBtn.addEventListener('click', () => {
      const muted = this.audio.toggleMute();
      muteBtn.textContent = muted ? 'AUDIO: MUTED' : 'AUDIO: ON';
    });

    const autoBtn = document.createElement('button');
    autoBtn.type = 'button';
    autoBtn.className = 'swarm-hud-btn';
    autoBtn.textContent = 'MODE: AUTO-CRAWL';
    autoBtn.addEventListener('click', () => {
      this.autoPlay = !this.autoPlay;
      autoBtn.textContent = this.autoPlay ? 'MODE: AUTO-CRAWL' : 'MODE: FREE ROAM';
    });

    const langBtn = document.createElement('button');
    langBtn.type = 'button';
    langBtn.className = 'swarm-hud-btn';
    langBtn.textContent = this.lang === 'ro' ? 'RO ▸ EN' : 'EN ▸ RO';
    langBtn.addEventListener('click', () => {
      this.setLanguage(this.lang === 'ro' ? 'en' : 'ro', true);
    });

    const exitBtn = document.createElement('button');
    exitBtn.type = 'button';
    exitBtn.className = 'swarm-hud-btn swarm-hud-btn-exit';
    exitBtn.textContent = t.exitBtn;
    exitBtn.addEventListener('click', () => this.restoreReality());

    mRight.append(cvBtn, cliBtn, muteBtn, autoBtn, langBtn, exitBtn);
    strip.append(mLeft, mRight);

    const tabsBar = document.createElement('div');
    tabsBar.className = 'swarm-tabs-bar';
    this.dom.tabBtns = [];

    SWARM_CLUSTERS.forEach((c, idx) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'swarm-tab-btn';
      b.textContent = c[this.lang].tab;
      b.addEventListener('click', () => {
        this.autoPlay = false;
        autoBtn.textContent = 'MODE: FREE ROAM';
        this.setStage(idx);
      });
      tabsBar.appendChild(b);
      this.dom.tabBtns.push(b);
    });

    const shipTab = document.createElement('button');
    shipTab.type = 'button';
    shipTab.className = 'swarm-tab-btn';
    shipTab.textContent = 'ship';
    shipTab.addEventListener('click', () => {
      this.autoPlay = false;
      autoBtn.textContent = 'MODE: FREE ROAM';
      this.setStage(7);
    });
    tabsBar.appendChild(shipTab);
    this.dom.tabBtns.push(shipTab);

    headerStack.append(strip, tabsBar);

    const banner = document.createElement('div');
    banner.className = 'swarm-stage-banner';
    const bTitle = document.createElement('h2');
    bTitle.className = 'swarm-stage-title';
    const bSub = document.createElement('p');
    bSub.className = 'swarm-stage-subtitle';
    const bHint = document.createElement('p');
    bHint.className = 'swarm-stage-controls-hint';
    bHint.textContent = t.controlsHint;

    // Bară de filtrare categorii pentru rubrica 04 Portofoliu
    const filterBar = document.createElement('div');
    filterBar.className = 'swarm-portfolio-filter-bar';
    this.dom.filterPills = [];
    const filterCategories = [
      { id: 'all', label: 'ALL (5)' },
      { id: 'crm', label: 'CRM / B2B' },
      { id: 'civic', label: 'CIVIC TECH' },
      { id: 'saas', label: 'SAAS / AI' },
      { id: 'ecommerce', label: 'E-COMMERCE' }
    ];
    filterCategories.forEach((cat) => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className =
        cat.id === 'all' ? 'swarm-filter-pill is-active' : 'swarm-filter-pill';
      pill.textContent = cat.label;
      pill.addEventListener('click', () => {
        this.portfolioFilter = cat.id;
        this.dom.filterPills.forEach((p) =>
          p.classList.toggle('is-active', p.dataset.cat === cat.id)
        );
        this.audio.playPing('hover');
        this.updateCardDock();
      });
      pill.dataset.cat = cat.id;
      filterBar.appendChild(pill);
      this.dom.filterPills.push(pill);
    });

    banner.append(bTitle, bSub, bHint, filterBar);

    // --- 3. HOLOGRAPHIC NODE INSPECTOR (1:1 CU CARDURILE SITE-ULUI + LINK-URI EXTERNE + STUDII DE CAZ) ---
    const inspector = document.createElement('aside');
    inspector.className = 'swarm-inspector-card';

    const insHead = document.createElement('div');
    insHead.className = 'swarm-inspector-head';

    const insKind = document.createElement('span');
    insKind.className = 'swarm-inspector-kind';

    const insClose = document.createElement('button');
    insClose.type = 'button';
    insClose.className = 'swarm-inspector-close';
    insClose.textContent = '[X]';
    insClose.addEventListener('click', () => {
      this.selectedCard = null;
      inspector.classList.remove('is-open');
      this.updateCardDock();
    });
    insHead.append(insKind, insClose);

    const insTitle = document.createElement('h3');
    insTitle.className = 'swarm-inspector-title';

    const insDesc = document.createElement('p');
    insDesc.className = 'swarm-inspector-desc';

    const insTags = document.createElement('div');
    insTags.className = 'swarm-inspector-tags';

    const insMeta = document.createElement('p');
    insMeta.className = 'swarm-inspector-meta';

    const insActions = document.createElement('div');
    insActions.className = 'swarm-inspector-actions';

    const insNdaBadge = document.createElement('div');
    insNdaBadge.className = 'swarm-inspector-badge-nda is-hidden';

    const extRow = document.createElement('div');
    extRow.className = 'swarm-inspector-ext-row';

    const insLiveLink = document.createElement('a');
    insLiveLink.className = 'swarm-inspector-link is-hidden';
    insLiveLink.target = '_blank';
    insLiveLink.rel = 'noopener noreferrer';
    insLiveLink.textContent = '↗ LIVE DEMO';

    const insGitLink = document.createElement('a');
    insGitLink.className = 'swarm-inspector-link is-hidden';
    insGitLink.target = '_blank';
    insGitLink.rel = 'noopener noreferrer';
    insGitLink.textContent = '↗ GITHUB';

    extRow.append(insLiveLink, insGitLink);

    const insCaseBtn = document.createElement('button');
    insCaseBtn.type = 'button';
    insCaseBtn.className = 'swarm-inspector-btn-case is-hidden';
    insCaseBtn.addEventListener('click', () => {
      if (this.selectedCard && this.selectedCard.projectKey) {
        this.openCaseStudyDrawer(this.selectedCard.projectKey, this.selectedCard);
      }
    });

    const insExtraBtn = document.createElement('button');
    insExtraBtn.type = 'button';
    insExtraBtn.className = 'swarm-inspector-btn-extra is-hidden';

    const insJump = document.createElement('button');
    insJump.type = 'button';
    insJump.className = 'swarm-inspector-jump';
    insJump.addEventListener('click', () => {
      if (this.selectedCard) {
        this.restoreReality(this.selectedCard.targetSelector);
      }
    });

    insActions.append(insNdaBadge, extRow, insCaseBtn, insExtraBtn, insJump);
    inspector.append(insHead, insTitle, insDesc, insTags, insMeta, insActions);

    // --- 3.5. HOLOGRAPHIC STAR CARD DOCK (CARUSEL ERGONOMIC PC & MOBIL) ---
    const cardDock = document.createElement('nav');
    cardDock.className = 'swarm-card-dock';
    cardDock.setAttribute('aria-label', 'Star Cards Carousel');

    const dockPrev = document.createElement('button');
    dockPrev.type = 'button';
    dockPrev.className = 'swarm-dock-nav-btn';
    dockPrev.textContent = '◀';
    dockPrev.setAttribute('aria-label', 'Previous card');
    dockPrev.addEventListener('click', () => this.cycleDockCard(-1));

    const dockLabel = document.createElement('span');
    dockLabel.className = 'swarm-dock-label';
    dockLabel.textContent = 'CARDS';

    const dockList = document.createElement('div');
    dockList.className = 'swarm-dock-list';

    const dockNext = document.createElement('button');
    dockNext.type = 'button';
    dockNext.className = 'swarm-dock-nav-btn';
    dockNext.textContent = '▶';
    dockNext.setAttribute('aria-label', 'Next card');
    dockNext.addEventListener('click', () => this.cycleDockCard(1));

    cardDock.append(dockPrev, dockLabel, dockList, dockNext);

    // --- 3.8. BUTON TOGGLE TELEMETRIE PE MOBIL ---
    const hudMobileToggle = document.createElement('button');
    hudMobileToggle.type = 'button';
    hudMobileToggle.className = 'swarm-hud-mobile-toggle';
    hudMobileToggle.textContent = '📊 TELEMETRIE ▾';
    hudMobileToggle.addEventListener('click', () => {
      this.hudCollapsed = !this.hudCollapsed;
      bottomHud.classList.toggle('is-collapsed', this.hudCollapsed);
      cardDock.classList.toggle('is-hud-collapsed', this.hudCollapsed);
      inspector.classList.toggle('is-hud-collapsed', this.hudCollapsed);
      hudMobileToggle.textContent = this.hudCollapsed
        ? '📊 TELEMETRIE ▴'
        : '📊 TELEMETRIE ▾';
    });

    // --- 4. BOTTOM 6-PANEL TELEMETRY HUD ---
    const bottomHud = document.createElement('section');
    bottomHud.className = 'swarm-bottom-hud';

    const makePanel = (titleTxt, subTxt) => {
      const p = document.createElement('div');
      p.className = 'swarm-hud-panel';
      const h = document.createElement('div');
      h.className = 'swarm-panel-head';
      const s1 = document.createElement('span');
      s1.textContent = titleTxt;
      const s2 = document.createElement('span');
      s2.className = 'swarm-panel-sub';
      s2.textContent = subTxt;
      h.append(s1, s2);
      p.appendChild(h);
      bottomHud.appendChild(p);
      return { panel: p, sub: s2 };
    };

    const pLog = makePanel('CRAWL LOG', '0 w/s');
    const logList = document.createElement('div');
    logList.className = 'swarm-log-list';
    const logFoot = document.createElement('div');
    logFoot.className = 'swarm-log-footer';
    logFoot.textContent = 'words · kinds · links';
    pLog.panel.append(logList, logFoot);

    const pSec = makePanel('SECTIONS', '7');
    const cSec = this.createPanelCanvas(pSec.panel);

    const pRad = makePanel('COVERAGE RADAR', 'live');
    const cRad = this.createPanelCanvas(pRad.panel);

    const pHeat = makePanel('WORD HEAT', '181');
    const cHeat = this.createPanelCanvas(pHeat.panel);

    const pScore = makePanel('SPEC SCORE', 'live');
    const cScore = this.createPanelCanvas(pScore.panel);

    const pCode = makePanel('GATEKEEPER_TS', 'live');
    const codeBox = document.createElement('div');
    codeBox.className = 'swarm-code-box';
    this.dom.codeLines = [];

    GATEKEEPER_CODE_LINES.forEach((lineTxt, idx) => {
      const row = document.createElement('div');
      row.className = idx === 0 ? 'swarm-code-line swarm-code-comment' : 'swarm-code-line';
      row.textContent = lineTxt;
      codeBox.appendChild(row);
      this.dom.codeLines.push(row);
    });
    pCode.panel.appendChild(codeBox);

    // --- 5. HOLOGRAPHIC DRAWER MODAL (CASE STUDY, CONTACT FORM, CLI TERMINAL) ---
    const drawerBackdrop = document.createElement('div');
    drawerBackdrop.className = 'swarm-drawer-backdrop';
    drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === drawerBackdrop) this.closeDrawerModal();
    });

    const drawerModal = document.createElement('div');
    drawerModal.className = 'swarm-drawer-modal';

    const drawerHead = document.createElement('div');
    drawerHead.className = 'swarm-drawer-head';

    const drawerBadge = document.createElement('span');
    drawerBadge.className = 'swarm-drawer-badge';

    const drawerClose = document.createElement('button');
    drawerClose.type = 'button';
    drawerClose.className = 'swarm-drawer-close';
    drawerClose.textContent = '✕ ESC';
    drawerClose.addEventListener('click', () => this.closeDrawerModal());

    drawerHead.append(drawerBadge, drawerClose);

    const drawerBody = document.createElement('div');
    drawerBody.className = 'swarm-drawer-body';

    drawerModal.append(drawerHead, drawerBody);
    drawerBackdrop.appendChild(drawerModal);

    root.append(
      webglCanvas,
      hudCanvas,
      headerStack,
      banner,
      inspector,
      cardDock,
      hudMobileToggle,
      bottomHud,
      backdrop,
      drawerBackdrop
    );
    document.body.appendChild(root);

    Object.assign(this.dom, {
      root,
      webglCanvas,
      hudCanvas,
      ctx2d: hudCanvas.getContext('2d'),
      backdrop,
      modalTag: mTag,
      modalTitle: mTitle,
      modalDesc: mDesc,
      telemetryBox,
      btnCancel,
      btnConfirm,
      headerStack,
      autoBtn,
      langBtn,
      exitBtn,
      banner,
      bTitle,
      bSub,
      bHint,
      filterBar,
      inspector,
      insKind,
      insTitle,
      insDesc,
      insTags,
      insMeta,
      insNdaBadge,
      insLiveLink,
      insGitLink,
      insCaseBtn,
      insExtraBtn,
      insJump,
      cardDock,
      dockLabel,
      dockList,
      hudMobileToggle,
      bottomHud,
      logRate: pLog.sub,
      logList,
      drawerBackdrop,
      drawerBadge,
      drawerBody,
      panelCanvases: { sections: cSec, radar: cRad, heat: cHeat, score: cScore }
    });

    this.onResize();
  }

  closeDrawerModal() {
    if (this.dom.drawerBackdrop) {
      this.dom.drawerBackdrop.classList.remove('is-open');
    }
  }

  /**
   * Deschide Studiul de Caz Tehnic („Detalii Tehnice”) direct în universul 3D.
   */
  openCaseStudyDrawer(projectKey, card) {
    const langData = CASE_STUDIES_DATA[this.lang] || CASE_STUDIES_DATA.ro;
    const study = langData[projectKey];
    if (!study) return;

    this.audio.playPing('stage');
    const isRo = this.lang === 'ro';
    this.dom.drawerBadge.textContent = `CASE STUDY · ${study.badge.toUpperCase()}`;

    const frag = document.createDocumentFragment();

    const title = document.createElement('h3');
    title.className = 'swarm-drawer-title';
    title.textContent = study.title;
    frag.appendChild(title);

    const makeSec = (lbl, txt) => {
      const s = document.createElement('div');
      s.className = 'swarm-drawer-section';
      const h = document.createElement('div');
      h.className = 'swarm-drawer-sec-label';
      h.textContent = lbl;
      const p = document.createElement('p');
      p.className = 'swarm-drawer-sec-text';
      p.textContent = txt;
      s.append(h, p);
      return s;
    };

    frag.appendChild(
      makeSec(isRo ? '01 · PROVOCAREA DE BUSINESS' : '01 · BUSINESS CHALLENGE', study.challenge)
    );
    frag.appendChild(
      makeSec(
        isRo ? '02 · ARHITECTURA & SOLUȚIA TEHNICĂ' : '02 · TECHNICAL ARCHITECTURE',
        study.architecture
      )
    );

    const resSec = document.createElement('div');
    resSec.className = 'swarm-drawer-section';
    const resLbl = document.createElement('div');
    resLbl.className = 'swarm-drawer-sec-label';
    resLbl.textContent = isRo ? '03 · REZULTATE & IMPACT' : '03 · KEY RESULTS & IMPACT';
    const ul = document.createElement('ul');
    ul.className = 'swarm-drawer-list';
    study.results.forEach((rTxt) => {
      const li = document.createElement('li');
      li.textContent = rTxt;
      ul.appendChild(li);
    });
    resSec.append(resLbl, ul);
    frag.appendChild(resSec);

    const stSec = document.createElement('div');
    stSec.className = 'swarm-drawer-section';
    const stLbl = document.createElement('div');
    stLbl.className = 'swarm-drawer-sec-label';
    stLbl.textContent = '04 · TECH STACK';
    const tagsWrap = document.createElement('div');
    tagsWrap.className = 'swarm-inspector-tags';
    study.stack.forEach((stTxt) => {
      const sp = document.createElement('span');
      sp.className = 'swarm-inspector-tag';
      sp.textContent = stTxt;
      tagsWrap.appendChild(sp);
    });
    stSec.append(stLbl, tagsWrap);
    frag.appendChild(stSec);

    const urls = this.harvestedLinks[projectKey];
    const ctaRow = document.createElement('div');
    ctaRow.className = 'swarm-inspector-ext-row';

    if (urls && urls.live) {
      const aLive = document.createElement('a');
      aLive.className = 'swarm-inspector-link';
      aLive.href = urls.live;
      aLive.target = '_blank';
      aLive.rel = 'noopener noreferrer';
      aLive.textContent = isRo ? '↗ DESCHIDE PROIECT LIVE' : '↗ OPEN LIVE PROJECT';
      ctaRow.appendChild(aLive);
    }
    if (urls && urls.github) {
      const aGit = document.createElement('a');
      aGit.className = 'swarm-inspector-link';
      aGit.href = urls.github;
      aGit.target = '_blank';
      aGit.rel = 'noopener noreferrer';
      aGit.textContent = '↗ GITHUB REPO';
      ctaRow.appendChild(aGit);
    }

    const askBtn = document.createElement('button');
    askBtn.type = 'button';
    askBtn.className = 'swarm-inspector-btn-extra';
    askBtn.textContent = isRo
      ? '✉ ÎNTREABĂ DESPRE ACEST PROIECT'
      : '✉ INQUIRE ABOUT THIS PROJECT';
    askBtn.addEventListener('click', () => {
      this.openContactDrawer(card ? card.label : study.title);
    });

    frag.append(ctaRow, askBtn);
    this.dom.drawerBody.replaceChildren(frag);
    this.dom.drawerBackdrop.classList.add('is-open');
  }

  /**
   * Deschide Formularul de Contact Direct conectat la /api/contact fără a părăsi universul 3D.
   */
  openContactDrawer(prefillSubject = '') {
    this.audio.playPing('stage');
    const isRo = this.lang === 'ro';
    this.dom.drawerBadge.textContent = isRo
      ? 'TRANSMISIE DIRECTĂ · /API/CONTACT'
      : 'DIRECT TRANSMISSION · /API/CONTACT';

    const frag = document.createDocumentFragment();

    const title = document.createElement('h3');
    title.className = 'swarm-drawer-title';
    title.textContent = isRo
      ? 'Trimite un mesaj direct în Inbox'
      : 'Send a Direct Message to Inbox';
    frag.appendChild(title);

    const form = document.createElement('form');
    form.className = 'swarm-contact-form';

    const makeField = (lblTxt, tag, type, name, placeholder, val = '') => {
      const wrap = document.createElement('div');
      wrap.className = 'swarm-form-field';
      const lbl = document.createElement('label');
      lbl.className = 'swarm-form-label';
      lbl.textContent = lblTxt;
      const input = document.createElement(tag);
      if (tag === 'input') {
        input.type = type;
        input.className = 'swarm-form-input';
      } else {
        input.className = 'swarm-form-textarea';
      }
      input.name = name;
      input.required = true;
      input.placeholder = placeholder;
      if (val) input.value = val;
      wrap.append(lbl, input);
      return { wrap, input };
    };

    const fName = makeField(
      isRo ? 'NUME COMPLET' : 'FULL NAME',
      'input',
      'text',
      'name',
      isRo ? 'Ex: Alexandru Popescu' : 'e.g. Alex Smith'
    );
    const fEmail = makeField(
      'EMAIL',
      'input',
      'email',
      'email',
      'alex@companie.ro'
    );
    const defaultMsg = prefillSubject
      ? isRo
        ? `Salut Tiberiu, sunt interesat de un proiect similar cu „${prefillSubject}”. `
        : `Hi Tiberiu, I am interested in a project similar to "${prefillSubject}". `
      : '';
    const fMsg = makeField(
      isRo ? 'DETALII PROIECT / MESAJ' : 'PROJECT DETAILS / MESSAGE',
      'textarea',
      'text',
      'message',
      isRo
        ? 'Descrie pe scurt obiectivul tehnic, termenul sau întrebarea ta...'
        : 'Briefly describe your technical goal, timeline, or question...',
      defaultMsg
    );

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'swarm-form-submit';
    submitBtn.textContent = isRo ? '🚀 TRIMITE MESAJUL ACUM' : '🚀 SEND MESSAGE NOW';

    const statusBox = document.createElement('div');
    statusBox.className = 'swarm-form-status';

    form.append(fName.wrap, fEmail.wrap, fMsg.wrap, submitBtn, statusBox);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        name: fName.input.value.trim(),
        email: fEmail.input.value.trim(),
        subject: prefillSubject || 'Mesaj din 3D Swarm Engine',
        message: fMsg.input.value.trim()
      };
      if (!payload.name || !payload.email || !payload.message) return;

      submitBtn.disabled = true;
      submitBtn.textContent = isRo ? 'SE TRANSMITE...' : 'TRANSMITTING...';
      statusBox.className = 'swarm-form-status';
      statusBox.textContent = '';

      try {
        const ctrl = new AbortController();
        const tId = setTimeout(() => ctrl.abort(), 9000);
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: ctrl.signal
        });
        clearTimeout(tId);

        if (res.ok) {
          statusBox.className = 'swarm-form-status is-ok';
          statusBox.textContent = isRo
            ? '✓ Mesaj transmis cu succes! Tiberiu îți va răspunde în maximum 24h.'
            : '✓ Message transmitted successfully! Tiberiu will reply within 24h.';
          form.reset();
          this.pushLog('link', 'contact · sent 200 OK');
        } else {
          throw new Error('HTTP_ERR');
        }
      } catch (_err) {
        statusBox.className = 'swarm-form-status is-err';
        statusBox.textContent = isRo
          ? '⚠ Serverul local nu răspunde. Deschidem clientul de email direct...'
          : '⚠ Local API unreachable. Opening direct email client...';
        const mailto = `mailto:contact@tiberiumilitaru.ro?subject=${encodeURIComponent(
          payload.subject
        )}&body=${encodeURIComponent(
          `${payload.name} (${payload.email}):\n\n${payload.message}`
        )}`;
        this.openExternalUrl(mailto);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = isRo ? '🚀 TRIMITE MESAJUL ACUM' : '🚀 SEND MESSAGE NOW';
      }
    });

    frag.appendChild(form);
    this.dom.drawerBody.replaceChildren(frag);
    this.dom.drawerBackdrop.classList.add('is-open');
  }

  /**
   * Deschide Terminalul Interactiv CLI direct în universul 3D.
   */
  openCliDrawer() {
    this.audio.playPing('stage');
    const isRo = this.lang === 'ro';
    this.dom.drawerBadge.textContent = 'TIBERIU_OS · INTERACTIVE 3D TERMINAL';

    const frag = document.createDocumentFragment();
    const out = document.createElement('div');
    out.className = 'swarm-cli-output';

    const appendLine = (txt, cls = '') => {
      const row = document.createElement('div');
      if (cls) row.className = cls;
      row.textContent = txt;
      out.appendChild(row);
      out.scrollTop = out.scrollHeight;
    };

    appendLine(
      isRo
        ? 'TiberiuOS v4.2 (3D Swarm Kernel) — Tastează "help" pentru lista de comenzi.'
        : 'TiberiuOS v4.2 (3D Swarm Kernel) — Type "help" for available commands.',
      'swarm-cli-res'
    );

    const form = document.createElement('form');
    form.className = 'swarm-cli-input-row';

    const promptSpan = document.createElement('span');
    promptSpan.className = 'swarm-cli-prompt';
    promptSpan.textContent = 'tiberiu@swarm:~$';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'swarm-cli-input';
    input.placeholder = 'help | projects | open instalbloc | open viziune | open cv | contact | exit';

    form.append(promptSpan, input);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const raw = input.value.trim();
      if (!raw) return;
      input.value = '';
      appendLine(`tiberiu@swarm:~$ ${raw}`, 'swarm-cli-cmd');

      const cmd = raw.toLowerCase();
      if (cmd === 'help') {
        appendLine(
          'Commands: projects, skills, contact, cv, open instalbloc, open viziune, open cvbuilder, stage 1..7, clear, exit',
          'swarm-cli-res'
        );
      } else if (cmd === 'clear') {
        out.replaceChildren();
      } else if (cmd === 'projects') {
        appendLine('1. InstalBloc (https://instalbloc.ro)', 'swarm-cli-res');
        appendLine('2. Viziune Urbană Ploiești (https://viziuneurbanaploiesti.ro)', 'swarm-cli-res');
        appendLine('3. CV Builder Pro ATS (https://cvsmartats.web.app/)', 'swarm-cli-res');
        appendLine('4. Florărie E-Commerce (Private NDA)', 'swarm-cli-res');
        appendLine('5. Portofoliu Tiberiu (https://tiberiumilitaru.ro)', 'swarm-cli-res');
        this.switchToManualRoam();
        this.setStage(3);
      } else if (cmd === 'skills') {
        appendLine(
          'Stack: HTML5, CSS3, JavaScript (ES6+), React, Node.js, Python, SQL, Git, Linux/Networking, Zero-Trust CSP',
          'swarm-cli-res'
        );
        this.switchToManualRoam();
        this.setStage(4);
      } else if (cmd === 'contact') {
        this.openContactDrawer();
      } else if (cmd === 'cv' || cmd === 'open cv') {
        appendLine('Opening /CV-Militaru-Tiberiu.pdf ...', 'swarm-cli-res');
        this.openExternalUrl('/CV-Militaru-Tiberiu.pdf');
      } else if (cmd.includes('instalbloc')) {
        appendLine('Launching https://instalbloc.ro ...', 'swarm-cli-res');
        this.openExternalUrl('https://instalbloc.ro');
      } else if (cmd.includes('viziune')) {
        appendLine('Launching https://viziuneurbanaploiesti.ro ...', 'swarm-cli-res');
        this.openExternalUrl('https://viziuneurbanaploiesti.ro');
      } else if (cmd.includes('cvbuilder')) {
        appendLine('Launching https://cvsmartats.web.app/ ...', 'swarm-cli-res');
        this.openExternalUrl('https://cvsmartats.web.app/');
      } else if (cmd.startsWith('stage ')) {
        const n = parseInt(cmd.replace('stage ', ''), 10);
        if (n >= 1 && n <= 7) {
          this.switchToManualRoam();
          this.setStage(n - 1);
          appendLine(`Flying camera to Star 0${n}...`, 'swarm-cli-res');
        }
      } else if (cmd === 'exit') {
        this.closeDrawerModal();
        this.restoreReality();
      } else {
        appendLine(`Unknown command: "${raw}". Type "help".`);
      }
    });

    frag.append(out, form);
    this.dom.drawerBody.replaceChildren(frag);
    this.dom.drawerBackdrop.classList.add('is-open');
    setTimeout(() => input.focus(), 60);
  }

  createPanelCanvas(parent) {
    const c = document.createElement('canvas');
    c.className = 'swarm-panel-canvas';
    parent.appendChild(c);
    return c;
  }

  async updateHardwareTelemetry() {
    const cores = navigator.hardwareConcurrency || 'Unknown';
    const dpr = (window.devicePixelRatio || 1).toFixed(1);
    let batStr = 'AC_POWER / HIGH_DRAW';

    if (typeof navigator.getBattery === 'function') {
      try {
        const b = await navigator.getBattery();
        batStr = `${Math.round(b.level * 100)}% (${b.charging ? 'CHARGING ⚡' : 'DISCHARGING 🔥'})`;
      } catch (_e) {
        batStr = 'PROTECTED';
      }
    }

    this.dom.telemetryBox.textContent =
      `[HW_AUDIT] CPU_CORES: ${cores} | VIEWPORT: ${window.innerWidth}x${window.innerHeight} (@${dpr}x) | ` +
      `BATTERY: ${batStr} | DEEP_SPACE_SHADERS: ACTIVE`;
  }

  openBatteryWarning() {
    if (this.state !== 'IDLE') return;
    this.harvestDOMLinks();
    this.setLanguage(this.detectLanguage(), false);
    this.state = 'MODAL';
    this.dom.root.classList.add('is-active');
    this.dom.backdrop.classList.add('is-visible');
    this.updateHardwareTelemetry();
  }

  closeBatteryWarning() {
    if (this.state !== 'MODAL') return;
    this.dom.backdrop.classList.remove('is-visible');
    this.dom.root.classList.remove('is-active');
    this.state = 'IDLE';
  }

  sampleDOMParticles() {
    this.syncAtomicOrigin();

    const els = Array.from(
      document.querySelectorAll('header, nav, h1, h2, h3, p, a, button, span, .card, section, pre')
    ).filter((el) => {
      if (this.dom.root.contains(el)) return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 4 && rect.height > 4 && rect.bottom > 0 && rect.top < window.innerHeight;
    });

    const palette = ['#00f0ff', '#2dd4bf', '#facc15', '#e2e8f0', '#fb7185', '#38bdf8'];
    const count = window.innerWidth < 768 ? 10000 : 20000;
    this.vortexParticles = [];

    for (let i = 0; i < count; i++) {
      let x = Math.random() * window.innerWidth;
      let y = Math.random() * window.innerHeight;

      if (els.length > 0 && Math.random() < 0.86) {
        const el = els[i % els.length];
        const r = el.getBoundingClientRect();
        x = r.left + Math.random() * r.width;
        y = r.top + Math.random() * r.height;
      }

      const dx = x - this.originX;
      const dy = y - this.originY;
      const homeDist = Math.hypot(dx, dy) || 1;
      const homeAngle = Math.atan2(dy, dx);

      this.vortexParticles.push({
        x,
        y,
        homeX: x,
        homeY: y,
        homeDist,
        homeAngle,
        dist: homeDist,
        angle: homeAngle,
        vortexSpeed: 0.045 + Math.random() * 0.055,
        suction: 0.918 - Math.random() * 0.035,
        size: Math.random() < 0.15 ? 2.1 : 1.2,
        color: palette[i % palette.length]
      });
    }
  }

  triggerSingularity() {
    this.dom.backdrop.classList.remove('is-visible');
    this.sampleDOMParticles();

    window.dispatchEvent(new CustomEvent('swarm:pause-bg'));

    this.audio.playImplosion();
    if (this.dom.atomicBtn) {
      this.dom.atomicBtn.classList.add('is-portal-flare');
    }
    document.body.classList.remove('swarm-restoring');
    document.body.classList.add('swarm-imploding', 'swarm-consumed');

    this.state = 'IMPLODING';
    this.stateStart = performance.now();

    if (!this.rafId) {
      this.rafId = requestAnimationFrame(this.loop);
    }
  }

  /**
   * Construiește într-un singur Vertex Buffer:
   * - Layer 0: Cele 7 Nebuloase Principale
   * - Layer 1: Câmpul Stelar Profund (Deep-Space Starfield 360°)
   * - Layer 2: Cele 5 Galaxii Spirale Îndepărtate (Andromeda, Cygnus, Helios, Centauri, Zenith)
   */
  initNativeWebGL() {
    if (this.gl) return;
    const gl =
      this.dom.webglCanvas.getContext('webgl', { antialias: true, alpha: false }) ||
      this.dom.webglCanvas.getContext('experimental-webgl');
    if (!gl) return;
    this.gl = gl;

    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SRC);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);
    this.glProgram = prog;

    const isMob = window.innerWidth < 768;
    this.ptsPerCluster = isMob ? 2400 : 4800;
    const starCount = isMob ? 3500 : 7000;
    const ptsPerGalaxy = isMob ? 1200 : 2400;

    const clusterTotal = this.ptsPerCluster * SWARM_CLUSTERS.length;
    const galaxyTotal = ptsPerGalaxy * DISTANT_GALAXIES.length;
    this.glTotalPoints = clusterTotal + starCount + galaxyTotal;

    const positions = new Float32Array(this.glTotalPoints * 3);
    this.glColorsArray = new Float32Array(this.glTotalPoints * 3);
    const sizes = new Float32Array(this.glTotalPoints);
    const layers = new Float32Array(this.glTotalPoints);

    let ptr = 0;

    // 1. LAYER 0: Cele 7 Nebuloase Principale
    SWARM_CLUSTERS.forEach((cluster) => {
      for (let i = 0; i < this.ptsPerCluster; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const radius = (Math.random() ** 1.48) * 9.6;

        positions[ptr * 3] = cluster.pos.x + radius * Math.sin(phi) * Math.cos(theta);
        positions[ptr * 3 + 1] = cluster.pos.y + radius * Math.sin(phi) * Math.sin(theta);
        positions[ptr * 3 + 2] = cluster.pos.z + radius * Math.cos(phi);

        this.glColorsArray[ptr * 3] = 0.28;
        this.glColorsArray[ptr * 3 + 1] = 0.33;
        this.glColorsArray[ptr * 3 + 2] = 0.41;

        sizes[ptr] = Math.random() < 0.12 ? 2.4 : 1.15;
        layers[ptr] = 0.0;
        ptr++;
      }
    });

    // 2. LAYER 1: Câmpul Stelar de Mare Adâncime (R = 140 .. 340)
    const starTemperatures = [
      [0.75, 0.88, 1.0], // Albastru-Sirius
      [0.96, 0.98, 1.0], // Alb-Vega
      [1.0, 0.93, 0.76], // Galben-Solar
      [1.0, 0.72, 0.52]  // Portocaliu-Aldebaran
    ];

    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 140 + Math.random() * 195;

      positions[ptr * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[ptr * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[ptr * 3 + 2] = r * Math.cos(phi);

      const stCol = starTemperatures[i % starTemperatures.length];
      const bright = 0.35 + Math.random() * 0.65;
      this.glColorsArray[ptr * 3] = stCol[0] * bright;
      this.glColorsArray[ptr * 3 + 1] = stCol[1] * bright;
      this.glColorsArray[ptr * 3 + 2] = stCol[2] * bright;

      sizes[ptr] = Math.random() < 0.08 ? 2.6 : 1.1;
      layers[ptr] = 1.0;
      ptr++;
    }

    // 3. LAYER 2: Cele 5 Galaxii Spirale Îndepărtate
    DISTANT_GALAXIES.forEach((gal) => {
      const cosX = Math.cos(gal.tiltX);
      const sinX = Math.sin(gal.tiltX);
      const cosZ = Math.cos(gal.tiltZ);
      const sinZ = Math.sin(gal.tiltZ);

      for (let i = 0; i < ptsPerGalaxy; i++) {
        const armIdx = i % gal.arms;
        const t = Math.random() ** 1.35; // mai dens în nucleul galactic
        const r = t * gal.radius;
        const spinAngle = t * 4.8 + (armIdx * 2.0 * Math.PI) / gal.arms;
        const scatter = (1.0 - t * 0.5) * 3.2;

        const lx = Math.cos(spinAngle) * r + (Math.random() - 0.5) * scatter;
        const ly = (Math.random() - 0.5) * (2.4 * (1.0 - t * 0.7));
        const lz = Math.sin(spinAngle) * r + (Math.random() - 0.5) * scatter;

        // Rotirea discului galactic în 3D conform înclinației
        const y1 = ly * cosX - lz * sinX;
        const z1 = ly * sinX + lz * cosX;
        const x2 = lx * cosZ - y1 * sinZ;
        const y2 = lx * sinZ + y1 * cosZ;

        positions[ptr * 3] = gal.pos.x + x2;
        positions[ptr * 3 + 1] = gal.pos.y + y2;
        positions[ptr * 3 + 2] = gal.pos.z + z1;

        // Gradient cromatic: nucleu cald luminos -> brațe spirale exterioare
        const mix = Math.min(1, t * 1.25);
        this.glColorsArray[ptr * 3] = gal.coreRgb[0] * (1 - mix) + gal.armRgb[0] * mix;
        this.glColorsArray[ptr * 3 + 1] = gal.coreRgb[1] * (1 - mix) + gal.armRgb[1] * mix;
        this.glColorsArray[ptr * 3 + 2] = gal.coreRgb[2] * (1 - mix) + gal.armRgb[2] * mix;

        sizes[ptr] = t < 0.18 ? 2.5 : 1.3;
        layers[ptr] = 2.0;
        ptr++;
      }
    });

    const bindAttr = (data, name, size, usage) => {
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, usage);
      const loc = gl.getAttribLocation(prog, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      return buf;
    };

    bindAttr(positions, 'aPos', 3, gl.STATIC_DRAW);
    this.glColorBuffer = bindAttr(this.glColorsArray, 'aColor', 3, gl.DYNAMIC_DRAW);
    bindAttr(sizes, 'aSize', 1, gl.STATIC_DRAW);
    bindAttr(layers, 'aLayer', 1, gl.STATIC_DRAW);

    this.uProjViewLoc = gl.getUniformLocation(prog, 'uProjView');
    this.uTimeLoc = gl.getUniformLocation(prog, 'uTime');
    this.uPortalNDCLoc = gl.getUniformLocation(prog, 'uPortalNDC');
    this.uPortalMixLoc = gl.getUniformLocation(prog, 'uPortalMix');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.clearColor(0.012, 0.016, 0.027, 1.0);
  }

  renderWebGL(now) {
    const gl = this.gl;
    if (!gl) return;

    gl.viewport(0, 0, this.dom.webglCanvas.width, this.dom.webglCanvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);
    const portalNdcX = (this.originX / w) * 2.0 - 1.0;
    const portalNdcY = 1.0 - (this.originY / h) * 2.0;

    gl.useProgram(this.glProgram);
    gl.uniformMatrix4fv(this.uProjViewLoc, false, this.cam.projViewMatrix);
    gl.uniform1f(this.uTimeLoc, now * 0.001);
    if (this.uPortalNDCLoc) {
      gl.uniform2f(this.uPortalNDCLoc, portalNdcX, portalNdcY);
    }
    if (this.uPortalMixLoc) {
      gl.uniform1f(this.uPortalMixLoc, this.portalMix);
    }

    gl.drawArrays(gl.POINTS, 0, this.glTotalPoints);
  }

  updateStageBanner() {
    const t = UI_TEXT[this.lang];
    if (this.currentStageIdx === -1) {
      this.dom.bTitle.textContent = t.swarm00Title;
      this.dom.bSub.textContent = t.swarm00Sub;
    } else if (this.currentStageIdx >= 0 && this.currentStageIdx < SWARM_CLUSTERS.length) {
      const c = SWARM_CLUSTERS[this.currentStageIdx];
      this.dom.bTitle.textContent = c[this.lang].title;
      this.dom.bSub.textContent = c[this.lang].subtitle;
    } else {
      this.dom.bTitle.textContent = t.ship08Title;
      this.dom.bSub.textContent = t.ship08Sub;
    }
  }

  setStage(idx) {
    const now = performance.now();
    this.currentStageIdx = idx;
    this.stageTimer = now;
    this.warpBoost = 1.0;
    this.deviceProfile = this.getDeviceProfile();

    if (idx === -1) {
      this.clusterActivatedAt = {};
      // Activăm pre-vizualizarea discretă a portofoliului și pe Overview pentru acces rapid din dock
      this.clusterActivatedAt[3] = now - 600;
    } else if (idx >= 0 && idx < SWARM_CLUSTERS.length) {
      // Când activăm o stea, declanșăm animația radială de ieșire a cardurilor din nucleul stelei
      this.clusterActivatedAt[idx] = now;
      for (let prev = 0; prev < idx; prev++) {
        if (!this.clusterActivatedAt[prev]) {
          this.clusterActivatedAt[prev] = now - 900;
        }
      }
    } else if (idx === 7) {
      SWARM_CLUSTERS.forEach((_c, cIdx) => {
        if (!this.clusterActivatedAt[cIdx]) {
          this.clusterActivatedAt[cIdx] = now;
        }
      });
    }

    this.audio.playPing('stage');
    this.updateStageBanner();

    if (this.dom.filterBar) {
      this.dom.filterBar.classList.toggle('is-visible', idx === 3 || idx === 7);
    }

    const isPhone = this.deviceProfile === 'phone';
    const isTablet = this.deviceProfile === 'tablet';

    if (idx === -1) {
      this.camTargetLook = { x: 0, y: 0, z: 0 };
      this.targetYaw = 0;
      this.targetPitch = 0.05;
      this.targetDist = isPhone ? 62 : isTablet ? 58 : 54;
      this.spiderTarget3D = { ...SWARM_CLUSTERS[0].pos };
    } else if (idx >= 0 && idx < SWARM_CLUSTERS.length) {
      const c = SWARM_CLUSTERS[idx];
      this.camTargetLook = { x: c.pos.x, y: c.pos.y, z: c.pos.z };
      this.targetYaw = -c.pos.x * 0.008;
      this.targetPitch = c.pos.y * 0.006;
      // La rubrica 04 Portofoliu (idx === 3) calibrăm distanța camerei pe fiecare tip de ecran
      const baseDist = idx === 3 ? 21.5 : 24;
      this.targetDist = isPhone ? baseDist + 4.5 : isTablet ? baseDist + 2.0 : baseDist;
      this.spiderTarget3D = { ...c.pos };
      this.pushLog('walk', `-> ${c[this.lang].tab}`);
    } else {
      this.camTargetLook = { x: 0, y: -1, z: 0 };
      this.targetYaw = 0;
      this.targetPitch = 0.04;
      this.targetDist = isPhone ? 58 : isTablet ? 54 : 50;
      this.spiderTarget3D = { x: 0, y: 0, z: 10 };
      this.pushLog('link', 'ship · 181/181 verified');
    }

    let wordsRead = 0;
    SWARM_CLUSTERS.forEach((c, cIdx) => {
      const lit = idx >= cIdx;
      if (lit) wordsRead += c.wordCount;

      if (this.gl && this.glColorsArray) {
        const col = lit ? c.rgb : [0.28, 0.33, 0.41];
        const start = cIdx * this.ptsPerCluster;
        for (let i = 0; i < this.ptsPerCluster; i++) {
          const p = (start + i) * 3;
          const v = 0.75 + (i % 5) * 0.06;
          this.glColorsArray[p] = col[0] * v;
          this.glColorsArray[p + 1] = col[1] * v;
          this.glColorsArray[p + 2] = col[2] * v;
        }
      }
    });

    if (this.gl && this.glColorBuffer) {
      // Actualizăm doar porțiunea de culori a celor 7 nebuloase (stelele și galaxiile rămân aprinse!)
      const clusterFloats = this.ptsPerCluster * SWARM_CLUSTERS.length * 3;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glColorBuffer);
      this.gl.bufferSubData(
        this.gl.ARRAY_BUFFER,
        0,
        this.glColorsArray.subarray(0, clusterFloats)
      );
    }

    this.dom.tabBtns.forEach((btn, bIdx) => {
      btn.classList.toggle('is-active', bIdx === idx);
      btn.classList.toggle('is-done', bIdx < idx);
    });

    this.dom.mWords.textContent = `${wordsRead}/181`;
    this.dom.mLinks.textContent = `${Math.min(45, Math.max(0, (idx + 1) * 6))}`;
    this.dom.mFlags.textContent = `${Math.min(12, Math.max(0, (idx + 1) * 2))}`;

    this.updateCardDock();
  }

  /**
   * Populează bara-carusel de carduri (`.swarm-card-dock`) pentru steaua activă
   * (sau pentru cele 5 proiecte din Portofoliu când suntem în Overview / Ship),
   * garantând acces 1-tap de pe orice telefon sau desktop fără a depinde doar de țintirea 3D.
   */
  updateCardDock() {
    if (!this.dom.dockList) return;
    const targetClusterIdx =
      this.currentStageIdx >= 0 && this.currentStageIdx < SWARM_CLUSTERS.length
        ? this.currentStageIdx
        : 3;
    const c = SWARM_CLUSTERS[targetClusterIdx];
    const nodes = c[this.lang].nodes;

    this.activeDockCards = [];
    const frag = document.createDocumentFragment();

    nodes.forEach((nd, nIdx) => {
      if (
        targetClusterIdx === 3 &&
        this.portfolioFilter !== 'all' &&
        nd.category &&
        nd.category !== this.portfolioFilter
      ) {
        return;
      }

      const urls =
        nd.matchKey && this.harvestedLinks[nd.matchKey]
          ? this.harvestedLinks[nd.matchKey]
          : null;
      const primaryUrl = urls ? urls.live || urls.github : null;

      const cardObj = {
        id: `${c.id}-${nIdx}`,
        clusterIdx: targetClusterIdx,
        clusterId: c.id,
        clusterTitle: c[this.lang].title,
        clusterColor: c.colorCss,
        targetSelector: c.targetSelector,
        matchKey: nd.matchKey || null,
        projectKey: nd.projectKey || null,
        category: nd.category || null,
        primaryUrl,
        label: nd.label,
        kind: nd.kind,
        desc: nd.desc || '',
        tags: nd.tags || [],
        worldX: c.pos.x + nd.dx,
        worldY: c.pos.y + nd.dy,
        worldZ: c.pos.z + nd.dz
      };
      this.activeDockCards.push(cardObj);

      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'swarm-dock-pill';
      pill.dataset.cardId = cardObj.id;
      if (this.selectedCard && this.selectedCard.id === cardObj.id) {
        pill.classList.add('is-active', 'is-selected');
      }

      const lbl = document.createElement('span');
      lbl.textContent = nd.label;
      pill.appendChild(lbl);

      if (primaryUrl || nd.projectKey || nd.matchKey === 'contact_form') {
        const bdg = document.createElement('span');
        bdg.className = 'swarm-dock-pill-badge';
        bdg.textContent = primaryUrl ? '↗' : nd.projectKey ? '📋' : '✉';
        bdg.addEventListener('click', (ev) => {
          ev.stopPropagation();
          this.switchToManualRoam();
          if (!this.clusterActivatedAt[targetClusterIdx]) {
            this.clusterActivatedAt[targetClusterIdx] = performance.now() - 800;
          }
          this.openInspectorForCard(cardObj);
          this.triggerCardPrimaryAction(cardObj);
        });
        pill.appendChild(bdg);
      }

      pill.addEventListener('click', () => {
        this.switchToManualRoam();
        if (!this.clusterActivatedAt[targetClusterIdx]) {
          this.clusterActivatedAt[targetClusterIdx] = performance.now() - 800;
        }
        const alreadySelected = Boolean(this.selectedCard && this.selectedCard.id === cardObj.id);
        this.openInspectorForCard(cardObj);
        if (alreadySelected) {
          this.triggerCardPrimaryAction(cardObj);
        }
      });

      frag.appendChild(pill);
    });

    this.dom.dockList.replaceChildren(frag);
  }

  cycleDockCard(dir) {
    if (!this.activeDockCards || this.activeDockCards.length === 0) {
      this.updateCardDock();
    }
    if (!this.activeDockCards.length) return;

    this.switchToManualRoam();
    let currIdx = this.selectedCard
      ? this.activeDockCards.findIndex((item) => item.id === this.selectedCard.id)
      : -1;
    if (currIdx === -1) {
      currIdx = dir > 0 ? 0 : this.activeDockCards.length - 1;
    } else {
      currIdx = (currIdx + dir + this.activeDockCards.length) % this.activeDockCards.length;
    }
    const chosen = this.activeDockCards[currIdx];
    if (chosen) {
      if (!this.clusterActivatedAt[chosen.clusterIdx]) {
        this.clusterActivatedAt[chosen.clusterIdx] = performance.now() - 800;
      }
      this.openInspectorForCard(chosen);
    }
  }

  pushLog(action, targetText) {
    const d = new Date();
    const time = `${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    this.logs.push({ time, action, target: targetText });
    if (this.logs.length > 8) this.logs.shift();

    const frag = document.createDocumentFragment();
    this.logs.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'swarm-log-line';

      const sTime = document.createElement('span');
      sTime.className = 'swarm-log-time';
      sTime.textContent = item.time;

      const sAct = document.createElement('span');
      sAct.className = `swarm-log-act-${item.action}`;
      sAct.textContent = item.action;

      const sTrg = document.createElement('span');
      sTrg.className = 'swarm-log-target';
      sTrg.textContent = item.target;

      row.append(sTime, sAct, sTrg);
      frag.appendChild(row);
    });
    this.dom.logList.replaceChildren(frag);
  }

  render2DProjection(now) {
    const ctx = this.dom.ctx2d;
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    // 0.0. Efect Hyper-Warp la zborul camerei între stele
    if (this.warpBoost > 0.02) {
      this.warpBoost *= 0.91;
      const cx = w * 0.5;
      const cy = h * 0.5;
      ctx.save();
      ctx.strokeStyle = `rgba(0, 240, 255, ${this.warpBoost * 0.26})`;
      ctx.lineWidth = 1.15;
      for (let s = 0; s < 28; s++) {
        const ang = (s / 28) * Math.PI * 2 + (s % 3) * 0.19;
        const r1 = 80 + (s % 5) * 45 + (1 - this.warpBoost) * 140;
        const r2 = r1 + 35 + this.warpBoost * 95;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(ang) * r1, cy + Math.sin(ang) * r1);
        ctx.lineTo(cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 0. Etichetele Astronomice ale celor 5 Galaxii Îndepărtate (Deep Space Telemetry)
    ctx.textAlign = 'center';
    ctx.font = '400 8.5px "JetBrains Mono", monospace';
    DISTANT_GALAXIES.forEach((gal) => {
      const gp = this.cam.projectPoint(gal.pos.x, gal.pos.y + gal.radius * 0.45, gal.pos.z);
      if (!gp.visible) return;
      ctx.fillStyle = 'rgba(148, 163, 184, 0.34)';
      ctx.fillText(`⊹ ${gal.designation}`, gp.x, gp.y);
    });

    // 0.5. Filamente Sinaptice Multi-Strand între Stelele Vizitate (ca în înregistrarea video)
    const maxEdgeIdx =
      this.currentStageIdx === 7
        ? SWARM_CLUSTERS.length - 1
        : Math.min(this.currentStageIdx, SWARM_CLUSTERS.length - 1);

    for (let i = 0; i < maxEdgeIdx; i++) {
      const cA = SWARM_CLUSTERS[i];
      const cB = SWARM_CLUSTERS[i + 1];
      const pA = this.cam.projectPoint(cA.pos.x, cA.pos.y, cA.pos.z);
      const pB = this.cam.projectPoint(cB.pos.x, cB.pos.y, cB.pos.z);
      if (pA.visible && pB.visible) {
        const mx = (pA.x + pB.x) * 0.5;
        const my = (pA.y + pB.y) * 0.5;
        for (let s = -1; s <= 1; s++) {
          const wave = Math.sin(now * 0.0022 + i * 1.7 + s * 1.3) * (12 + Math.abs(s) * 9);
          const cpx = mx + wave * 0.65;
          const cpy = my - Math.abs(s) * 14 + wave;
          ctx.strokeStyle =
            s === 0 ? 'rgba(45, 212, 191, 0.36)' : 'rgba(148, 163, 184, 0.16)';
          ctx.lineWidth = s === 0 ? 1.25 : 0.75;
          ctx.beginPath();
          ctx.moveTo(pA.x, pA.y);
          ctx.quadraticCurveTo(cpx, cpy, pB.x, pB.y);
          ctx.stroke();

          if (s === 0) {
            const pt = (now * 0.00045 + i * 0.23) % 1;
            const inv = 1 - pt;
            const px = inv * inv * pA.x + 2 * inv * pt * cpx + pt * pt * pB.x;
            const py = inv * inv * pA.y + 2 * inv * pt * cpy + pt * pt * pB.y;
            ctx.fillStyle = cB.colorCss;
            ctx.beginPath();
            ctx.arc(px, py, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    // 1. Nucleul & Titlurile celor 7 Nebuloase Principale (cu Hit-Testing pt. click direct pe stea)
    this.hoveredStarIdx = null;
    SWARM_CLUSTERS.forEach((c, idx) => {
      const coreP = this.cam.projectPoint(c.pos.x, c.pos.y, c.pos.z);
      const p = this.cam.projectPoint(c.pos.x, c.pos.y + 7.2, c.pos.z);
      if (!p.visible || !coreP.visible) return;

      const isCurr = idx === this.currentStageIdx;
      const isDone = idx < this.currentStageIdx || this.currentStageIdx === 7;

      const distCore = Math.hypot(this.mouseX - coreP.x, this.mouseY - coreP.y);
      const distLabel = Math.hypot(this.mouseX - p.x, this.mouseY - (p.y + 4));
      if ((!this.isDragging || this.dragMovedPx < 6) && (distCore < 24 || distLabel < 36)) {
        this.hoveredStarIdx = idx;
      }
      const isStarHov = this.hoveredStarIdx === idx;

      // Halo luminos în nucleul stelei din care ies cardurile
      const pulseR = (isCurr ? 9.5 : isDone ? 6.5 : 4.2) + Math.sin(now * 0.004 + idx) * 1.6;
      ctx.save();
      ctx.strokeStyle = isCurr || isStarHov ? '#ffffff' : c.colorCss;
      ctx.globalAlpha = isCurr || isStarHov ? 0.85 : isDone ? 0.5 : 0.24;
      ctx.lineWidth = isCurr || isStarHov ? 1.6 : 1.0;
      ctx.beginPath();
      ctx.arc(coreP.x, coreP.y, pulseR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = c.colorCss;
      ctx.globalAlpha = isCurr || isStarHov ? 0.95 : isDone ? 0.65 : 0.3;
      ctx.beginPath();
      ctx.arc(coreP.x, coreP.y, isCurr ? 3.6 : 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.font =
        isCurr || isStarHov
          ? '700 15px "JetBrains Mono", monospace'
          : '700 12px "JetBrains Mono", monospace';
      ctx.fillStyle =
        isCurr || isStarHov ? '#ffffff' : isDone ? c.colorCss : 'rgba(226, 232, 240, 0.5)';
      ctx.fillText(c[this.lang].tab, p.x, p.y);

      ctx.font = '400 9px "JetBrains Mono", monospace';
      ctx.fillStyle = isCurr ? '#2dd4bf' : 'rgba(148, 163, 184, 0.5)';
      const st = isCurr
        ? `${c.wordCount}/${c.wordCount} words · reading`
        : isDone
        ? `${c.wordCount}/${c.wordCount} words · done`
        : `0/${c.wordCount} words · queued`;
      ctx.fillText(st, p.x, p.y + 13);
    });

    // 2. Păianjenul Cibernetic (16 picioare + 22 tentacule Bézier)
    const sp = this.cam.projectPoint(this.spiderPos3D.x, this.spiderPos3D.y, this.spiderPos3D.z);
    if (sp.visible) {
      const lastTrail = this.spiderTrail[this.spiderTrail.length - 1];
      const tail = this.cam.projectPoint(lastTrail.x, lastTrail.y, lastTrail.z);
      const activeCluster =
        this.currentStageIdx >= 0 && this.currentStageIdx < SWARM_CLUSTERS.length
          ? SWARM_CLUSTERS[this.currentStageIdx]
          : null;

      for (let t = 0; t < 22; t++) {
        const ang = (t / 22) * Math.PI * 2 + now * 0.0008;
        let ex;
        let ey;

        if (activeCluster) {
          const nodes = activeCluster[this.lang].nodes;
          const nd = nodes[t % nodes.length];
          const np = this.cam.projectPoint(
            activeCluster.pos.x + nd.dx,
            activeCluster.pos.y + nd.dy,
            activeCluster.pos.z + nd.dz
          );
          ex = np.x + Math.sin(now * 0.003 + t) * 7;
          ey = np.y + Math.cos(now * 0.003 + t) * 7;
        } else {
          const rad = 46 + (t % 5) * 16;
          ex = tail.x + Math.cos(ang) * rad;
          ey = tail.y + Math.sin(ang) * rad;
        }

        const cp1x = sp.x + Math.cos(ang) * 32;
        const cp1y = sp.y + Math.sin(ang) * 32;
        const cp2x = (sp.x + ex) * 0.5 + Math.sin(now * 0.004 + t) * 16;
        const cp2y = (sp.y + ey) * 0.5 + Math.cos(now * 0.004 + t) * 16;

        ctx.strokeStyle = t % 3 === 0 ? 'rgba(45, 212, 191, 0.55)' : 'rgba(226, 232, 240, 0.25)';
        ctx.lineWidth = t % 3 === 0 ? 1.3 : 0.8;
        ctx.beginPath();
        ctx.moveTo(sp.x, sp.y);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, ex, ey);
        ctx.stroke();

        ctx.fillStyle = '#2dd4bf';
        ctx.beginPath();
        ctx.arc(ex, ey, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let l = 0; l < 16; l++) {
        const a = (l / 16) * Math.PI * 2 - now * 0.0015;
        const r2 = 24 + Math.sin(now * 0.008 + l) * 4;
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.78)';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(sp.x + Math.cos(a) * 14, sp.y + Math.sin(a) * 14);
        ctx.lineTo(sp.x + Math.cos(a) * r2, sp.y + Math.sin(a) * r2);
        ctx.stroke();
      }

      ctx.strokeStyle = '#2dd4bf';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, 14, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, 8.5, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 3. Cardurile 3D care ies radial din stea ([ label · kind ] + buton direct [↗ LIVE] pe proiecte)
    this.projectedCards = [];
    ctx.font = '600 10px "JetBrains Mono", monospace';

    SWARM_CLUSTERS.forEach((c, cIdx) => {
      const hasExplicitActivation = Boolean(this.clusterActivatedAt[cIdx]);
      if (this.currentStageIdx < cIdx && this.currentStageIdx !== 7 && !hasExplicitActivation) {
        return;
      }
      const centerP = this.cam.projectPoint(c.pos.x, c.pos.y, c.pos.z);
      const actStart = this.clusterActivatedAt[cIdx] || 0;

      c[this.lang].nodes.forEach((nd, nIdx) => {
        // Staggered radial emergence din centrul stelei (0 -> 1 cu cubic ease-out)
        const rawT = Math.max(0, (now - actStart - nIdx * 95) / 680);
        if (rawT <= 0.01) return;
        const clampedT = Math.min(1, rawT);
        const emerge = 1 - (1 - clampedT) ** 3;

        const floatY = Math.sin(now * 0.002 + nIdx * 1.4 + cIdx) * 0.4 * emerge;
        const wx = c.pos.x + nd.dx * emerge;
        const wy = c.pos.y + nd.dy * emerge + floatY;
        const wz = c.pos.z + nd.dz * emerge;
        const p = this.cam.projectPoint(wx, wy, wz);
        if (!p.visible) return;

        const urls =
          nd.matchKey && this.harvestedLinks[nd.matchKey]
            ? this.harvestedLinks[nd.matchKey]
            : null;
        const primaryUrl = urls ? urls.live || urls.github : null;
        let linkBadge = null;
        if (primaryUrl) {
          if (nd.matchKey === 'whatsapp') linkBadge = '↗ WHATSAPP';
          else if (nd.matchKey === 'cv_pdf') linkBadge = '↗ CV PDF';
          else if (urls.live) linkBadge = '↗ LIVE';
          else linkBadge = '↗ GITHUB';
        } else if (nd.projectKey === 'proj2') {
          linkBadge = this.lang === 'ro' ? '📋 CAZ' : '📋 CASE';
        } else if (nd.matchKey === 'contact_form') {
          linkBadge = this.lang === 'ro' ? '✉ MESAJ' : '✉ FORM';
        }

        const fullText = `${nd.label} · ${nd.kind}`;
        const mainTextW = ctx.measureText(fullText).width;
        const badgeW = linkBadge ? ctx.measureText(linkBadge).width + 14 : 0;
        const boxW = mainTextW + 18 + (badgeW ? badgeW + 6 : 0);
        const boxH = linkBadge ? 22 : 20;

        this.projectedCards.push({
          id: `${c.id}-${nIdx}`,
          clusterIdx: cIdx,
          clusterId: c.id,
          clusterTitle: c[this.lang].title,
          clusterColor: c.colorCss,
          targetSelector: c.targetSelector,
          matchKey: nd.matchKey || null,
          projectKey: nd.projectKey || null,
          category: nd.category || null,
          primaryUrl,
          linkBadge,
          badgeW,
          mainTextW,
          label: nd.label,
          kind: nd.kind,
          desc: nd.desc || '',
          tags: nd.tags || [],
          fullText,
          emerge,
          x: p.x,
          y: p.y,
          cx: centerP.x,
          cy: centerP.y,
          zDepth: p.z,
          boxW,
          boxH,
          worldX: wx,
          worldY: wy,
          worldZ: wz,
          isCurrent:
            cIdx === this.currentStageIdx ||
            this.currentStageIdx === 7 ||
            (this.currentStageIdx === -1 && cIdx === 3)
        });
      });
    });

    this.projectedCards.sort((a, b) => b.zDepth - a.zDepth);

    for (let i = 0; i < this.projectedCards.length; i++) {
      for (let j = i + 1; j < this.projectedCards.length; j++) {
        const a = this.projectedCards[i];
        const b = this.projectedCards[j];
        if (Math.abs(a.x - b.x) < (a.boxW + b.boxW) * 0.48 && Math.abs(a.y - b.y) < 26) {
          const push = (26 - Math.abs(a.y - b.y)) * 0.5;
          if (a.y <= b.y) {
            a.y -= push;
            b.y += push;
          } else {
            a.y += push;
            b.y -= push;
          }
        }
      }
    }

    // Clampăm coordonatele cardurilor în zona liberă a ecranului (evitând headerul, inspectorul și panourile HUD)
    const isPhone = w < 640;
    const isTablet = w >= 640 && w <= 1024;
    const inspectorOpen =
      this.dom.inspector && this.dom.inspector.classList.contains('is-open');
    const rightSafeW = inspectorOpen && w > 960 ? w - 355 : w - 12;
    const topSafeY = isPhone ? 156 : isTablet ? 148 : 142;
    const bottomSafeY = isPhone
      ? this.hudCollapsed
        ? h - 102
        : h - 220
      : isTablet
      ? h - 228
      : h - 236;

    this.projectedCards.forEach((c) => {
      const halfW = Math.min(c.boxW * 0.5 + 8, w * 0.47);
      const maxX = Math.max(halfW + 10, rightSafeW - halfW);
      c.x = Math.max(halfW, Math.min(maxX, c.x));
      c.y = Math.max(topSafeY, Math.min(Math.max(topSafeY + 40, bottomSafeY), c.y));
    });

    // A doua trecere anti-coliziune după clamparea în zona sigură
    for (let i = 0; i < this.projectedCards.length; i++) {
      for (let j = i + 1; j < this.projectedCards.length; j++) {
        const a = this.projectedCards[i];
        const b = this.projectedCards[j];
        if (Math.abs(a.x - b.x) < (a.boxW + b.boxW) * 0.48 && Math.abs(a.y - b.y) < 25) {
          const push = (25 - Math.abs(a.y - b.y)) * 0.5;
          if (a.y <= b.y) {
            a.y = Math.max(topSafeY - 8, a.y - push);
            b.y = Math.min(bottomSafeY + 12, b.y + push);
          } else {
            a.y = Math.min(bottomSafeY + 12, a.y + push);
            b.y = Math.max(topSafeY - 8, b.y - push);
          }
        }
      }
    }

    let hoverHit = null;
    if (!this.isDragging || this.dragMovedPx < 6) {
      for (let i = this.projectedCards.length - 1; i >= 0; i--) {
        const c = this.projectedCards[i];
        if (
          this.mouseX >= c.x - c.boxW * 0.5 - 3 &&
          this.mouseX <= c.x + c.boxW * 0.5 + 3 &&
          this.mouseY >= c.y - c.boxH * 0.5 - 3 &&
          this.mouseY <= c.y + c.boxH * 0.5 + 3
        ) {
          hoverHit = c;
          break;
        }
      }
    }

    if (hoverHit && (!this.hoveredCard || this.hoveredCard.id !== hoverHit.id)) {
      this.audio.playPing('hover');
    }
    this.hoveredCard = hoverHit;
    this.dom.hudCanvas.classList.toggle(
      'is-pointer',
      (Boolean(hoverHit) || this.hoveredStarIdx !== null) &&
        (!this.isDragging || this.dragMovedPx < 6)
    );

    this.projectedCards.forEach((c) => {
      const st = KIND_STYLES[c.kind] || KIND_STYLES.claim;
      const isHov = this.hoveredCard && this.hoveredCard.id === c.id;
      const isSel = this.selectedCard && this.selectedCard.id === c.id;
      const isFilteredOut =
        c.clusterIdx === 3 &&
        this.portfolioFilter !== 'all' &&
        c.category &&
        c.category !== this.portfolioFilter;

      ctx.save();
      const baseAlpha = isFilteredOut ? 0.16 : c.isCurrent || isHov || isSel ? 1.0 : 0.42;
      ctx.globalAlpha = baseAlpha * c.emerge;

      // Filamentul sinaptic care leagă nucleul stelei de cardul ieșit în orbită
      const ctrlX = (c.cx + c.x) * 0.5;
      const ctrlY = c.cy + (c.y - c.cy) * 0.25;
      ctx.strokeStyle = isHov || isSel ? '#00f0ff' : st.border;
      ctx.lineWidth = isHov || isSel ? 1.65 : 0.85;
      ctx.setLineDash(isHov || isSel ? [] : [3, 3]);
      ctx.beginPath();
      ctx.moveTo(c.cx, c.cy);
      ctx.quadraticCurveTo(ctrlX, ctrlY, c.x, c.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Impuls luminos care călătorește din nucleul stelei către cardul proiectului
      if ((c.isCurrent || isHov) && !isFilteredOut) {
        const pulseT = (now * 0.0009 + c.worldX * 0.07) % 1;
        const inv = 1 - pulseT;
        const px = inv * inv * c.cx + 2 * inv * pulseT * ctrlX + pulseT * pulseT * c.x;
        const py = inv * inv * c.cy + 2 * inv * pulseT * ctrlY + pulseT * pulseT * c.y;
        ctx.fillStyle = isHov ? '#00f0ff' : c.clusterColor;
        ctx.beginPath();
        ctx.arc(px, py, isHov ? 2.4 : 1.7, 0, Math.PI * 2);
        ctx.fill();
      }

      const rx = c.x - c.boxW * 0.5;
      const ry = c.y - c.boxH * 0.5;
      ctx.fillStyle = isHov || isSel ? 'rgba(15, 23, 42, 0.96)' : 'rgba(6, 9, 14, 0.88)';
      ctx.fillRect(rx, ry, c.boxW, c.boxH);
      ctx.fillStyle = st.fill;
      ctx.fillRect(rx, ry, c.boxW, c.boxH);

      ctx.strokeStyle = isHov || isSel ? '#00f0ff' : st.border;
      ctx.lineWidth = isHov || isSel ? 1.7 : 1.0;
      ctx.strokeRect(rx, ry, c.boxW, c.boxH);

      // Reticul Holografic Target-Lock [ ⌖ ] pe cardul selectat sau survolat
      if (isHov || isSel) {
        const pad = 3.5;
        const len = 5.5;
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1.35;
        ctx.beginPath();
        // Stânga-Sus
        ctx.moveTo(rx - pad, ry - pad + len);
        ctx.lineTo(rx - pad, ry - pad);
        ctx.lineTo(rx - pad + len, ry - pad);
        // Dreapta-Sus
        ctx.moveTo(rx + c.boxW + pad - len, ry - pad);
        ctx.lineTo(rx + c.boxW + pad, ry - pad);
        ctx.lineTo(rx + c.boxW + pad, ry - pad + len);
        // Stânga-Jos
        ctx.moveTo(rx - pad, ry + c.boxH + pad - len);
        ctx.lineTo(rx - pad, ry + c.boxH + pad);
        ctx.lineTo(rx - pad + len, ry + c.boxH + pad);
        // Dreapta-Jos
        ctx.moveTo(rx + c.boxW + pad - len, ry + c.boxH + pad);
        ctx.lineTo(rx + c.boxW + pad, ry + c.boxH + pad);
        ctx.lineTo(rx + c.boxW + pad, ry + c.boxH + pad - len);
        ctx.stroke();
      }

      ctx.font =
        isHov || isSel
          ? '700 10.5px "JetBrains Mono", monospace'
          : '500 10px "JetBrains Mono", monospace';
      ctx.fillStyle = isHov || isSel ? '#ffffff' : st.text;
      ctx.textBaseline = 'middle';

      if (c.linkBadge) {
        ctx.textAlign = 'left';
        ctx.fillText(c.fullText, rx + 8, c.y + 0.5);

        // Butonul-insignă [↗ LIVE] / [📋 CAZ] integrat direct în partea dreaptă a cardului ieșit din stea
        const bx = rx + c.boxW - c.badgeW - 4;
        const by = ry + 3;
        const bh = c.boxH - 6;
        const isBadgeHov = isHov && this.mouseX >= bx - 2;

        ctx.fillStyle = isBadgeHov
          ? 'rgba(0, 240, 255, 0.32)'
          : 'rgba(45, 212, 191, 0.16)';
        ctx.fillRect(bx, by, c.badgeW, bh);
        ctx.strokeStyle = isBadgeHov ? '#ffffff' : '#2dd4bf';
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, by, c.badgeW, bh);

        ctx.font = '700 8.5px "JetBrains Mono", monospace';
        ctx.fillStyle = isBadgeHov ? '#ffffff' : '#2dd4bf';
        ctx.textAlign = 'center';
        ctx.fillText(c.linkBadge, bx + c.badgeW * 0.5, c.y + 0.5);
      } else {
        ctx.textAlign = 'center';
        ctx.fillText(c.fullText, c.x, c.y + 0.5);
      }

      ctx.restore();
    });
  }

  updateBottomTelemetry(now) {
    const stageElapsed = now - this.stageTimer;
    const prog = Math.min(1, stageElapsed / 3200);
    const isReading = this.currentStageIdx >= 0 && this.currentStageIdx < 7;

    if (isReading && now - this.lastLogTick > 360) {
      this.lastLogTick = now;
      const c = SWARM_CLUSTERS[this.currentStageIdx];
      const nds = c[this.lang].nodes;
      const rnd = nds[Math.floor(Math.random() * nds.length)];
      const acts = ['read', 'link', 'flag', 'read'];
      this.pushLog(acts[Math.floor(Math.random() * acts.length)], rnd.label.split(' ')[0]);
      this.audio.playPing('read');

      const lineIdx = 3 + (Math.floor(now / 360) % (GATEKEEPER_CODE_LINES.length - 3));
      this.dom.codeLines.forEach((el, idx) => el.classList.toggle('is-executing', idx === lineIdx));
    } else if (this.currentStageIdx === 7) {
      this.dom.codeLines.forEach((el, idx) =>
        el.classList.toggle('is-executing', idx === GATEKEEPER_CODE_LINES.length - 1)
      );
    }

    this.dom.logRate.textContent = isReading ? '18 w/s' : '0 w/s';

    // Panoul 2: SECTIONS
    const secPack = this.panelCtxs.sections;
    if (secPack) {
      const { ctx, w, h } = secPack;
      ctx.clearRect(0, 0, w, h);
      const rowH = h / 7;
      ctx.font = '500 9.5px "JetBrains Mono", monospace';

      SWARM_CLUSTERS.forEach((c, idx) => {
        const y = idx * rowH + rowH * 0.5;
        let r = 0;
        if (this.currentStageIdx > idx || this.currentStageIdx === 7) r = 1;
        else if (this.currentStageIdx === idx) r = prog;

        ctx.fillStyle = r > 0 ? '#e2e8f0' : '#64748b';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(c[this.lang].tab.slice(0, 9), 2, y);

        const bx = 62;
        const bw = Math.max(36, w - 104);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.fillRect(bx, y - 3.5, bw, 7);
        if (r > 0) {
          ctx.fillStyle = c.colorCss;
          ctx.fillRect(bx, y - 3.5, bw * r, 7);
        }

        ctx.fillStyle = r === 1 ? '#cbd5e1' : '#64748b';
        ctx.textAlign = 'right';
        ctx.fillText(`${Math.round(c.wordCount * r)}/${c.wordCount}`, w - 2, y);
      });
    }

    const shortTags =
      this.lang === 'ro'
        ? ['ACA', 'SER', 'DES', 'POR', 'COM', 'EXP', 'CON']
        : ['HOM', 'SER', 'ABO', 'POR', 'SKI', 'EXP', 'CON'];

    // Panoul 3: COVERAGE RADAR
    const radPack = this.panelCtxs.radar;
    if (radPack) {
      const { ctx, w, h } = radPack;
      ctx.clearRect(0, 0, w, h);
      const cx = w * 0.5;
      const cy = h * 0.44;
      const rad = Math.min(w, h) * 0.33;

      [0.35, 0.7, 1.0].forEach((s) => {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        for (let i = 0; i < 7; i++) {
          const a = (i / 7) * Math.PI * 2 - Math.PI * 0.5;
          const px = cx + Math.cos(a) * rad * s;
          const py = cy + Math.sin(a) * rad * s;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      });

      const pts = [];
      ctx.font = '600 7.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2 - Math.PI * 0.5;
        ctx.fillStyle = '#64748b';
        ctx.fillText(shortTags[i], cx + Math.cos(a) * (rad + 10), cy + Math.sin(a) * (rad + 10));

        let v = 0.08;
        if (this.currentStageIdx > i || this.currentStageIdx === 7) v = 0.92;
        else if (this.currentStageIdx === i) v = 0.1 + prog * 0.82;
        pts.push({ x: cx + Math.cos(a) * rad * v, y: cy + Math.sin(a) * rad * v });
      }

      ctx.fillStyle = 'rgba(45, 212, 191, 0.25)';
      ctx.strokeStyle = '#2dd4bf';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      pts.forEach((p, idx) => (idx === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      const cCount = Math.max(0, this.currentStageIdx + 1);
      ctx.font = '500 8px "JetBrains Mono", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'left';
      ctx.fillText(`cards ${Math.min(36, cCount * 5)}`, 2, h - 15);
      ctx.fillText(`links ${Math.min(14, cCount * 2)}`, 2, h - 5);
      ctx.textAlign = 'right';
      ctx.fillText(`verified ${Math.min(7, cCount)}/7`, w - 2, h - 5);
    }

    // Panoul 4: WORD HEAT
    const heatPack = this.panelCtxs.heat;
    if (heatPack) {
      const { ctx, w, h } = heatPack;
      ctx.clearRect(0, 0, w, h);
      ctx.font = '500 7.5px "JetBrains Mono", monospace';
      ctx.textBaseline = 'middle';

      let totalRead = 0;
      SWARM_CLUSTERS.forEach((c, rIdx) => {
        const ry = 8 + rIdx * 9.5;
        ctx.fillStyle = '#64748b';
        ctx.textAlign = 'left';
        ctx.fillText(shortTags[rIdx], 2, ry);

        const cells = Math.min(16, Math.ceil(c.wordCount / 2));
        let r = 0;
        if (this.currentStageIdx > rIdx || this.currentStageIdx === 7) r = 1;
        else if (this.currentStageIdx === rIdx) r = prog;

        totalRead += Math.round(c.wordCount * r);
        const lit = Math.round(cells * r);
        for (let cell = 0; cell < cells; cell++) {
          ctx.fillStyle = cell < lit ? c.colorCss : 'rgba(255, 255, 255, 0.08)';
          ctx.fillRect(26 + cell * 8.2, ry - 3, 6.2, 6);
        }
      });

      ctx.fillStyle = '#64748b';
      ctx.fillText('words per second', 2, h - 40);
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 12.5px "JetBrains Mono", monospace';
      ctx.fillText(isReading ? '1080/m' : '0/m', 2, h - 26);

      ctx.font = '400 8px "JetBrains Mono", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`read ${totalRead}`, 2, h - 14);
      ctx.fillText(`linked ${Math.min(45, Math.round(totalRead * 0.25))}`, 2, h - 4);
      ctx.textAlign = 'right';
      ctx.fillText(`flagged ${Math.min(12, Math.round(totalRead * 0.06))}`, w - 2, h - 14);
      ctx.fillText('guessed 0', w - 2, h - 4);
    }

    // Panoul 5: SPEC SCORE
    const scorePack = this.panelCtxs.score;
    if (scorePack) {
      const { ctx, w, h } = scorePack;
      ctx.clearRect(0, 0, w, h);

      const scores = [0, 14, 28, 44, 62, 76, 88, 96, 98];
      const trg = scores[Math.max(0, this.currentStageIdx + 1)] || 0;
      this.displayedScore += (trg - this.displayedScore) * 0.08;
      const sc = Math.round(this.displayedScore);

      ctx.strokeStyle = '#2dd4bf';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      for (let x = 0; x < w - 8; x += 6) {
        const y = 24 - (x / (w - 8)) * (sc * 0.18) + Math.sin(x * 0.2) * 2;
        if (x === 0) ctx.moveTo(4 + x, y);
        else ctx.lineTo(4 + x, y);
      }
      ctx.stroke();

      const cx = w * 0.5;
      const cy = h * 0.62;
      const r = 27;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 2.25);
      ctx.stroke();

      ctx.strokeStyle = sc > 80 ? '#2dd4bf' : '#facc15';
      ctx.beginPath();
      ctx.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 0.75 + (sc / 100) * (Math.PI * 1.5));
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 15px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(sc), cx, cy - 2);

      ctx.fillStyle = '#64748b';
      ctx.font = '400 7.5px "JetBrains Mono", monospace';
      ctx.fillText('spec score', cx, cy + 10);
      ctx.textAlign = 'left';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Zero-Trust · Strict CSP', 4, h - 5);
    }
  }

  /**
   * Deschide Inspectorul Holografic 1-la-1 cu cardul din site (titlu, descriere, tag-uri)
   * și populează toate acțiunile (Live Demo, GitHub, Studiu de Caz Tehnic, Formular Contact, Copy Email).
   */
  openInspectorForCard(c) {
    this.switchToManualRoam();
    this.selectedCard = c;
    this.audio.playPing('stage');

    const isRo = this.lang === 'ro';
    this.dom.insKind.textContent = `${c.clusterId.toUpperCase()} · [${c.kind}]`;
    this.dom.insTitle.textContent = c.label;
    this.dom.insDesc.textContent = c.desc || '';

    const tagFrag = document.createDocumentFragment();
    (c.tags || []).forEach((tagTxt) => {
      const pill = document.createElement('span');
      pill.className = 'swarm-inspector-tag';
      pill.textContent = tagTxt;
      tagFrag.appendChild(pill);
    });
    this.dom.insTags.replaceChildren(tagFrag);

    const wx = typeof c.worldX === 'number' ? c.worldX : 0;
    const wy = typeof c.worldY === 'number' ? c.worldY : 0;
    const wz = typeof c.worldZ === 'number' ? c.worldZ : 0;
    this.dom.insMeta.textContent = isRo
      ? `Rubrica: "${c.clusterTitle}" · Coordonate 3D: (${wx.toFixed(1)}, ${wy.toFixed(1)}, ${wz.toFixed(1)})`
      : `Section: "${c.clusterTitle}" · 3D Coords: (${wx.toFixed(1)}, ${wy.toFixed(1)}, ${wz.toFixed(1)})`;
    this.dom.insJump.textContent = isRo
      ? `▸ Vezi în Pagină (${c.targetSelector})`
      : `▸ Jump to Section (${c.targetSelector})`;

    // Badge NDA pentru proiectul privat Enterprise (proj2)
    if (this.dom.insNdaBadge) {
      if (c.projectKey === 'proj2') {
        this.dom.insNdaBadge.textContent = isRo
          ? '🔒 PROIECT PRIVAT (ENTERPRISE NDA) · ARHITECTURĂ VERIFICABILĂ ÎN STUDIUL DE CAZ'
          : '🔒 PRIVATE PROJECT (ENTERPRISE NDA) · ARCHITECTURE VERIFIABLE IN CASE STUDY';
        this.dom.insNdaBadge.classList.remove('is-hidden');
      } else {
        this.dom.insNdaBadge.classList.add('is-hidden');
      }
    }

    // Buton Studiu de Caz Tehnic complet (pentru toate cele 5 proiecte din Portofoliu)
    if (this.dom.insCaseBtn) {
      const langCases = CASE_STUDIES_DATA[this.lang] || CASE_STUDIES_DATA.ro;
      if (c.projectKey && langCases && langCases[c.projectKey]) {
        this.dom.insCaseBtn.textContent = isRo
          ? '📋 DETALII TEHNICE / STUDIU DE CAZ'
          : '📋 TECHNICAL DETAILS / CASE STUDY';
        this.dom.insCaseBtn.classList.remove('is-hidden');
      } else {
        this.dom.insCaseBtn.classList.add('is-hidden');
      }
    }

    // Buton contextual suplimentar (Formular Contact Direct / Copiere Email / Cerere Ofertă Serviciu)
    if (this.dom.insExtraBtn) {
      if (c.matchKey === 'contact_form') {
        this.dom.insExtraBtn.textContent = isRo
          ? '✉ DESCHIDE FORMULARUL DE CONTACT DIRECT'
          : '✉ OPEN DIRECT CONTACT FORM';
        this.dom.insExtraBtn.onclick = () => this.openContactDrawer();
        this.dom.insExtraBtn.classList.remove('is-hidden');
      } else if (c.matchKey === 'email') {
        this.dom.insExtraBtn.textContent = isRo
          ? '📋 COPIAZĂ ADRESA: contact@tiberiumilitaru.ro'
          : '📋 COPY ADDRESS: contact@tiberiumilitaru.ro';
        this.dom.insExtraBtn.onclick = () => {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText('contact@tiberiumilitaru.ro').catch(() => {});
          }
          this.dom.insExtraBtn.textContent = isRo
            ? '✓ ADRESĂ EMAIL COPIATĂ ÎN CLIPBOARD!'
            : '✓ EMAIL ADDRESS COPIED TO CLIPBOARD!';
        };
        this.dom.insExtraBtn.classList.remove('is-hidden');
      } else if (c.clusterIdx === 1) {
        this.dom.insExtraBtn.textContent = isRo
          ? '✉ SOLICITĂ OFERTĂ PENTRU ACEST SERVICIU'
          : '✉ REQUEST QUOTE FOR THIS SERVICE';
        this.dom.insExtraBtn.onclick = () => this.openContactDrawer(c.label);
        this.dom.insExtraBtn.classList.remove('is-hidden');
      } else {
        this.dom.insExtraBtn.onclick = null;
        this.dom.insExtraBtn.classList.add('is-hidden');
      }
    }

    // Verificăm dacă există URL-uri externe recoltate din cardul DOM corespunzător
    const urls = c.matchKey && this.harvestedLinks[c.matchKey] ? this.harvestedLinks[c.matchKey] : null;

    if (urls && urls.live) {
      this.dom.insLiveLink.href = urls.live;
      if (c.matchKey === 'whatsapp') {
        this.dom.insLiveLink.textContent = '↗ WHATSAPP';
      } else if (c.matchKey === 'phone') {
        this.dom.insLiveLink.textContent = isRo ? '↗ APELEAZĂ' : '↗ CALL';
      } else if (c.matchKey === 'email') {
        this.dom.insLiveLink.textContent = '↗ EMAIL';
      } else if (c.matchKey === 'cv_pdf') {
        this.dom.insLiveLink.textContent = '↗ CV PDF';
      } else if (c.matchKey === 'linkedin') {
        this.dom.insLiveLink.textContent = '↗ LINKEDIN';
      } else {
        this.dom.insLiveLink.textContent = isRo ? '↗ DESCHIDE PROIECT LIVE' : '↗ OPEN LIVE PROJECT';
      }
      this.dom.insLiveLink.classList.remove('is-hidden');
    } else {
      this.dom.insLiveLink.classList.add('is-hidden');
    }

    if (urls && urls.github) {
      this.dom.insGitLink.href = urls.github;
      this.dom.insGitLink.textContent = '↗ GITHUB REPO';
      this.dom.insGitLink.classList.remove('is-hidden');
    } else {
      this.dom.insGitLink.classList.add('is-hidden');
    }

    // Evidențiem pastila corespunzătoare în bara-carusel de carduri
    if (this.dom.dockList) {
      Array.from(this.dom.dockList.children).forEach((pill) => {
        const isCurrentPill = pill.dataset.cardId === c.id;
        pill.classList.toggle('is-active', isCurrentPill);
        pill.classList.toggle('is-selected', isCurrentPill);
      });
    }

    this.dom.inspector.classList.add('is-open');
  }

  /* ------------------------------------------------------------------------
     INTERACȚIUNI 360° ORBIT, SCROLL ZOOM, TOUCH & TASTATURĂ
     ------------------------------------------------------------------------ */

  switchToManualRoam() {
    if (this.autoPlay) {
      this.autoPlay = false;
      if (this.dom.autoBtn) this.dom.autoBtn.textContent = 'MODE: FREE ROAM';
    }
  }

  findCardAtPoint(px, py, padX = 5, padY = 5) {
    for (let i = this.projectedCards.length - 1; i >= 0; i--) {
      const c = this.projectedCards[i];
      if (
        px >= c.x - c.boxW * 0.5 - padX &&
        px <= c.x + c.boxW * 0.5 + padX &&
        py >= c.y - c.boxH * 0.5 - padY &&
        py <= c.y + c.boxH * 0.5 + padY
      ) {
        return c;
      }
    }
    return null;
  }

  onMouseDown(e) {
    if (this.state !== 'SWARM_LIVE' || e.button !== 0) return;
    this.isDragging = true;
    this.dragMovedPx = 0;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.pressedCard = this.findCardAtPoint(e.clientX, e.clientY, 5, 5);
    this.pressedStarIdx = this.hoveredStarIdx;
    this.dom.hudCanvas.classList.add('is-grabbing');
  }

  onMouseMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;

    if (this.state === 'SWARM_LIVE' && this.isDragging) {
      const dx = e.clientX - this.lastPointerX;
      const dy = e.clientY - this.lastPointerY;
      this.dragMovedPx += Math.hypot(dx, dy);
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;

      if (this.dragMovedPx > 4) {
        this.switchToManualRoam();
        this.targetYaw -= dx * 0.0065;
        this.targetPitch = Math.max(-1.42, Math.min(1.42, this.targetPitch + dy * 0.0065));
      }
    }
  }

  onMouseUp(e) {
    if (!this.isDragging) return;
    this.isDragging = false;
    if (this.dom.hudCanvas) this.dom.hudCanvas.classList.remove('is-grabbing');

    if (e && typeof e.clientX === 'number') {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    }

    if (this.dragMovedPx < 7) {
      const hitCard =
        this.findCardAtPoint(this.mouseX, this.mouseY, 6, 6) ||
        this.hoveredCard ||
        this.pressedCard;

      if (hitCard) {
        const c = hitCard;
        const rx = c.x - c.boxW * 0.5;
        const badgeStartX = rx + c.boxW - c.badgeW - 10;
        const wasAlreadySelected = Boolean(this.selectedCard && this.selectedCard.id === c.id);

        this.openInspectorForCard(c);

        // Click direct pe insigna [↗ LIVE] / [📋 CAZ] / [✉ MESAJ] SAU al doilea click pe cardul deja selectat
        if ((c.linkBadge && this.mouseX >= badgeStartX) || wasAlreadySelected) {
          this.triggerCardPrimaryAction(c);
        }
        this.pressedCard = null;
        this.pressedStarIdx = null;
        return;
      }

      const starIdx = this.hoveredStarIdx !== null ? this.hoveredStarIdx : this.pressedStarIdx;
      if (starIdx !== null && starIdx !== undefined) {
        // Click direct pe o stea din constelație -> zboară camera și păianjenul la acea rubrică
        this.switchToManualRoam();
        this.setStage(starIdx);
      }
    }

    this.pressedCard = null;
    this.pressedStarIdx = null;
  }

  onWheel(e) {
    if (this.state !== 'SWARM_LIVE') return;
    e.preventDefault();
    this.switchToManualRoam();
    const zoomFactor = e.deltaY > 0 ? 1.09 : 0.91;
    this.targetDist = Math.max(4.5, Math.min(165, this.targetDist * zoomFactor));
  }

  onTouchStart(e) {
    if (this.state !== 'SWARM_LIVE') return;
    if (e.touches.length === 1) {
      const t = e.touches[0];
      this.isDragging = true;
      this.dragMovedPx = 0;
      this.lastPointerX = t.clientX;
      this.lastPointerY = t.clientY;
      this.mouseX = t.clientX;
      this.mouseY = t.clientY;
      this.pressedCard = this.findCardAtPoint(t.clientX, t.clientY, 10, 12);
    } else if (e.touches.length === 2) {
      this.isDragging = false;
      this.lastPinchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  }

  onTouchMove(e) {
    if (this.state !== 'SWARM_LIVE') return;
    e.preventDefault();

    if (e.touches.length === 1 && this.isDragging) {
      const t = e.touches[0];
      const dx = t.clientX - this.lastPointerX;
      const dy = t.clientY - this.lastPointerY;
      this.dragMovedPx += Math.hypot(dx, dy);
      this.lastPointerX = t.clientX;
      this.lastPointerY = t.clientY;
      this.mouseX = t.clientX;
      this.mouseY = t.clientY;

      if (this.dragMovedPx > 5) {
        this.switchToManualRoam();
        this.targetYaw -= dx * 0.0075;
        this.targetPitch = Math.max(-1.42, Math.min(1.42, this.targetPitch + dy * 0.0075));
      }
    } else if (e.touches.length === 2) {
      this.switchToManualRoam();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (this.lastPinchDist > 0) {
        const ratio = this.lastPinchDist / Math.max(10, dist);
        this.targetDist = Math.max(4.5, Math.min(165, this.targetDist * ratio));
      }
      this.lastPinchDist = dist;
    }
  }

  onTouchEnd() {
    if (this.state !== 'SWARM_LIVE') return;
    if (this.isDragging && this.dragMovedPx < 12) {
      // Tap scurt pe mobil/tabletă: căutăm dacă degetul a atins un card 3D sau butonul [↗ LIVE]
      const c =
        this.findCardAtPoint(this.mouseX, this.mouseY, 12, 14) || this.pressedCard;
      if (c) {
        const rx = c.x - c.boxW * 0.5;
        const badgeStartX = rx + c.boxW - c.badgeW - 12;
        const wasAlreadySelected = Boolean(this.selectedCard && this.selectedCard.id === c.id);
        this.openInspectorForCard(c);
        if ((c.linkBadge && this.mouseX >= badgeStartX) || wasAlreadySelected) {
          this.triggerCardPrimaryAction(c);
        }
      } else {
        // Verificăm dacă utilizatorul a atins nucleul unei stele
        SWARM_CLUSTERS.forEach((st, idx) => {
          const coreP = this.cam.projectPoint(st.pos.x, st.pos.y, st.pos.z);
          if (coreP.visible && Math.hypot(this.mouseX - coreP.x, this.mouseY - coreP.y) < 34) {
            this.switchToManualRoam();
            this.setStage(idx);
          }
        });
      }
    }
    this.isDragging = false;
    this.pressedCard = null;
    this.lastPinchDist = 0;
  }

  onKeyDown(e) {
    if (this.state === 'MODAL' && e.key === 'Escape') {
      this.closeBatteryWarning();
      return;
    }
    if (this.state !== 'SWARM_LIVE') return;

    if (e.key === 'Escape') {
      e.preventDefault();
      if (this.dom.drawerBackdrop && this.dom.drawerBackdrop.classList.contains('is-open')) {
        this.closeDrawerModal();
        return;
      }
      this.restoreReality();
    } else if (e.code === 'Space') {
      if (this.dom.drawerBackdrop && this.dom.drawerBackdrop.classList.contains('is-open')) {
        return;
      }
      e.preventDefault();
      this.autoPlay = !this.autoPlay;
      this.dom.autoBtn.textContent = this.autoPlay ? 'MODE: AUTO-CRAWL' : 'MODE: FREE ROAM';
    } else if (e.key === 'ArrowRight') {
      if (this.dom.drawerBackdrop && this.dom.drawerBackdrop.classList.contains('is-open')) {
        return;
      }
      e.preventDefault();
      this.switchToManualRoam();
      this.setStage(Math.min(7, this.currentStageIdx + 1));
    } else if (e.key === 'ArrowLeft') {
      if (this.dom.drawerBackdrop && this.dom.drawerBackdrop.classList.contains('is-open')) {
        return;
      }
      e.preventDefault();
      this.switchToManualRoam();
      this.setStage(Math.max(-1, this.currentStageIdx - 1));
    } else if (e.key === 'r' || e.key === 'R') {
      if (this.dom.drawerBackdrop && this.dom.drawerBackdrop.classList.contains('is-open')) {
        return;
      }
      this.setStage(this.currentStageIdx);
    }
  }

  /**
   * Reface realitatea 2D printr-o secvență fizică în 3 Acte (~1.68s) ancorată în `#swarmAtomicBtn`:
   * - Actul 1 (0ms – 520ms): "Reverse Big-Crunch" — întregul univers WebGL, cele 7 stele, cardurile 3D
   *   și păianjenul cibernetic sunt aspirate pe curbe Bézier direct în butonul atomic `#swarmAtomicBtn`.
   * - Actul 2 (470ms – 680ms): "Quantum Critical Mass & Anamorphic Singularity Flash" în `#swarmAtomicBtn`.
   * - Actul 3 (490ms – 1680ms): "Holographic Laser Projection & 3D DOM Unfolding" — secțiunile și cardurile
   *   reale ale paginii zboară fizic în perspectivă 3D din `#swarmAtomicBtn`, ghidate de raze laser și
   *   holograme wireframe care se fixează milimetric peste DOM-ul real.
   */
  restoreReality(jumpSelector = null) {
    if (this.state === 'RESTORING' || this.state === 'IDLE') return;

    this.syncAtomicOrigin();

    this.restoreJumpSelector = jumpSelector;
    this.closeDrawerModal();
    this.audio.stopAll();
    this.audio.playPortalRestore();

    // Capturăm instantaneul cardurilor 3D vizibile pentru Actul 1 (nimic nu dispare brusc!)
    this.restoreCardsSnapshot = this.projectedCards.slice(0, 18).map((c, idx) => {
      const dx = this.originX - c.x;
      const dy = this.originY - c.y;
      const side = idx % 2 === 0 ? 1 : -1;
      return {
        x: c.x,
        y: c.y,
        boxW: c.boxW || 132,
        boxH: c.boxH || 24,
        label: c.label || '',
        color: c.clusterColor || '#00f0ff',
        hasLink: Boolean(c.linkBadge),
        cpX: c.x + dx * 0.42 - dy * 0.24 * side,
        cpY: c.y + dy * 0.42 + dx * 0.24 * side,
        delay: idx * 14
      };
    });

    // Capturăm pozițiile pe ecran ale celor 7 stele din constelație pentru Actul 1
    this.restoreStarsSnapshot = SWARM_CLUSTERS.map((c, idx) => {
      const p = this.cam.projectPoint(c.pos.x, c.pos.y, c.pos.z);
      const sx = p.visible ? p.x : window.innerWidth * (0.16 + idx * 0.11);
      const sy = p.visible ? p.y : window.innerHeight * 0.48;
      const dx = this.originX - sx;
      const dy = this.originY - sy;
      const side = idx % 2 === 0 ? 1 : -1;
      return {
        x: sx,
        y: sy,
        color: c.colorCss,
        title: c[this.lang].tab,
        cpX: sx + dx * 0.36 - dy * 0.26 * side,
        cpY: sy + dy * 0.36 + dx * 0.26 * side,
        delay: idx * 22
      };
    });

    // Capturăm poziția păianjenului cibernetic 3D pentru a-l aspira înapoi în butonul atomic
    const sp = this.cam.projectPoint(this.spiderPos3D.x, this.spiderPos3D.y, this.spiderPos3D.z);
    this.restoreSpiderSnapshot = {
      x: sp.visible ? sp.x : window.innerWidth * 0.5,
      y: sp.visible ? sp.y : window.innerHeight * 0.5
    };

    this.dom.headerStack.classList.remove('is-visible');
    this.dom.banner.classList.remove('is-visible');
    this.dom.bottomHud.classList.remove('is-visible');
    this.dom.inspector.classList.remove('is-open');
    if (this.dom.cardDock) this.dom.cardDock.classList.remove('is-visible');
    if (this.dom.hudMobileToggle) this.dom.hudMobileToggle.classList.remove('is-visible');
    if (this.dom.filterBar) this.dom.filterBar.classList.remove('is-visible');

    if (this.dom.webglCanvas) {
      this.dom.webglCanvas.classList.remove('is-restoring');
      this.dom.webglCanvas.classList.add('is-imploding-to-atom');
    }
    if (this.dom.atomicBtn) {
      this.dom.atomicBtn.classList.add('is-portal-flare');
    }
    document.body.classList.add('swarm-crunching');

    this.restoreDomTriggered = false;
    this.restoreDomBlocks = [];
    this.clearRestoreEmergeClasses();

    this.restoreShockwaves = [
      { r: 4, a: 0.98, speed: 34, color: '0, 240, 255', delay: 470 },
      { r: 2, a: 0.88, speed: 24, color: '45, 212, 191', delay: 510 },
      { r: 1, a: 0.78, speed: 16, color: '250, 204, 21', delay: 560 }
    ];

    this.state = 'RESTORING';
    this.stateStart = performance.now();
  }

  /**
   * Curăță clasele temporare `.swarm-emerge-item-0..7` de pe elementele DOM reale după finalizarea Actului 3.
   */
  clearRestoreEmergeClasses() {
    if (!this.restoreEmergeEls || this.restoreEmergeEls.length === 0) return;
    this.restoreEmergeEls.forEach((el) => {
      for (let i = 0; i < 8; i++) {
        el.classList.remove(`swarm-emerge-item-${i}`);
      }
    });
    this.restoreEmergeEls = [];
  }

  /**
   * Declanșat la începutul Actului 2/3 (~470ms): pregătește secțiunile și cardurile vizibile din
   * site-ul 2D să zboare eșalonat în perspectivă 3D direct din coordonatele `#swarmAtomicBtn`
   * și înregistrează coordonatele lor în `this.restoreDomBlocks` pentru proiecția laser holografică.
   */
  prepareDomEmergenceFromAtom() {
    this.restoreDomTriggered = true;

    if (this.restoreJumpSelector) {
      const targetEl = document.querySelector(this.restoreJumpSelector);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
      this.restoreJumpSelector = null;
    }

    const candidates = Array.from(
      document.querySelectorAll(
        '.hero-content, .hero-visual, .section-header, .about-card, .skill-category, .project-card, .timeline-item, .cert-card, .contact-info, .contact-form-wrapper'
      )
    ).filter((el) => {
      if (this.dom.root && this.dom.root.contains(el)) return false;
      const r = el.getBoundingClientRect();
      return r.width > 40 && r.height > 28 && r.bottom > 45 && r.top < window.innerHeight - 20;
    });

    candidates.sort((a, b) => {
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      if (Math.abs(ra.top - rb.top) > 36) return ra.top - rb.top;
      return ra.left - rb.left;
    });

    const selected = candidates.slice(0, 8);
    const beamPalette = [
      '#00f0ff',
      '#2dd4bf',
      '#38bdf8',
      '#facc15',
      '#a855f7',
      '#fb7185',
      '#34d399',
      '#60a5fa'
    ];

    // Măsurăm coordonatele reale pe ecran ÎNAINTE de a aplica transformările 3D de ieșire din buton
    const measured = selected.map((el) => ({
      el,
      r: el.getBoundingClientRect()
    }));

    document.body.classList.remove('swarm-imploding', 'swarm-consumed', 'swarm-crunching');
    document.body.classList.add('swarm-restoring');

    this.restoreEmergeEls = [];
    this.restoreDomBlocks = measured.map(({ el, r }, idx) => {
      el.classList.add(`swarm-emerge-item-${idx}`);
      this.restoreEmergeEls.push(el);

      const cx = r.left + r.width * 0.5;
      const cy = r.top + r.height * 0.5;
      const dx = cx - this.originX;
      const dy = cy - this.originY;
      const side = idx % 2 === 0 ? 1 : -1;

      return {
        x: r.left,
        y: r.top,
        w: r.width,
        h: r.height,
        cx,
        cy,
        cpX: this.originX + dx * 0.46 - dy * 0.16 * side,
        cpY: this.originY + dy * 0.46 + dx * 0.16 * side,
        delayMs: idx * 55,
        color: beamPalette[idx % beamPalette.length],
        codeLabel: `DOM_NODE_0${idx + 1} // ${el.tagName}`
      };
    });
  }

  onResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.deviceProfile = this.getDeviceProfile();
    if (this.dom.root) {
      this.dom.root.dataset.device = this.deviceProfile;
    }
    this.syncAtomicOrigin();

    // Adaptăm unghiul de cuprindere al camerei 3D (FOV) în funcție de orientarea și profilul dispozitivului
    const aspect = window.innerWidth / Math.max(1, window.innerHeight);
    if (aspect < 0.72) {
      this.cam.fovRad = (68 * Math.PI) / 180;
    } else if (aspect < 1.05) {
      this.cam.fovRad = (63 * Math.PI) / 180;
    } else {
      this.cam.fovRad = (58 * Math.PI) / 180;
    }

    if (this.dom.modalDesc) {
      this.dom.modalDesc.textContent = this.getModalDescription();
    }
    if (this.dom.hudCanvas && this.dom.ctx2d) {
      this.dom.hudCanvas.width = window.innerWidth * dpr;
      this.dom.hudCanvas.height = window.innerHeight * dpr;
      this.dom.ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    if (this.dom.webglCanvas) {
      this.dom.webglCanvas.width = window.innerWidth * dpr;
      this.dom.webglCanvas.height = window.innerHeight * dpr;
    }
    if (this.dom.panelCanvases) {
      Object.keys(this.dom.panelCanvases).forEach((k) => {
        const c = this.dom.panelCanvases[k];
        const r = c.getBoundingClientRect();
        const w = r.width || 220;
        const h = r.height || 140;
        c.width = w * dpr;
        c.height = h * dpr;
        const ctx = c.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.panelCtxs[k] = { ctx, w, h };
      });
    }
  }

  loop(now) {
    const dt = this.lastFrameTime ? Math.min(100, now - this.lastFrameTime) : 16;
    this.lastFrameTime = now;

    const ctx = this.dom.ctx2d;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const elapsed = now - this.stateStart;

    if (this.state === 'IMPLODING') {
      ctx.fillStyle = 'rgba(3, 4, 7, 0.3)';
      ctx.fillRect(0, 0, w, h);

      let alive = 0;
      for (let i = 0; i < this.vortexParticles.length; i++) {
        const p = this.vortexParticles[i];
        if (p.dist > 2.5) {
          alive++;
          p.angle += p.vortexSpeed * (1 + 140 / (p.dist + 20));
          p.dist *= p.suction;
          p.x = this.originX + Math.cos(p.angle) * p.dist;
          p.y = this.originY + Math.sin(p.angle) * p.dist;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
      }

      if (alive < this.vortexParticles.length * 0.02 || elapsed > 1600) {
        this.state = 'SINGULARITY';
        this.stateStart = now;
      }
    } else if (this.state === 'SINGULARITY') {
      ctx.fillStyle = '#030407';
      ctx.fillRect(0, 0, w, h);

      const pulse = 4 + Math.sin(elapsed * 0.08) * 3;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.originX, this.originY, pulse, 0, Math.PI * 2);
      ctx.fill();

      if (elapsed > 300) {
        this.initNativeWebGL();
        this.onResize();
        this.audio.playBigBang();
        this.shockwaves = [{ r: 4, a: 1.0 }, { r: 1, a: 0.85 }];
        this.state = 'EXPLODING';
        this.stateStart = now;
      }
    } else if (this.state === 'EXPLODING') {
      ctx.clearRect(0, 0, w, h);
      this.syncAtomicOrigin();
      const t = Math.min(1, elapsed / 1100);
      // Toate cele 52.000 de particule WebGL țâșnesc direct din coordonatele sub-pixel ale #swarmAtomicBtn
      this.portalMix = (1 - t) ** 2.1;

      this.cam.pos.x = 0;
      this.cam.pos.y = 0;
      this.cam.pos.z = 12 + t * 42;
      this.cam.target.x = 0;
      this.cam.target.y = 0;
      this.cam.target.z = 0;
      this.cam.updateMatrix();
      this.renderWebGL(now);

      this.shockwaves.forEach((sw, idx) => {
        sw.r += 32 - idx * 9;
        sw.a *= 0.93;
        if (sw.a > 0.02) {
          ctx.strokeStyle = idx === 0 ? `rgba(0, 240, 255, ${sw.a})` : `rgba(250, 204, 21, ${sw.a})`;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(this.originX, this.originY, sw.r, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      if (t >= 1) {
        this.portalMix = 0;
        this.state = 'SWARM_LIVE';
        this.bootTime = now;
        this.frameCount = 0;
        document.body.classList.remove('swarm-imploding');
        if (this.dom.atomicBtn) {
          this.dom.atomicBtn.classList.remove('is-portal-flare');
        }
        this.dom.headerStack.classList.add('is-visible');
        this.dom.banner.classList.add('is-visible');
        this.dom.bottomHud.classList.add('is-visible');
        if (this.dom.cardDock) this.dom.cardDock.classList.add('is-visible');
        if (this.dom.hudMobileToggle) this.dom.hudMobileToggle.classList.add('is-visible');
        this.onResize();
        this.setStage(-1);
      }
    } else if (this.state === 'SWARM_LIVE') {
      this.portalMix = 0;
      this.frameCount++;

      this.dom.mTime.textContent = ((now - this.bootTime) / 1000).toFixed(2);
      this.dom.mFrame.textContent = String(this.frameCount).padStart(4, '0');

      // Dacă utilizatorul ține mouse-ul pe un card ieșit din stea sau pe o stea, înghețăm cronometrul
      // de auto-crawl pentru a putea da click liniștit pe proiect fără ca scena să sară la altă stea
      if (this.hoveredCard || this.hoveredStarIdx !== null) {
        this.stageTimer += dt;
      }

      const stageDuration = this.currentStageIdx === 3 ? 4400 : 3500;
      if (this.autoPlay && now - this.stageTimer > stageDuration) {
        if (this.currentStageIdx < 7) {
          this.setStage(this.currentStageIdx + 1);
        } else {
          this.autoPlay = false;
          this.dom.autoBtn.textContent = 'MODE: COMPLETE (FREE ROAM)';
        }
      }

      // Interpolare Sferică 360° (Yaw, Pitch, Distance) + Parallax subtil
      this.orbitYaw += (this.targetYaw - this.orbitYaw) * 0.07;
      this.orbitPitch += (this.targetPitch - this.orbitPitch) * 0.07;
      this.orbitDist += (this.targetDist - this.orbitDist) * 0.07;

      this.cam.target.x += (this.camTargetLook.x - this.cam.target.x) * 0.055;
      this.cam.target.y += (this.camTargetLook.y - this.cam.target.y) * 0.055;
      this.cam.target.z += (this.camTargetLook.z - this.cam.target.z) * 0.055;

      const effYaw = this.orbitYaw + (this.isDragging ? 0 : this.mouseNDC.x * 0.06);
      const effPitch = Math.max(
        -1.45,
        Math.min(1.45, this.orbitPitch + (this.isDragging ? 0 : -this.mouseNDC.y * 0.05))
      );

      this.cam.pos.x =
        this.cam.target.x + this.orbitDist * Math.cos(effPitch) * Math.sin(effYaw);
      this.cam.pos.y = this.cam.target.y + this.orbitDist * Math.sin(effPitch);
      this.cam.pos.z =
        this.cam.target.z + this.orbitDist * Math.cos(effPitch) * Math.cos(effYaw);

      this.cam.updateMatrix();

      this.spiderPos3D.x += (this.spiderTarget3D.x - this.spiderPos3D.x) * 0.06;
      this.spiderPos3D.y += (this.spiderTarget3D.y - this.spiderPos3D.y) * 0.06;
      this.spiderPos3D.z += (this.spiderTarget3D.z - this.spiderPos3D.z) * 0.06;

      this.spiderTrail.pop();
      this.spiderTrail.unshift({ ...this.spiderPos3D });

      this.renderWebGL(now);
      this.render2DProjection(now);
      this.updateBottomTelemetry(now);
    } else if (this.state === 'RESTORING') {
      const duration = 1680;
      const t = Math.min(1, elapsed / duration);

      // Actualizăm în timp real poziția butonului atomic (#swarmAtomicBtn) din navbar pe orice ecran
      this.syncAtomicOrigin();

      // În Actul 1 (0ms - 520ms) aspirăm întregul univers WebGL în vortex direct în #swarmAtomicBtn
      if (elapsed < 530) {
        this.portalMix = Math.min(1, (elapsed / 490) ** 1.65);
        this.orbitYaw += 0.032;
        this.cam.pos.x = this.cam.target.x + this.orbitDist * Math.sin(this.orbitYaw);
        this.cam.pos.z = this.cam.target.z + this.orbitDist * Math.cos(this.orbitYaw);
        this.cam.updateMatrix();
        this.renderWebGL(now);
      }

      // La 470ms (Masa Critică în #swarmAtomicBtn) declanșăm Actul 2 & 3: ieșirea site-ului real din buton!
      if (elapsed >= 470 && !this.restoreDomTriggered) {
        this.prepareDomEmergenceFromAtom();
      }

      ctx.clearRect(0, 0, w, h);

      const maxScreenRadius =
        Math.hypot(Math.max(this.originX, w - this.originX), Math.max(this.originY, h - this.originY)) *
        1.15;

      // --- FUNDAL & APERTURĂ PORTAL RADIAL CENTRATĂ PE #swarmAtomicBtn ---
      if (elapsed < 470) {
        // În Actul 1 păstrăm un voal cosmic semitransparent peste WebGL-ul care se comprimă în buton
        const act1T = elapsed / 470;
        ctx.fillStyle = `rgba(3, 4, 7, ${0.28 + act1T * 0.58})`;
        ctx.fillRect(0, 0, w, h);
      } else {
        // În Actele 2 și 3 deschidem o apertură radială fizică exact din (this.originX, this.originY)
        const portalT = Math.min(1, (elapsed - 470) / 1080);
        const portalEase = 1 - (1 - portalT) ** 3.2;
        const innerR = portalEase * maxScreenRadius;
        const outerR = innerR + 140 + (1 - portalT) * 90;

        if (innerR < maxScreenRadius) {
          const grad = ctx.createRadialGradient(
            this.originX,
            this.originY,
            Math.max(1, innerR * 0.88),
            this.originX,
            this.originY,
            Math.max(2, outerR)
          );
          const rimAlpha = Math.max(0, (1 - portalT) * 0.55);
          const voidAlpha = Math.max(0, (1 - portalT * 0.85) * 0.92);
          grad.addColorStop(0, 'rgba(3, 4, 7, 0)');
          grad.addColorStop(0.35, `rgba(0, 240, 255, ${rimAlpha})`);
          grad.addColorStop(0.55, `rgba(45, 212, 191, ${rimAlpha * 0.65})`);
          grad.addColorStop(1, `rgba(3, 4, 7, ${voidAlpha})`);

          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);
        }
      }

      // =========================================================================
      // ACTUL 1 (0ms – 520ms): REVERSE BIG-CRUNCH ÎN BUTONUL ATOMIC (#swarmAtomicBtn)
      // =========================================================================
      if (elapsed < 540) {
        const crunchT = Math.min(1, elapsed / 500);
        const crunchEase = crunchT * crunchT * (3 - 2 * crunchT);

        // 1A. Inele de acreție gravitațională care se strâng în #swarmAtomicBtn
        for (let ring = 0; ring < 3; ring++) {
          const rProg = ((elapsed * 0.004 + ring * 0.33) % 1);
          const ringRad = (1 - rProg) * (160 - ring * 32);
          ctx.save();
          ctx.strokeStyle =
            ring % 2 === 0
              ? `rgba(0, 240, 255, ${rProg * 0.65})`
              : `rgba(250, 204, 21, ${rProg * 0.55})`;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(this.originX, this.originY, Math.max(2, ringRad), 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // 1B. Cele 7 Stele din constelație sunt aspirate pe curbe Bézier direct în #swarmAtomicBtn
        this.restoreStarsSnapshot.forEach((st) => {
          const stLocal = Math.max(0, Math.min(1, (elapsed - st.delay) / (460 - st.delay)));
          const sEase = stLocal * stLocal;
          const inv = 1 - sEase;

          const curX = inv * inv * st.x + 2 * inv * sEase * st.cpX + sEase * sEase * this.originX;
          const curY = inv * inv * st.y + 2 * inv * sEase * st.cpY + sEase * sEase * this.originY;

          // Dâră luminoasă tip cometă spre butonul atomic
          ctx.save();
          ctx.strokeStyle = st.color;
          ctx.globalAlpha = (1 - stLocal * 0.5) * 0.75;
          ctx.lineWidth = 2.4 * (1 - stLocal * 0.6);
          ctx.beginPath();
          ctx.moveTo(st.x + (curX - st.x) * 0.55, st.y + (curY - st.y) * 0.55);
          ctx.lineTo(curX, curY);
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(curX, curY, Math.max(1.5, 6.5 * (1 - stLocal * 0.75)), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // 1C. Cardurile 3D din Swarm se îndoaie și zboară pe curbe Bézier direct în #swarmAtomicBtn
        this.restoreCardsSnapshot.forEach((card) => {
          const cLocal = Math.max(0, Math.min(1, (elapsed - card.delay) / (470 - card.delay)));
          const cEase = cLocal ** 1.85;
          const inv = 1 - cEase;

          const cx = inv * inv * card.x + 2 * inv * cEase * card.cpX + cEase * cEase * this.originX;
          const cy = inv * inv * card.y + 2 * inv * cEase * card.cpY + cEase * cEase * this.originY;
          const scale = Math.max(0.06, 1 - cEase * 0.94);

          // Filament de tractor-beam între butonul atomic și cardul aspirat
          ctx.save();
          ctx.strokeStyle = card.hasLink ? 'rgba(250, 204, 21, 0.35)' : 'rgba(0, 240, 255, 0.28)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(this.originX, this.originY);
          ctx.lineTo(cx, cy);
          ctx.stroke();

          ctx.translate(cx, cy);
          ctx.rotate(cEase * 0.65 * (card.hasLink ? 1 : -1));
          ctx.scale(scale, scale);

          const hw = card.boxW * 0.5;
          const hh = card.boxH * 0.5;
          ctx.fillStyle = 'rgba(7, 13, 25, 0.88)';
          ctx.strokeStyle = card.hasLink ? '#facc15' : card.color;
          ctx.lineWidth = 1.6;
          ctx.fillRect(-hw, -hh, card.boxW, card.boxH);
          ctx.strokeRect(-hw, -hh, card.boxW, card.boxH);
          ctx.restore();
        });

        // 1D. Păianjenul Cibernetic 3D este tras cu fire de lumină înapoi în butonul atomic
        if (this.restoreSpiderSnapshot) {
          const spX =
            this.restoreSpiderSnapshot.x +
            (this.originX - this.restoreSpiderSnapshot.x) * crunchEase;
          const spY =
            this.restoreSpiderSnapshot.y +
            (this.originY - this.restoreSpiderSnapshot.y) * crunchEase;
          const spScale = Math.max(0.1, 1 - crunchEase * 0.9);

          ctx.save();
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(this.originX, this.originY);
          ctx.lineTo(spX, spY);
          ctx.stroke();

          ctx.fillStyle = '#00f0ff';
          ctx.beginPath();
          ctx.arc(spX, spY, 5.5 * spScale, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // =========================================================================
      // ACTUL 2 (420ms – 880ms): ANAMORPHIC QUANTUM LENS FLARE ÎN #swarmAtomicBtn
      // =========================================================================
      if (elapsed >= 420 && elapsed <= 920) {
        const flareT = (elapsed - 420) / 500;
        const flareIntensity = Math.sin(Math.min(1, flareT) * Math.PI);

        if (flareIntensity > 0.02) {
          ctx.save();
          // Rază orizontală anamorfică de cinema (Cyan + Miez Alb)
          const streakW = (180 + flareIntensity * 460) * (w < 768 ? 0.65 : 1);
          const hGrad = ctx.createLinearGradient(
            this.originX - streakW,
            this.originY,
            this.originX + streakW,
            this.originY
          );
          hGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
          hGrad.addColorStop(0.35, `rgba(0, 240, 255, ${flareIntensity * 0.65})`);
          hGrad.addColorStop(0.5, `rgba(255, 255, 255, ${flareIntensity * 0.98})`);
          hGrad.addColorStop(0.65, `rgba(45, 212, 191, ${flareIntensity * 0.65})`);
          hGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');

          ctx.fillStyle = hGrad;
          ctx.fillRect(this.originX - streakW, this.originY - 2.5, streakW * 2, 5);

          // Rază verticală de singularitate
          const streakH = 90 + flareIntensity * 190;
          const vGrad = ctx.createLinearGradient(
            this.originX,
            this.originY - streakH,
            this.originX,
            this.originY + streakH
          );
          vGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
          vGrad.addColorStop(0.5, `rgba(255, 255, 255, ${flareIntensity * 0.9})`);
          vGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');

          ctx.fillStyle = vGrad;
          ctx.fillRect(this.originX - 2, this.originY - streakH, 4, streakH * 2);

          // Inele giroscopice cuantice în jurul butonului atomic
          ctx.translate(this.originX, this.originY);
          ctx.rotate(elapsed * 0.008);
          ctx.strokeStyle = `rgba(0, 240, 255, ${flareIntensity * 0.85})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(0, 0, 24 + flareIntensity * 42, 10 + flareIntensity * 16, 0.4, 0, Math.PI * 2);
          ctx.stroke();

          ctx.rotate(-elapsed * 0.016);
          ctx.strokeStyle = `rgba(250, 204, 21, ${flareIntensity * 0.8})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, 22 + flareIntensity * 38, 9 + flareIntensity * 14, -0.5, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }

      // =========================================================================
      // ACTUL 3 (470ms – 1680ms): PROIECȚIE LASER HOLOGRAFICĂ & DEPLIERE 3D A PAGINII
      // =========================================================================
      if (elapsed >= 470) {
        // 3A. Unde de șoc concentrice care împing pagina în afară din #swarmAtomicBtn
        this.restoreShockwaves.forEach((sw) => {
          if (elapsed < sw.delay) return;
          sw.r += sw.speed;
          sw.a *= 0.945;
          if (sw.a > 0.02) {
            ctx.strokeStyle = `rgba(${sw.color}, ${sw.a})`;
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.arc(this.originX, this.originY, sw.r, 0, Math.PI * 2);
            ctx.stroke();
          }
        });

        // 3B. Pachete Holografice Wireframe & Conuri de Proiecție Laser către fiecare secțiune/card DOM
        this.restoreDomBlocks.forEach((blk) => {
          const localElapsed = elapsed - 485 - blk.delayMs;
          if (localElapsed <= 0) return;

          const bDur = 820;
          const bt = Math.min(1, localElapsed / bDur);
          if (bt >= 1) return;

          // Curba de depliere cu ușor overshoot elastic
          const easeOut = 1 - (1 - bt) ** 3.1;
          const inv = 1 - easeOut;

          const curCX =
            inv * inv * this.originX + 2 * inv * easeOut * blk.cpX + easeOut * easeOut * blk.cx;
          const curCY =
            inv * inv * this.originY + 2 * inv * easeOut * blk.cpY + easeOut * easeOut * blk.cy;

          const curW = 8 + (blk.w - 8) * easeOut;
          const curH = 6 + (blk.h - 6) * easeOut;
          const left = curCX - curW * 0.5;
          const top = curCY - curH * 0.5;

          const alpha = bt < 0.65 ? Math.min(1, bt * 2.4) : Math.max(0, (1 - bt) / 0.35);

          ctx.save();
          // Con volumetric de proiecție laser din #swarmAtomicBtn către colțurile cardului DOM în zbor
          if (bt < 0.88) {
            const beamAlpha = alpha * 0.22;
            ctx.fillStyle = blk.color;
            ctx.globalAlpha = beamAlpha * 0.35;
            ctx.beginPath();
            ctx.moveTo(this.originX, this.originY);
            ctx.lineTo(left, top);
            ctx.lineTo(left + curW, top);
            ctx.closePath();
            ctx.fill();

            ctx.globalAlpha = alpha * 0.55;
            ctx.strokeStyle = blk.color;
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(this.originX, this.originY);
            ctx.lineTo(left, top);
            ctx.moveTo(this.originX, this.originY);
            ctx.lineTo(left + curW, top);
            ctx.moveTo(this.originX, this.originY);
            ctx.lineTo(left + curW, top + curH);
            ctx.stroke();
          }

          // Cadrul Holografic Wireframe care îmbracă elementul DOM real în timp ce iese din buton
          ctx.globalAlpha = alpha * 0.85;
          ctx.strokeStyle = blk.color;
          ctx.lineWidth = 1.6;
          ctx.strokeRect(left, top, curW, curH);

          // Colțare de Target-Lock [ ⌖ ] pe colțurile secțiunii proiectate
          const cLen = Math.min(18, curW * 0.18, curH * 0.28);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          // Stânga-Sus
          ctx.moveTo(left, top + cLen);
          ctx.lineTo(left, top);
          ctx.lineTo(left + cLen, top);
          // Dreapta-Sus
          ctx.moveTo(left + curW - cLen, top);
          ctx.lineTo(left + curW, top);
          ctx.lineTo(left + curW, top + cLen);
          // Stânga-Jos
          ctx.moveTo(left, top + curH - cLen);
          ctx.lineTo(left, top + curH);
          ctx.lineTo(left + cLen, top + curH);
          // Dreapta-Jos
          ctx.moveTo(left + curW - cLen, top + curH);
          ctx.lineTo(left + curW, top + curH);
          ctx.lineTo(left + curW, top + curH - cLen);
          ctx.stroke();

          // Bară laser de scanare orizontală care materializează cardul/secțiunea HTML
          const scanY = top + ((bt * 1.45) % 1) * curH;
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(left, scanY);
          ctx.lineTo(left + curW, scanY);
          ctx.stroke();

          if (curW > 110 && curH > 32) {
            ctx.fillStyle = blk.color;
            ctx.font = '700 9px "JetBrains Mono", monospace';
            ctx.fillText(blk.codeLabel, left + 8, top + 13);
          }
          ctx.restore();
        });

        // 3C. Jet spiralat de particule cuantice care țâșnesc din #swarmAtomicBtn și se așază în pagină
        const streamT = Math.min(1, (elapsed - 470) / 1050);
        const streamEase = 1 - (1 - streamT) ** 3;
        const spinOffset = (1 - streamEase) ** 1.75 * Math.PI * 2.4;
        const particleAlpha = streamT < 0.7 ? 0.92 : Math.max(0, (1 - streamT) / 0.3);

        if (particleAlpha > 0.02) {
          ctx.save();
          ctx.globalAlpha = particleAlpha;
          for (let i = 0; i < this.vortexParticles.length; i += 2) {
            const p = this.vortexParticles[i];
            const curDist = (p.homeDist || 140) * streamEase;
            const curAngle = (p.homeAngle || 0) + spinOffset * (i % 4 === 0 ? 1 : -0.85);
            const cx = this.originX + Math.cos(curAngle) * curDist;
            const cy = this.originY + Math.sin(curAngle) * curDist;
            ctx.fillStyle = p.color;
            ctx.fillRect(cx, cy, p.size, p.size);
          }
          ctx.restore();
        }
      }

      if (t >= 1) {
        ctx.clearRect(0, 0, w, h);
        this.portalMix = 0;
        this.clearRestoreEmergeClasses();
        document.body.classList.remove(
          'swarm-imploding',
          'swarm-consumed',
          'swarm-crunching',
          'swarm-restoring'
        );
        if (this.dom.webglCanvas) {
          this.dom.webglCanvas.classList.remove('is-restoring', 'is-imploding-to-atom');
        }
        if (this.dom.atomicBtn) {
          this.dom.atomicBtn.classList.remove('is-portal-flare');
        }
        this.dom.root.classList.remove('is-active');
        this.state = 'IDLE';
        cancelAnimationFrame(this.rafId);
        this.rafId = null;

        window.dispatchEvent(new CustomEvent('swarm:resume-bg'));
        return;
      }
    }

    this.rafId = requestAnimationFrame(this.loop);
  }

  registerTerminalCommand() {
    window.launchSwarmSingularity = () => {
      this.openBatteryWarning();
      return '[SWARM_ENGINE] Initializing 3D Deep-Space Singularity... Check viewport.';
    };
  }
}