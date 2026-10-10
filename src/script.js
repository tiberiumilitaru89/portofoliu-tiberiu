"use strict";
/**
 * script.js - Portofoliu & CV Militaru Tiberiu Nicolae
 * Arhitectură modulară, securizată, optimizată pentru performanță & Vercel
 */

document.addEventListener('DOMContentLoaded', () => {
    // Idempotent initialization guard (prevents duplicate listeners on reload/hot-reload/test runners)
    if (typeof window !== 'undefined' && window.__portfolioInitialized) return;
    if (typeof window !== 'undefined') window.__portfolioInitialized = true;

    // Safe storage helper with in-memory fallback (prevents SecurityError on file:/// origin or private browsing)
    const memCache = {};
    const SafeStorage = {
        get(key, fallback = null) {
            try {
                if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage !== null) {
                    const val = window.localStorage.getItem(key);
                    return val !== null ? val : fallback;
                }
            } catch (e) {
                // Storage blocked or opaque origin (file:///)
            }
            return key in memCache ? memCache[key] : fallback;
        },
        set(key, value) {
            try {
                if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage !== null) {
                    window.localStorage.setItem(key, value);
                    return;
                }
            } catch (e) {
                // Storage blocked or opaque origin (file:///)
            }
            memCache[key] = String(value);
        }
    };

    // Hoisted module declarations (eliminates Temporal Dead Zone cross-module dependencies)
    let I18nModule = null;
    let ThemeModule = null;
    let TypingModule = null;
    let ThreeDParticleUniverseModule = null;
    let NavModule = null;
    let StatsModule = null;
    let TerminalModule = null;
    let ProjectFilterModule = null;
    let ModalModule = null;
    let ToastModule = null;
    let ContactFormModule = null;
    let PrintCvModule = null;

    // ==========================================================================
    // 1. DICTIONAR BILINGV (Internationalization - i18n)
    // ==========================================================================
    I18nModule = (() => {
        const translations = {
            ro: {
                // Header & Nav
                nav_home: "Acasă",
                nav_services: "Servicii",
                nav_about: "Despre Mine",
                nav_projects: "Portofoliu",
                nav_skills: "Competențe",
                nav_experience: "Experiență",
                nav_terminal: "Terminal",
                nav_contact: "Contact",
                nav_btn_cv: "CV PDF",
                btn_print_cv: "Descarcă CV (PDF)",

                // Hero
                hero_status: "Disponibil pentru Proiecte & Colaborări",
                hero_title: "IT Consultant • Full-Stack Solutions",
                hero_greeting: "Salut! Sunt",
                hero_focus_label: "Ce dezvolt:",
                hero_bio: "Dezvolt <strong>aplicații web scalabile, platforme SaaS și sisteme CRM</strong> folosind React, Node.js și baze de date SQL. Ofer <strong>arhitectură software, automatizări de procese și consultanță IT dedicată</strong>, transformând cerințele tale de afaceri în soluții digitale sigure, rapide și funcționale 24/7.",
                pill_mvp: "MVP & SaaS Development",
                pill_crm: "Sisteme CRM & Automatizări",
                pill_db: "Arhitectură Baze de Date (SQL)",
                pill_consulting: "Consultanță IT & Suport",
                btn_talk: "Hai să vorbim pe WhatsApp",
                btn_download_cv: "Descarcă CV (PDF)",
                btn_view_projects: "Vezi Proiectele",
                btn_cli: "Terminal CLI",

                // Profile Card
                profile_card_role: "IT Consultant & Soluții Software",
                stat_exp_short: "Ani Experiență",
                stat_uptime_short: "Uptime & Fiabilitate",
                stat_delivery_short: "Soluții Dedicate",

                // Servicii
                serv_badge: "Servicii & Soluții la Cheie",
                serv_title: "Cu Ce Te Pot Ajuta?",
                serv_subtitle: "Fie că ai nevoie de un MVP pentru lansarea unei idei, de o platformă SaaS scalabilă, de un CRM dedicat sau de optimizarea bazelor de date, îți ofer soluții clare și robuste.",
                s1_title: "Aplicații Web, MVP & Platforme SaaS",
                s1_desc: "De la idee la primul produs lansat pe piață (MVP), magazine online sau platforme SaaS complexe construite cu React și Node.js. Arată impecabil pe telefon, au arhitectură scalabilă și convertesc vizitatorii în clienți.",
                s1_pt1: "Arhitectură modernă React, Node.js & REST APIs",
                s1_pt2: "Design 100% responsive & performanță ultra-rapidă",
                s1_pt3: "Integrare plăți online, autentificare securizată & webhooks",

                s2_title: "Baze de Date, Arhitectură & Backend Sigur",
                s2_desc: "Proiectez și optimizez infrastructuri de date (PostgreSQL, MySQL, MS SQL) și servicii backend securizate, capabile să susțină fluxuri mari de date și tranzacții concurente cu înaltă disponibilitate și reziliență.",
                s2_pt1: "Modelare scheme relaționale & constrângeri de integritate",
                s2_pt2: "Optimizare interogări SQL complexe, indexare structurală și timpi minimi de latență",
                s2_pt3: "Politici riguroase de securitate, indexare și backup automat",

                s3_title: "Sisteme CRM & Automatizări de Procese",
                s3_desc: "Elimin munca manuală repetitivă și riscul de erori umane. Dezvolt soluții CRM pe măsură pentru companii și meseriași, alături de automatizări inteligente de fluxuri, generare documente și sincronizare de date.",
                s3_pt1: "Platforme CRM dedicate (alocare sarcini, comenzi, tehnicieni pe teren)",
                s3_pt2: "Generare automată de rapoarte, facturi și documente PDF complexe",
                s3_pt3: "Sincronizare automată între Excel, baze de date și servicii terțe",

                s4_title: "Consultanță IT, Diagnoză & Mentenanță",
                s4_desc: "Consultanță tehnică independentă și suport pragmatic. Te ajut să alegi soluțiile hardware și software optime fără bugete irosite, asigur diagnostic precis, securizare și mentenanță proactivă.",
                s4_pt1: "Consultanță de arhitectură & selecție stack tehnologic",
                s4_pt2: "Diagnosticare hardware, rețele locale & depanare incidente critice",
                s4_pt3: "Mentenanță preventivă și suport dedicat pentru stabilitate 24/7",

                // Despre Mine
                about_badge: "Profil Profesional & Viziune",
                about_title: "Cine Sunt și Cum Lucrez",
                about_p1: "Sunt un <strong>consultant IT și dezvoltator cu orientare pragmatică spre rezultate de business</strong>, îmbinând formarea superioară în management cu expertiza practică acumulată în peste 5 ani de menținere a sistemelor critice. În prezent, îmi consolidez cunoștințele de algoritmi, structuri de date și programare orientată pe obiecte (C#, C++) ca <strong>Analist Programator (Nivel 5)</strong> la <strong>Colegiul Tehnic „Elie Radu” din Ploiești</strong>.",
                about_p2: "În activitatea mea am văzut cât de mult costă o pană de sistem sau un proces operațional blocat în hârtii. De aceea, abordarea mea este una <strong>pragmatică și orientată spre soluții</strong>: ascult nevoile tale, explic opțiunile în cuvinte simple și construiesc sisteme fiabile, sigure și concepute pentru disponibilitate continuă.",
                h1_title: "Orientat pe Rezultate",
                h1_desc: "Fiecare linie de cod sau piesă hardware montată are un scop clar: să economisească timp și bani.",
                h2_title: "Comunicare Transparentă",
                h2_desc: "Fără jargon tehnic inutil. Știi întotdeauna stadiul lucrărilor și ce soluții sunt cele mai bune.",
                stats_card_title: "Cifre & Indicatori de Performanță",
                stat_exp_lbl: "Ani Experiență IT & Suport Sisteme",
                stat_uptime_lbl: "Disponibilitate Continuă pe Sisteme de Baze de Date",
                stat_perf_lbl: "Optimizare & Accelerare Interogări SQL",
                stat_tech_lbl: "Tehnologii, Limbaje & Baze de Date Stăpânite",
                stats_quote: "„Securitatea, viteza și simplitatea în utilizare nu sunt opționale.”",

                // Proiecte
                proj_badge: "Studii de Caz & Soluții Livrate",
                proj_title: "Proiecte Web & Aplicații",
                proj_subtitle: "Iată câteva exemple concrete de soluții software construite pentru a automatiza fluxuri, vinde online și gestiona comenzi în timp real.",
                filter_all: "Toate",
                filter_saas: "SaaS & Cloud Apps",
                filter_ecommerce: "E-Commerce & Live Web",
                filter_crm: "Sisteme CRM & B2B",
                filter_civic: "Civic Tech & Platforme Publice",
                proj1_tag: "SaaS, CSP Strict & Microservicii Serverless",
                proj1_title: "CV Builder Pro & ATS Analyzer (SaaS)",
                proj1_summary: "Platformă SaaS de redactare CV și analiză ATS în timp real, cu randare vectorială PDF pe microservicii serverless (Node 22 Puppeteer) ranforsate anti-SSRF/XSS, Content Security Policy strictă fără 'unsafe-inline', mutație Zero-Trust DOM (replaceChildren), zero stiluri inline, logging structurat JSON cu ID de corelare și procesare plăți prin Stripe Webhooks.",
                proj2_tag: "Aplicație Web & E-Commerce Real-Time",
                proj2_title: "Magazin Online cu Chat Live (Florărie)",
                proj2_summary: "Aplicație web completă pentru o florărie locală, dezvoltată pe arhitectură MVC decuplată. Include catalog dinamic de produse, coș de cumpărături securizat cu validare strictă și modul de Live Chat în timp real bazat pe WebSockets pentru asistență instantanee și conversii crescute pe mobile.",
                proj3_tag: "Sistem CRM Enterprise, Zero-Any & Baze Relaționale",
                proj3_title: "Aplicație CRM & Gestiune Servicii (Instalbloc)",
                proj3_summary: "Platformă enterprise dedicată firmelor de instalații sanitare și intervenții tehnice. Re-arhitecturată la standarde Zero-Defect: 100% Zero-any type safety cu regulă fatală ESLint, barieră mecanică Gatekeeper (tsc & eslint max-warnings 0), cron automat de triaj și alerte SLA (/api/cron/check-sla), logging forensic structurat JSON cu mascare automată PII și persistență Drizzle ORM pe SQLite/LibSQL cu izolare pe asociație.",
                proj4_tag: "Civic Tech, Audit Urban & Securitate Zero-Trust",
                proj4_title: "Platformă Civică & Audit Urban (Viziune Urbană Ploiești)",
                proj4_summary: "Platformă civică Full-Stack (Next.js 15, TypeScript Zero-Any, Supabase PostgreSQL & Storage) dedicată auditului tehnic și reabilitării blocurilor din Ploiești. Include portal public de urmărire dosare (/status) cu stepper FSM în 5 pași și căutare DOSAR-PH-XXX, panou admin cu 6 secțiuni, upload securizat imagini, generator fișe avizier A4, exporturi ANAF Formular 230 (CSV BOM), sesiuni server HMAC-SHA256 timingSafeEqual, barieră mecanică Gatekeeper, pipeline tranzacțional Resend DKIM/SPF și guvernare OKF.",
                proj5_tag: "Arhitectură Zero-Defect & Audit Red-Team",
                proj5_title: "Portofoliu Tiberiu & Universal 3D Engine",
                proj5_summary: "Platformă web ultra-performantă (Vite, Three.js, Vanilla ES6+), proiectată pe standarde Zero-Defect: Content Security Policy strictă fără 'unsafe-inline', mutație Zero-Trust DOM (replaceChildren), separare absolută CSS/JS fără stiluri inline, univers 3D interactiv pe GPU, terminal CLI sandboxat, barieră mecanică Gatekeeper și documentare OKF.",
                btn_details: "Detalii Tehnice",
                proj_cta_text: "Ai o idee de proiect sau vrei să optimizezi un flux de lucru existent?",
                proj_cta_btn: "Discută Proiectul Tău pe WhatsApp",

                // Competențe
                skills_badge: "Stack Tehnologic & Unelte",
                skills_title: "Competențe & Tehnologii",
                skills_subtitle: "O privire completă asupra tehnologiilor folosite în dezvoltarea frontend, arhitectura backend, administrarea bazelor de date și mentenanța hardware.",
                cat_front_title: "Dezvoltare Frontend & UI",
                cat_front_sub: "Interfețe moderne, responsive & intuitive",
                cat_back_title: "Backend & Baze de Date",
                cat_back_sub: "Arhitecturi rapide, securizate & scalabile",
                cat_hw_title: "Hardware, Suport & Mentenanță",
                cat_hw_sub: "Continuitate operațională & infrastructură",
                cat_devops_title: "DevOps, Limbaje OOP & Unelte",
                cat_devops_sub: "Fluxuri de lucru profesionale & automatizate",
                lang_box_title: "Limbi Străine Vorbite",
                lang_ro_lvl: "Nativ",
                lang_en_lvl: "C1 (Avansat / Fluent profesional)",
                lang_de_lvl: "B2 (Mediu-Superior)",

                // Experiență
                exp_badge: "Evoluție Profesională",
                exp_title: "Experiență & Educație",
                exp_subtitle: "Un parcurs solid format din responsabilități reale în sisteme critice, completat de studii riguroase de programare și management.",
                exp1_period: "Ianuarie 2026 – Prezent",
                exp1_role: "Administrator Baze de Date (DBA)",
                exp1_d1: "Administrez și optimizez baze de date de producție (PostgreSQL, MySQL) pentru peste 200 de utilizatori activi, asigurând integritate și disponibilitate continuă a serviciilor.",
                exp1_d2: "Am refăcut strategiile de indexare și optimizare a interogărilor SQL complexe, reducând timpii medii de execuție cu 40%.",
                exp1_d3: "Asigur proiectarea schemelor relaționale pentru noi module funcționale, monitorizarea proactivă și rezolvarea anomaliilor în timp real.",
                exp2_role: "Asistent Manager & Coordonator Digitalizare",
                exp2_d1: "Am condus digitalizarea fluxurilor de documente interne pentru o echipă de peste 50 de angajați.",
                exp2_d2: "Am proiectat și implementat un sistem intern de gestiune a sarcinilor care a redus timpul de procesare cu 30%.",
                exp2_d3: "Am negociat contracte de mentenanță IT și am coordonat partenerii externi pentru upgrade-uri de sistem.",
                exp3_role: "Tehnician IT (Suport Nivel 1 și 2)",
                exp3_d1: "Am întreținut și monitorizat infrastructura hardware și software a unui sistem feroviar național (300+ utilizatori activi).",
                exp3_d2: "Am efectuat analize root-cause (RCA) pentru defecțiuni, reducând timpul mediu de rezolvare a incidentelor critice cu 25%.",
                exp3_d3: "Am colaborat direct cu echipele de dezvoltare software pentru raportarea bug-urilor și aplicarea patch-urilor de securitate.",
                edu1_period: "Septembrie 2025 – Prezent",
                edu1_title: "Studii Analist Programator (Nivel 5)",
                edu1_desc: "Specializare axată pe Programare Orientată pe Obiecte (C#, C++), Structuri de Date & Algoritmi, Arhitecturi Baze de Date Relaționale (SQL) și Dezvoltare Web Full-Stack (HTML5, React.js, Node.js).",
                edu2_title: "Master & Licență în Management",
                edu2_desc: "Specializare în Managementul Performanței, Optimizarea Sistemelor și Arhitecturi de Control în IMM-uri.",

                // Terminal
                term_badge: "Consolă Interactivă",
                term_title: "Terminal CLI v3.0",
                term_subtitle: "Preferi linia de comandă? Scrie help pentru a explora profilul sau încearcă matrix pentru o ploaie digitală!",

                // Contact
                contact_badge: "Contact Rapid",
                contact_title: "Hai Să Colaborăm!",
                contact_subtitle: "Ai o întrebare, vrei un site nou sau ai nevoie de o mână de ajutor cu un sistem sau o bază de date? Sunt la doar un mesaj distanță.",
                contact_direct_title: "Informații Directe",
                contact_direct_desc: "Îmi poți scrie direct pe WhatsApp pentru un răspuns rapid sau trimite un email. Pe PC se va deschide WhatsApp Web / clientul tău de mail, iar pe telefon se deschid aplicațiile native.",
                contact_loc_label: "Locație & Disponibilitate",
                contact_loc_val: "Ploiești, Prahova / Remote (Național)",
                contact_social_label: "Rețele & Repozitorii:",
                form_title: "Trimite un Mesaj Direct",
                form_sub: "Completează formularul și vei primi un răspuns în maxim 24 de ore.",
                form_name_label: "Numele Tău",
                form_email_label: "Adresa de Email",
                form_type_label: "Despre ce este vorba?",
                opt_web: "Dezvoltare MVP / Platformă SaaS / Aplicație Web",
                opt_auto: "Sistem CRM / Automatizări de Procese",
                opt_db: "Arhitectură Baze de Date & Optimizare SQL",
                opt_hw: "Consultanță IT & Mentenanță Tehnică",
                opt_other: "Alte Întrebări / Proiect Personalizat",
                form_msg_label: "Mesajul Tău",
                btn_send_msg: "Trimite Mesajul",
                form_security_notice: "Datele tale sunt în siguranță și nu vor fi divulgate terților.",

                // Footer & Modal
                footer_tagline: "Soluții web moderne, baze de date sigure și suport tehnic de încredere.",
                footer_rights: "Toate drepturile rezervate.",
                btn_view_repo: "Vezi pe GitHub",
                btn_close: "Închide",
                footer_qr: "Scanează pentru a distribui",
                floating_whatsapp_label: "Discută pe WhatsApp",
                floating_whatsapp_aria: "Contactează-mă direct pe WhatsApp"
            },
            en: {
                // Header & Nav
                nav_home: "Home",
                nav_services: "Services",
                nav_about: "About Me",
                nav_projects: "Portfolio",
                nav_skills: "Skills",
                nav_experience: "Experience",
                nav_terminal: "Terminal",
                nav_contact: "Contact",
                nav_btn_cv: "CV PDF",
                btn_print_cv: "Download CV (PDF)",

                // Hero
                hero_status: "Available for Projects & Collaboration",
                hero_title: "IT Consultant • Full-Stack Solutions",
                hero_greeting: "Hi! I'm",
                hero_focus_label: "What I build:",
                hero_bio: "I build <strong>scalable web applications, SaaS platforms, and custom CRM systems</strong> using React, Node.js, and SQL databases. I provide <strong>software architecture, process automation, and dedicated IT consulting</strong>, turning your business requirements into secure, high-performance digital solutions running 24/7.",
                pill_mvp: "MVP & SaaS Development",
                pill_crm: "Custom CRM & Automations",
                pill_db: "Database Architecture (SQL)",
                pill_consulting: "IT Consulting & Support",
                btn_talk: "Let's Talk on WhatsApp",
                btn_download_cv: "Download CV (PDF)",
                btn_view_projects: "View Projects",
                btn_cli: "Terminal CLI",

                // Profile Card
                profile_card_role: "IT Consultant & Software Solutions",
                stat_exp_short: "Years Experience",
                stat_uptime_short: "Uptime & Reliability",
                stat_delivery_short: "Custom Solutions",

                // Servicii
                serv_badge: "End-to-End Solutions",
                serv_title: "How Can I Help You?",
                serv_subtitle: "Whether you need a rapid MVP to validate your concept, a scalable SaaS platform, a tailored CRM, or database tuning, I deliver clear, robust technical solutions.",
                s1_title: "Web Apps, MVP & SaaS Platforms",
                s1_desc: "From concept to first deployed product (MVP), online stores, or complex SaaS platforms engineered with React and Node.js. Mobile-first, architecturally scalable, and built to convert users.",
                s1_pt1: "Modern React, Node.js & REST API architecture",
                s1_pt2: "100% responsive design & blazing fast performance",
                s1_pt3: "Online payment processing, secure authentication & webhooks",

                s2_title: "Secure Backend & Database Architecture",
                s2_desc: "The backbone of high-traffic digital products. I design relational schemas (PostgreSQL, MySQL, MS SQL) and secure backend services capable of handling concurrent transactions with high availability and resilience.",
                s2_pt1: "Relational schema design & data integrity constraints",
                s2_pt2: "Complex SQL query optimization, structural indexing, and low-latency performance",
                s2_pt3: "Strict security practices, smart indexing & automated backups",

                s3_title: "Custom CRM & Process Automation",
                s3_desc: "Eliminate repetitive paperwork and human error. I build custom CRM software for field teams and service contractors, alongside smart document generators and spreadsheet synchronization.",
                s3_pt1: "Tailored CRM suites (order triage, technician scheduling, field workflows)",
                s3_pt2: "Automated generation of invoices, technical reports, and dynamic PDFs",
                s3_pt3: "Automated synchronization between spreadsheets, databases, and third-party APIs",

                s4_title: "IT Consulting, Diagnostics & Maintenance",
                s4_desc: "Pragmatic, vendor-neutral technology consulting. I help you choose the right software and hardware architectures without bloated budgets, ensuring thorough diagnosis, security, and continuous support.",
                s4_pt1: "Architecture consulting & technology stack selection",
                s4_pt2: "Hardware diagnostic, local networks & swift incident resolution",
                s4_pt3: "Preventive maintenance and dedicated support for 24/7 reliability",

                // Despre Mine
                about_badge: "Professional Background & Vision",
                about_title: "Who I Am & How I Work",
                about_p1: "I am an <strong>IT consultant and software developer with a pragmatic focus on business outcomes</strong>, combining higher education in management with 5+ years of hands-on experience maintaining critical enterprise systems. Currently consolidating my knowledge of algorithms, data structures, and object-oriented programming (C#, C++) as a <strong>Programmer Analyst (Level 5)</strong> at the <strong>'Elie Radu' Technical College</strong>.",
                about_p2: "Throughout my career, I've seen firsthand how costly system downtime and paperwork bottlenecks can be. That's why my approach is <strong>pragmatic and results-driven</strong>: I listen to your exact needs, explain solutions in plain language, and build systems engineered for continuous availability and operational safety.",
                h1_title: "Results-Oriented",
                h1_desc: "Every line of code and hardware component configured serves a single purpose: saving time and money.",
                h2_title: "Clear Communication",
                h2_desc: "No unnecessary technical jargon. You always know the status of your project and which options suit you best.",
                stats_card_title: "Key Performance Indicators",
                stat_exp_lbl: "Years in IT Systems & Infrastructure",
                stat_uptime_lbl: "Continuous High Availability on Production DBs",
                stat_perf_lbl: "SQL Query Performance Tuning & Acceleration",
                stat_tech_lbl: "Technologies, Languages & DBs Mastered",
                stats_quote: "“Security, speed, and ease of use are never optional.”",

                // Proiecte
                proj_badge: "Case Studies & Live Projects",
                proj_title: "Web Projects & Applications",
                proj_subtitle: "Here are real-world software solutions built to automate workflows, sell online, and manage service requests in real time.",
                filter_all: "All",
                filter_saas: "SaaS & Cloud Apps",
                filter_ecommerce: "E-Commerce & Live Web",
                filter_crm: "CRM Systems & B2B",
                filter_civic: "Civic Tech & Public Platforms",
                proj1_tag: "SaaS, Hardened CSP & Serverless Microservices",
                proj1_title: "CV Builder Pro & ATS Analyzer (SaaS)",
                proj1_summary: "Production SaaS resume builder and real-time ATS scoring engine with vector PDF microservices on Node 22 Puppeteer hardened against SSRF/XSS, strict Content Security Policy without 'unsafe-inline', Zero-Trust DOM mutations (replaceChildren), zero dynamic inline styling, structured JSON logging with correlation IDs, and automated Stripe billing.",
                proj2_tag: "Web Application & Real-Time E-Commerce",
                proj2_title: "Online Store with Live Chat (Florist)",
                proj2_summary: "Full-scale e-commerce web application for a local florist built with decoupled MVC architecture. Features real-time WebSockets live chat, dynamic product catalogs, and secure checkout to drive mobile sales conversions.",
                proj3_tag: "Enterprise CRM, Zero-Any & Relational Databases",
                proj3_title: "Service Management & CRM Tool (Instalbloc)",
                proj3_summary: "Enterprise field service CRM for plumbing contractors. Hardened to Zero-Defect standards: 100% Zero-any type safety, mechanical Gatekeeper barrier (tsc & eslint 0 warnings), automated SLA violation cron dispatcher (/api/cron/check-sla), structured forensic JSON logging with PII masking, and Drizzle ORM over LibSQL/SQLite.",
                proj4_tag: "Civic Tech, Urban Audit & Zero-Trust Security",
                proj4_title: "Civic Platform & Urban Audit (Viziune Urbană Ploiești)",
                proj4_summary: "Full-Stack civic platform built with Next.js 15, Zero-Any TypeScript, and Supabase (PostgreSQL & Storage). Features a public dossier tracker (/status) with a 5-step visual FSM stepper, 6-module admin dashboard, secure image storage pipeline, official A4 noticeboard sheet generator, ANAF Form 230 collective borderou CSV export (UTF-8 BOM), timing-safe HMAC-SHA256 server sessions, and verified Resend DKIM/SPF email.",
                proj5_tag: "Zero-Defect Architecture & Red-Team Audit",
                proj5_title: "Tiberiu Portfolio & Universal 3D Engine",
                proj5_summary: "Ultra-fast portfolio platform (Vite, Three.js, Vanilla ES6+) built on Zero-Defect principles: strict Content Security Policy without 'unsafe-inline', zero dynamic inline styling, Zero-Trust DOM mutations (replaceChildren), interactive GPU particle universe, sandboxed CLI terminal, mechanical Gatekeeper build barrier, and Open Knowledge Format (OKF) governance.",
                btn_details: "Technical Details",
                proj_cta_text: "Have a project idea or want to optimize an existing workflow?",
                proj_cta_btn: "Discuss Your Project on WhatsApp",

                // Competențe
                skills_badge: "Tech Stack & Tooling",
                skills_title: "Skills & Technologies",
                skills_subtitle: "A detailed breakdown of my tech stack across frontend development, backend architecture, database administration, and hardware maintenance.",
                cat_front_title: "Frontend & UI Engineering",
                cat_front_sub: "Modern, responsive & user-friendly interfaces",
                cat_back_title: "Backend & Databases",
                cat_back_sub: "Fast, resilient & scalable server architectures",
                cat_hw_title: "Hardware, Support & Maintenance",
                cat_hw_sub: "Operational reliability & infrastructure care",
                cat_devops_title: "DevOps, OOP & Workflow Tools",
                cat_devops_sub: "Professional code management & CI/CD",
                lang_box_title: "Languages Spoken",
                lang_ro_lvl: "Native",
                lang_en_lvl: "C1 (Advanced / Professional Fluency)",
                lang_de_lvl: "B2 (Upper Intermediate)",

                // Experiență
                exp_badge: "Career Milestones",
                exp_title: "Experience & Education",
                exp_subtitle: "A solid track record of enterprise responsibilities backed by academic foundations in computer analysis and management.",
                exp1_period: "January 2026 – Present",
                exp1_role: "Database Administrator (DBA)",
                exp1_d1: "Administer and tune production databases (PostgreSQL, MySQL) for 200+ active users, ensuring high data integrity and continuous availability.",
                exp1_d2: "Redesigned indexing strategies and optimized complex SQL queries, decreasing average execution latency by 40%.",
                exp1_d3: "Lead relational schema design for new features, proactive monitoring, and real-time anomaly debugging.",
                exp2_role: "Assistant Manager & Digitalization Lead",
                exp2_d1: "Spearheaded digital transformation of internal document workflows for a 50+ person company.",
                exp2_d2: "Designed an internal task management system that reduced administrative turnaround times by 30%.",
                exp2_d3: "Negotiated IT maintenance contracts and coordinated vendor partnerships for seamless infrastructure upgrades.",
                exp3_role: "IT System Technician (Tier 1 & 2)",
                exp3_d1: "Maintained hardware/software infrastructure for a national railway system supporting 300+ concurrent users.",
                exp3_d2: "Executed Root Cause Analysis (RCA) on critical failures, cutting mean incident resolution time by 25%.",
                exp3_d3: "Collaborated directly with software dev teams on systematic bug reporting and critical security patching.",
                edu1_period: "September 2025 – Present",
                edu1_title: "Programmer Analyst Studies (Level 5)",
                edu1_desc: "Core curriculum focused on Object-Oriented Programming (C#, C++), Data Structures & Algorithms, Relational SQL Databases, and Full-Stack Web Architecture (React.js, Node.js).",
                edu2_title: "Master's & Bachelor's in Management",
                edu2_desc: "Specialization in Systems Optimization, Performance Management, and Digital Transformation.",

                // Terminal
                term_badge: "Interactive Console",
                term_title: "Terminal CLI v3.0",
                term_subtitle: "Command-line fan? Type help to explore my profile, or try matrix for a digital rain effect!",

                // Contact
                contact_badge: "Direct Contact",
                contact_title: "Let's Work Together!",
                contact_subtitle: "Have a question, need a website, or want an expert hand with a database or hardware setup? I'm just a click away.",
                contact_direct_title: "Direct Information",
                contact_direct_desc: "Message me directly on WhatsApp for a quick response, or send an email. On PC, it opens WhatsApp Web / your mail client, and on mobile, it launches your native apps.",
                contact_loc_label: "Location & Availability",
                contact_loc_val: "Ploiesti, Romania / Remote (Worldwide)",
                contact_social_label: "Profiles & Repositories:",
                form_title: "Send a Direct Message",
                form_sub: "Fill out the form below and I will get back to you within 24 hours.",
                form_name_label: "Your Name",
                form_email_label: "Email Address",
                form_type_label: "What is this regarding?",
                opt_web: "MVP / SaaS Platform / Web Application",
                opt_auto: "Custom CRM / Process Automation",
                opt_db: "Database Architecture & SQL Optimization",
                opt_hw: "IT Consulting & Technical Maintenance",
                opt_other: "General Inquiry / Custom Project",
                form_msg_label: "Your Message",
                btn_send_msg: "Send Message",
                form_security_notice: "Your information is secure and will never be shared with third parties.",

                // Footer & Modal
                footer_tagline: "Modern web solutions, dependable databases, and trusted IT maintenance.",
                footer_rights: "All rights reserved.",
                btn_view_repo: "View on GitHub",
                btn_close: "Close",
                footer_qr: "Scan to share",
                floating_whatsapp_label: "Chat on WhatsApp",
                floating_whatsapp_aria: "Chat directly with Tiberiu on WhatsApp"
            }
        };

        let currentLang = SafeStorage.get('tiberiu_portfolio_lang', 'ro');

        const applyLanguage = (lang) => {
            if (!translations[lang]) return;
            currentLang = lang;
            SafeStorage.set('tiberiu_portfolio_lang', lang);
            document.documentElement.setAttribute('lang', lang);

            // Update title
            document.title = lang === 'ro' 
                ? "Militaru Tiberiu Nicolae | IT Consultant • Full-Stack Solutions" 
                : "Militaru Tiberiu Nicolae | IT Consultant • Full-Stack Solutions";

            // Update all DOM elements with data-i18n attribute (Defensive DOM rendering)
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                const translation = translations[lang] ? translations[lang][key] : null;
                if (translation !== undefined && translation !== null) {
                    if (translation.includes('<')) {
                        el.innerHTML = translation;
                    } else {
                        el.textContent = translation;
                    }
                }
            });

            // Update Lang Toggle Text
            const langIndicator = document.getElementById('langCurrentText');
            if (langIndicator) {
                langIndicator.textContent = lang.toUpperCase();
            }

            // Update Floating WhatsApp Link & Aria
            const floatingWhatsapp = document.getElementById('floatingWhatsappBtn');
            if (floatingWhatsapp) {
                const messageText = lang === 'ro'
                    ? "Salut Tiberiu, am vazut portofoliul tau si as dori sa discutam o colaborare pentru un proiect."
                    : "Hi Tiberiu, I saw your portfolio and would like to discuss a potential project collaboration.";
                floatingWhatsapp.href = `https://wa.me/40720955119?text=${encodeURIComponent(messageText)}`;
                floatingWhatsapp.setAttribute('aria-label', translations[lang].floating_whatsapp_aria || "WhatsApp");
            }

            // Trigger typing effect reload with new language (if module is ready)
            if (typeof TypingModule !== 'undefined' && TypingModule && typeof TypingModule.updateLanguage === 'function') {
                TypingModule.updateLanguage(lang);
            }
        };

        const toggle = () => {
            applyLanguage(currentLang === 'ro' ? 'en' : 'ro');
        };

        // Attach event listener
        const toggleBtn = document.getElementById('langToggleBtn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggle);
        }

        // Initialize
        applyLanguage(currentLang);

        return {
            getCurrentLang: () => currentLang,
            getTranslation: (key) => translations[currentLang][key] || key,
            toggle
        };
    })();


    // ==========================================================================
    // 2. THEME CONTROLLER (Dark / Light Mode)
    // ==========================================================================
    ThemeModule = (() => {
        const toggleBtn = document.getElementById('themeToggleBtn');
        const themeIcon = document.getElementById('themeIcon');
        const html = document.documentElement;
        const body = document.body;

        // 1. Verificam localStorage. Daca nu exista, verificam preferinta sistemului de operare
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const defaultTheme = systemPrefersDark ? 'dark' : 'light';
        let currentTheme = SafeStorage.get('tiberiu_portfolio_theme', defaultTheme);

        const setTheme = (theme, notify = false) => {
            currentTheme = theme;
            html.setAttribute('data-theme', theme);
            body.setAttribute('data-theme', theme);
            SafeStorage.set('tiberiu_portfolio_theme', theme);

            if (themeIcon) {
                // When dark, icon shows sun to invite clicking for light mode
                // When light, icon shows moon to invite clicking for dark mode
                themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            }

            if (toggleBtn) {
                const isDark = theme === 'dark';
                toggleBtn.setAttribute('aria-label', isDark ? 'Comută pe Modul Luminos' : 'Comută pe Modul Întunecat');
                toggleBtn.setAttribute('title', isDark ? 'Comută pe Modul Luminos (Light Mode)' : 'Comută pe Modul Întunecat (Dark Mode)');
            }

            // Dispatch event for Neural Canvas and any dynamic subscribers
            window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));

            if (notify && typeof ToastModule !== 'undefined' && ToastModule && typeof ToastModule.show === 'function') {
                const lang = (typeof I18nModule !== 'undefined' && I18nModule) ? I18nModule.getCurrentLang() : 'ro';
                ToastModule.show(
                    theme === 'dark' 
                        ? (lang === 'ro' ? 'Mod Întunecat activat 🌙' : 'Dark Mode activated 🌙')
                        : (lang === 'ro' ? 'Mod Luminos activat ☀️' : 'Light Mode activated ☀️'),
                    'info',
                    2000
                );
            }
        };

        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
                setTheme(nextTheme, true);

                toggleBtn.style.transform = 'scale(0.85)';
                setTimeout(() => { toggleBtn.style.transform = ''; }, 160);
            });
        }

        // Apply initially without toast notification
        setTheme(currentTheme, false);

        return {
            getTheme: () => currentTheme,
            toggle: () => setTheme(currentTheme === 'dark' ? 'light' : 'dark', true)
        };
    })();


    // ==========================================================================
    // 3. TYPING EFFECT (Human-Centered & Multilingual)
    // ==========================================================================
    TypingModule = (() => {
        const target = document.getElementById('typingTarget');
        const phrases = {
            ro: [
                "Dezvoltare MVP & Platforme SaaS",
                "Aplicații CRM & Gestiune pe Măsură",
                "Arhitectură Baze de Date & Optimizare SQL",
                "Automatizări de Procese & Reducere Timpi",
                "Consultanță IT & Mentenanță Dedicată"
            ],
            en: [
                "MVP & Scalable SaaS Development",
                "Custom CRM & Operational Systems",
                "Database Architecture & SQL Tuning",
                "Process Automation & Workflow Efficiency",
                "Dedicated IT Consulting & Maintenance"
            ]
        };

        let currentLang = 'ro';
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typingTimeout = null;

        const type = () => {
            if (!target) return;
            const currentList = phrases[currentLang] || phrases.ro;
            const currentPhrase = currentList[phraseIdx];

            if (isDeleting) {
                target.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
            } else {
                target.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
            }

            let speed = isDeleting ? 45 : 90;

            if (!isDeleting && charIdx === currentPhrase.length) {
                speed = 2200; // Pause at full phrase
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % currentList.length;
                speed = 450; // Pause before typing next
            }

            typingTimeout = setTimeout(type, speed);
        };

        const updateLanguage = (lang) => {
            currentLang = lang;
            clearTimeout(typingTimeout);
            phraseIdx = 0;
            charIdx = 0;
            isDeleting = false;
            type();
        };

        // Initialize typing on load with active language
        if (typeof I18nModule !== 'undefined' && I18nModule && typeof I18nModule.getCurrentLang === 'function') {
            currentLang = I18nModule.getCurrentLang();
        }
        type();

        return {
            updateLanguage
        };
    })();


    // ==========================================================================
    // 4. NEURAL NETWORK & SYNAPSE UNIVERSE (Adaptive Dark/Light & Mouse Hotspot)
    // ==========================================================================
    ThreeDParticleUniverseModule = (() => {
        // isMobile este acum definit mai jos în interior pentru a fi dinamic, nu distrugem canvas-ul
        const container = document.getElementById('canvas-container');
        
        if (!container) return;

        const canvas = document.createElement('canvas');
        canvas.className = 'particle-canvas';
        container.replaceChildren(canvas);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0, height = 0;
        let dpr = 1;
        let neurons = [];
        let impulses = [];
        let shockwaves = [];
        let animId = null;
        let isPaused = false;

        // Current theme state
        let currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

        // Mouse & hotspot tracking
        const mouse = {
            x: -1000,
            y: -1000,
            targetX: -1000,
            targetY: -1000,
            active: false,
            radius: 200,      // Hotspot influence radius
            auraRadius: 180   // Glowing aura radius
        };

        // Theme palette definitions
        const palettes = {
            dark: {
                nodes: ['#00f0ff', '#38bdf8', '#818cf8', '#a855f7'],
                coreNode: '#00f0ff',
                synapseRgb: '0, 240, 255',
                synapseAltRgb: '168, 85, 247',
                impulseColor: '#ffffff',
                impulseGlow: '#00f0ff',
                hotspotCore: '#00f0ff',
                hotspotAura: [
                    { stop: 0, color: 'rgba(0, 240, 255, 0.40)' },
                    { stop: 0.3, color: 'rgba(56, 189, 248, 0.22)' },
                    { stop: 0.6, color: 'rgba(168, 85, 247, 0.10)' },
                    { stop: 1, color: 'rgba(3, 7, 18, 0)' }
                ],
                shadowBlur: 14,
                lineBaseAlpha: 0.25,
                mouseLineAlpha: 0.65
            },
            light: {
                nodes: ['#0284c7', '#2563eb', '#4f46e5', '#7c3aed'],
                coreNode: '#0284c7',
                synapseRgb: '37, 99, 235',
                synapseAltRgb: '99, 102, 241',
                impulseColor: '#1e40af',
                impulseGlow: '#38bdf8',
                hotspotCore: '#0284c7',
                hotspotAura: [
                    { stop: 0, color: 'rgba(2, 132, 199, 0.35)' },
                    { stop: 0.3, color: 'rgba(37, 99, 235, 0.20)' },
                    { stop: 0.6, color: 'rgba(99, 102, 241, 0.08)' },
                    { stop: 1, color: 'rgba(248, 250, 252, 0)' }
                ],
                shadowBlur: 10,
                lineBaseAlpha: 0.32,
                mouseLineAlpha: 0.75
            }
        };

        // Window resize handler
        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            initNeurons();
        };

        // Neuron class / generator
        const isMobile = window.innerWidth < 768; // Verificare dynamica, fara matchMedia static

        const initNeurons = () => {
            neurons = [];
            impulses = [];
            shockwaves = [];

            // Adaptive node count (Eco Mode on Mobile)
            let count = Math.min(Math.floor((width * height) / 12500), 95);
            if (width < 768) {
                // Eco Mode: drastically reduce particle count
                count = Math.min(count, 25);
            }

            const palette = palettes[currentTheme] || palettes.dark;

            for (let i = 0; i < count; i++) {
                const colorIdx = Math.floor(Math.random() * palette.nodes.length);
                neurons.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.75,
                    vy: (Math.random() - 0.5) * 0.75,
                    radius: Math.random() * 2.2 + 1.8,
                    baseRadius: Math.random() * 2.2 + 1.8,
                    colorIdx: colorIdx,
                    pulseOffset: Math.random() * Math.PI * 2,
                    pulseSpeed: Math.random() * 0.03 + 0.015,
                    energy: 0,
                    connections: []
                });
            }
        };

        // Spawn a neural impulse (action potential) along a synapse
        const spawnImpulse = (fromNeuron, toNeuron) => {
            if (impulses.length > 25) return;
            impulses.push({
                from: fromNeuron,
                to: toNeuron,
                progress: 0,
                speed: Math.random() * 0.025 + 0.02
            });
        };

        // Mouse listeners (with passive flag)
        window.addEventListener('mousemove', (e) => {
            mouse.targetX = e.clientX;
            mouse.targetY = e.clientY;
            mouse.active = true;
        }, { passive: true });

        window.addEventListener('mouseleave', () => {
            mouse.active = false;
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches[0]) {
                mouse.targetX = e.touches[0].clientX;
                mouse.targetY = e.touches[0].clientY;
                mouse.active = true;
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            mouse.active = false;
        }, { passive: true });

        // Click / Tap creates an expanding neural shockwave
        window.addEventListener('pointerdown', (e) => {
            if (e.target && e.target.closest && e.target.closest('button, a, input, textarea, select, .terminal-window')) return;
            shockwaves.push({
                x: e.clientX,
                y: e.clientY,
                radius: 0,
                maxRadius: Math.min(width, height) * 0.35,
                alpha: 1
            });
        });

        // Theme change detection
        window.addEventListener('themeChanged', (e) => {
            currentTheme = e.detail?.theme || 'dark';
        });

        const observer = new MutationObserver(() => {
            const theme = document.documentElement.getAttribute('data-theme') || 'dark';
            if (theme !== currentTheme) {
                currentTheme = theme;
            }
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        // Visibility pause (battery conservation)
        document.addEventListener('visibilitychange', () => {
            isPaused = document.hidden;
            if (!isPaused && !animId) render();
        });

        // Main Animation Loop
        let frameCount = 0;
        const maxSynapseDist = 135;

        const render = () => {
            if (isPaused) {
                animId = null;
                return;
            }
            animId = requestAnimationFrame(render);
            frameCount++;

            // Smooth mouse lerping
            if (mouse.active) {
                mouse.x += (mouse.targetX - mouse.x) * 0.16;
                mouse.y += (mouse.targetY - mouse.y) * 0.16;
            } else {
                mouse.x += (-1000 - mouse.x) * 0.1;
                mouse.y += (-1000 - mouse.y) * 0.1;
            }

            ctx.clearRect(0, 0, width, height);

            const palette = palettes[currentTheme] || palettes.dark;

            // 1. Draw Mouse Hotspot Aura if active (Disabled on mobile)
            if (!isMobile && mouse.active && mouse.x > 0 && mouse.y > 0) {
                const auraPulse = Math.sin(frameCount * 0.05) * 8;
                const auraRad = mouse.auraRadius + auraPulse;
                const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, auraRad);
                palette.hotspotAura.forEach(step => {
                    gradient.addColorStop(step.stop, step.color);
                });

                ctx.save();
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, auraRad, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Inner core hotspot glow
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, 4.5, 0, Math.PI * 2);
                ctx.fillStyle = palette.hotspotCore;
                ctx.shadowColor = palette.hotspotCore;
                ctx.shadowBlur = 18;
                ctx.fill();

                // Electric ring around hotspot
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, 22 + Math.sin(frameCount * 0.08) * 4, 0, Math.PI * 2);
                ctx.strokeStyle = palette.hotspotCore;
                ctx.lineWidth = 1.2;
                ctx.globalAlpha = 0.5 + Math.sin(frameCount * 0.08) * 0.25;
                ctx.stroke();
                ctx.restore();
            }

            // 2. Draw & Expand Shockwaves
            for (let i = shockwaves.length - 1; i >= 0; i--) {
                const sw = shockwaves[i];
                sw.radius += 5.5;
                sw.alpha *= 0.94;

                ctx.save();
                ctx.beginPath();
                ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
                ctx.strokeStyle = currentTheme === 'dark' ? 'rgba(0, 240, 255, ' + sw.alpha + ')' : 'rgba(37, 99, 235, ' + sw.alpha + ')';
                ctx.lineWidth = 2;
                ctx.shadowColor = palette.hotspotCore;
                ctx.shadowBlur = 12;
                ctx.stroke();
                ctx.restore();

                // Shockwave triggers nearby neurons
                neurons.forEach(n => {
                    const distToWave = Math.abs(Math.hypot(n.x - sw.x, n.y - sw.y) - sw.radius);
                    if (distToWave < 15) {
                        n.energy = 1.0;
                    }
                });

                if (sw.alpha < 0.02 || sw.radius > sw.maxRadius) {
                    shockwaves.splice(i, 1);
                }
            }

            // 3. Update & Draw Neurons and Synaptic Connections
            const count = neurons.length;

            // Reset connections list
            for (let i = 0; i < count; i++) {
                neurons[i].connections = [];
            }

            // Detect Synaptic Connections between Neurons
            for (let i = 0; i < count; i++) {
                const n1 = neurons[i];

                for (let j = i + 1; j < count; j++) {
                    const n2 = neurons[j];
                    const dx = n1.x - n2.x;
                    const dy = n1.y - n2.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < maxSynapseDist) {
                        n1.connections.push(n2);
                        n2.connections.push(n1);

                        const proximityFactor = 1 - dist / maxSynapseDist;
                        let alpha = proximityFactor * palette.lineBaseAlpha;

                        // Boost connection brightness if neurons are energized
                        if (n1.energy > 0 || n2.energy > 0) {
                            alpha += Math.max(n1.energy, n2.energy) * 0.45;
                        }

                        // Boost if near mouse
                        if (mouse.active) {
                            const dMouse1 = Math.hypot(n1.x - mouse.x, n1.y - mouse.y);
                            const dMouse2 = Math.hypot(n2.x - mouse.x, n2.y - mouse.y);
                            if (dMouse1 < mouse.radius || dMouse2 < mouse.radius) {
                                alpha = Math.min(alpha + 0.35, 0.85);
                            }
                        }

                        ctx.beginPath();
                        ctx.moveTo(n1.x, n1.y);
                        ctx.lineTo(n2.x, n2.y);
                        ctx.strokeStyle = `rgba(${proximityFactor > 0.6 ? palette.synapseRgb : palette.synapseAltRgb}, ${alpha})`;
                        ctx.lineWidth = proximityFactor * 1.4 + 0.4;
                        ctx.stroke();

                        // Occasionally ignite an impulse along active connections
                        if (frameCount % 45 === 0 && Math.random() < 0.07) {
                            spawnImpulse(n1, n2);
                        }
                    }
                }

                // 4. Connect Neurons to Mouse Hotspot (Direct Synaptic Beams)
                if (mouse.active) {
                    const dxm = mouse.x - n1.x;
                    const dym = mouse.y - n1.y;
                    const distMouse = Math.hypot(dxm, dym);

                    if (distMouse < mouse.radius) {
                        const mouseProximity = 1 - distMouse / mouse.radius;
                        const beamAlpha = mouseProximity * palette.mouseLineAlpha;

                        // Draw energetic synapse to mouse
                        ctx.beginPath();
                        ctx.moveTo(n1.x, n1.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(${palette.synapseRgb}, ${beamAlpha})`;
                        ctx.lineWidth = mouseProximity * 2.2 + 0.6;
                        ctx.stroke();

                        // Gentle magnetic pull towards mouse
                        const pullFactor = mouseProximity * 0.022;
                        n1.x += dxm * pullFactor;
                        n1.y += dym * pullFactor;

                        // Spawn rapid synaptic sparks towards mouse
                        if (Math.random() < 0.04) {
                            spawnImpulse(n1, { x: mouse.x, y: mouse.y, isMouse: true });
                        }
                    }
                }
            }

            // 5. Update & Draw Impulses (Action Potentials / Electrical Sparks)
            for (let i = impulses.length - 1; i >= 0; i--) {
                const imp = impulses[i];
                imp.progress += imp.speed;

                const startX = imp.from.x;
                const startY = imp.from.y;
                const targetX = imp.to.x;
                const targetY = imp.to.y;

                const currX = startX + (targetX - startX) * imp.progress;
                const currY = startY + (targetY - startY) * imp.progress;

                ctx.save();
                ctx.beginPath();
                ctx.arc(currX, currY, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = palette.impulseColor;
                ctx.shadowColor = palette.impulseGlow;
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.restore();

                if (imp.progress >= 1) {
                    if (imp.to && !imp.to.isMouse) {
                        imp.to.energy = 1.0;
                    }
                    impulses.splice(i, 1);
                }
            }

            // 6. Update & Draw Neurons
            for (let i = 0; i < count; i++) {
                const n = neurons[i];

                // Drift motion
                n.x += n.vx;
                n.y += n.vy;

                // Bounce off edges smoothly
                if (n.x < 0 || n.x > width) n.vx *= -1;
                if (n.y < 0 || n.y > height) n.vy *= -1;

                // Biological breathing oscillation
                const breathe = Math.sin(frameCount * n.pulseSpeed + n.pulseOffset) * 0.6;
                const currentRadius = n.baseRadius + breathe + (n.energy * 2.5);

                // Energy decay
                if (n.energy > 0) {
                    n.energy *= 0.92;
                    if (n.energy < 0.01) n.energy = 0;
                }

                const nodeColor = palette.nodes[n.colorIdx % palette.nodes.length];

                ctx.save();
                ctx.beginPath();
                ctx.arc(n.x, n.y, currentRadius, 0, Math.PI * 2);
                ctx.fillStyle = nodeColor;
                ctx.shadowColor = nodeColor;
                ctx.shadowBlur = palette.shadowBlur + (n.energy * 12);
                ctx.fill();

                // If highly energized, draw an expanding halo
                if (n.energy > 0.3) {
                    ctx.beginPath();
                    ctx.arc(n.x, n.y, currentRadius + n.energy * 6, 0, Math.PI * 2);
                    ctx.strokeStyle = nodeColor;
                    ctx.globalAlpha = n.energy * 0.7;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
                ctx.restore();
            }
        };

        // Initialize and start animation
        resize();
        render();

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resize, 120);
        });

        // 3D Perspective Card Tilt
        const tiltCards = document.querySelectorAll('.service-card, .project-card, .profile-card, .skill-group-card');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                card.style.transform = `perspective(1000px) rotateX(${-y * 0.035}deg) rotateY(${x * 0.035}deg) translateY(-6px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            });
        });
    })();



    // ==========================================================================
    // 5. NAVIGATION, SCROLL PROGRESS & MOBILE DRAWER
    // ==========================================================================
    NavModule = (() => {
        const header = document.getElementById('header');
        const scrollBar = document.getElementById('scrollProgress');
        const backToTopBtn = document.getElementById('backToTopBtn');
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const mobileDrawer = document.getElementById('mobileDrawer');
        const drawerCloseBtn = document.getElementById('drawerCloseBtn');
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    
                    // Progress bar
                    if (scrollBar && docHeight > 0) {
                        scrollBar.style.width = `${(scrollY / docHeight) * 100}%`;
                    }

                    // Back to top
                    if (backToTopBtn) {
                        backToTopBtn.classList.toggle('visible', scrollY > 500);
                    }

                    // Active menu highlighting
                    let currentId = '';
                    sections.forEach(sec => {
                        const top = sec.offsetTop - 140;
                        const height = sec.offsetHeight;
                        if (scrollY >= top && scrollY < top + height) {
                            currentId = sec.getAttribute('id');
                        }
                    });

                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
                    });

                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Back to top click
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Mobile drawer toggle
        const toggleDrawer = (open) => {
            const isActive = open !== undefined ? open : !mobileDrawer.classList.contains('active');
            hamburgerBtn.classList.toggle('active', isActive);
            mobileDrawer.classList.toggle('active', isActive);
            hamburgerBtn.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        };

        if (hamburgerBtn && mobileDrawer) {
            hamburgerBtn.addEventListener('click', () => toggleDrawer());
            if (drawerCloseBtn) {
                drawerCloseBtn.addEventListener('click', () => toggleDrawer(false));
            }
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => toggleDrawer(false));
            });
            window.addEventListener('keydown', (e) => {
                if ((e.key === 'Escape' || e.key === 'Esc') && mobileDrawer.classList.contains('active')) {
                    toggleDrawer(false);
                }
            });
        }
    })();


    // ==========================================================================
    // 6. ANIMATED NUMERICAL COUNTERS
    // ==========================================================================
    StatsModule = (() => {
        const statsSection = document.querySelector('.about-stats-col');
        if (!statsSection) return;

        if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
            document.querySelectorAll('.stat-number').forEach(stat => {
                stat.textContent = stat.getAttribute('data-target') || '100';
            });
            return;
        }

        let hasRun = false;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasRun) {
                hasRun = true;
                document.querySelectorAll('.stat-number').forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'), 10);
                    let current = 0;
                    stat.textContent = '0';
                    const increment = target <= 10 ? 1 : Math.ceil(target / 40);
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            stat.textContent = target;
                            clearInterval(timer);
                        } else {
                            stat.textContent = current;
                        }
                    }, 40);
                });
            }
        }, { threshold: 0.25 });

        observer.observe(statsSection);
    })();


    // ==========================================================================
    // 7. TERMINAL CLI & MATRIX RAIN EASTER EGG
    // ==========================================================================
    TerminalModule = (() => {
        const input = document.getElementById('terminalInput');
        const output = document.getElementById('terminalOutput');
        const body = document.getElementById('terminalBody');
        const matrixCanvas = document.getElementById('matrixCanvas');
        const termMin = document.getElementById('termMin');
        const termMax = document.getElementById('termMax');
        const termClose = document.getElementById('termClose');

        const history = [];
        let historyIdx = -1;
        let isMatrixActive = false;
        let matrixAnimId = null;

        const commandsList = ['help', 'services', 'projects', 'skills', 'experience', 'contact', 'cv', 'matrix', 'theme', 'lang', 'clear'];

        const escapeHTML = (str) => String(str).replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' })[m]);

        const printLine = (content, cssClass = 't-out') => {
            if (!output) return;
            const div = document.createElement('div');
            div.className = `t-line ${cssClass}`;
            if (typeof content === 'string' && content.includes('<')) {
                div.innerHTML = content;
            } else {
                div.textContent = content;
            }
            output.appendChild(div);
            if (body) body.scrollTop = body.scrollHeight;
        };

        const printSafeCmd = (cmdText) => {
            if (!output) return;
            const div = document.createElement('div');
            div.className = 't-line t-cmd';
            div.textContent = `tiberiu@dev-os:~$ ${cmdText}`;
            output.appendChild(div);
            if (body) body.scrollTop = body.scrollHeight;
        };

        const printSafeError = (unrecognizedCmd) => {
            if (!output) return;
            const div = document.createElement('div');
            div.className = 't-line t-err';
            const prefix = document.createTextNode(`Command not recognized: "${unrecognizedCmd}". Type `);
            const helpSpan = document.createElement('span');
            helpSpan.className = 'highlight-cyan';
            helpSpan.textContent = "'help'";
            const suffix = document.createTextNode(' for a list of commands.');
            div.appendChild(prefix);
            div.appendChild(helpSpan);
            div.appendChild(suffix);
            output.appendChild(div);
            if (body) body.scrollTop = body.scrollHeight;
        };

        // Matrix Rain Implementation
        const toggleMatrix = () => {
            if (!matrixCanvas) return;
            isMatrixActive = !isMatrixActive;

            if (isMatrixActive) {
                matrixCanvas.classList.add('active');
                printLine('[EASTER EGG] Matrix digital rain activated! Type "matrix" again to disable.', 't-succ');
                startMatrix();
            } else {
                matrixCanvas.classList.remove('active');
                printLine('[EASTER EGG] Matrix deactivated.', 't-sys');
                stopMatrix();
            }
        };

        const startMatrix = () => {
            const ctx = matrixCanvas.getContext('2d');
            matrixCanvas.width = matrixCanvas.offsetWidth;
            matrixCanvas.height = matrixCanvas.offsetHeight;

            const chars = "0101010101010101TIBERIUMILITARUSQLREACTNODECPLUSPLUS";
            const fontSize = 13;
            const columns = Math.floor(matrixCanvas.width / fontSize);
            const drops = Array(columns).fill(1);

            const draw = () => {
                ctx.fillStyle = 'rgba(8, 13, 26, 0.08)';
                ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

                ctx.fillStyle = '#00f0ff';
                ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

                for (let i = 0; i < drops.length; i++) {
                    const text = chars.charAt(Math.floor(Math.random() * chars.length));
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                    if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }

                if (isMatrixActive) {
                    matrixAnimId = requestAnimationFrame(draw);
                }
            };
            draw();
        };

        const stopMatrix = () => {
            if (matrixAnimId) cancelAnimationFrame(matrixAnimId);
            const ctx = matrixCanvas.getContext('2d');
            ctx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        };

        const executeCommand = (cmdRaw) => {
            const cmd = cmdRaw.trim().toLowerCase();
            if (!cmd) return;

            printSafeCmd(cmdRaw);

            switch (cmd) {
                case 'help':
                    printLine('Available Commands:', 't-sys');
                    printLine('  <span class="highlight-cyan">services</span>   - Web, Automation, DB & Hardware services overview');
                    printLine('  <span class="highlight-cyan">projects</span>   - Real-world portfolio projects (ATS, E-Commerce, CRM)');
                    printLine('  <span class="highlight-cyan">skills</span>     - Frontend, Backend, Hardware & Tools stack');
                    printLine('  <span class="highlight-cyan">experience</span> - Professional timeline & career path');
                    printLine('  <span class="highlight-cyan">contact</span>    - Direct contact info (WhatsApp, Phone, Email)');
                    printLine('  <span class="highlight-cyan">cv</span>         - Trigger clean printable PDF CV');
                    printLine('  <span class="highlight-cyan">matrix</span>     - Toggle secret Matrix rain overlay');
                    printLine('  <span class="highlight-cyan">theme</span>      - Switch dark / light theme');
                    printLine('  <span class="highlight-cyan">lang</span>       - Toggle between RO and EN');
                    printLine('  <span class="highlight-cyan">clear</span>      - Clear terminal window');
                    break;

                case 'services':
                    printLine('1. 🚀 MVP & Platforme SaaS: React, Node.js, Arhitecturi scalabile, REST APIs', 't-succ');
                    printLine('2. 🗄️ Baze de Date & Backend Sigur: PostgreSQL, MySQL, Optimizare SQL & Latență Minimă', 't-succ');
                    printLine('3. ⚡ Sisteme CRM & Automatizări: Aplicații dedicate, generare PDF, sincronizări date', 't-succ');
                    printLine('4. 🛠️ Consultanță IT & Mentenanță: Diagnoză tehnică, selecție stack, securitate & stabilitate 24/7', 't-succ');
                    break;

                case 'projects':
                    printLine('• [CV Builder Pro & ATS Analyzer]: SaaS Serverless, strict CSP without unsafe-inline, zero-trust DOM, Puppeteer anti-SSRF, Stripe webhooks, structured JSON logger', 't-out');
                    printLine('• [Magazin Online Florărie]: Live chat, WebSockets, decoupled MVC architecture, React storefront', 't-out');
                    printLine('• [Instalbloc CRM]: Next.js 16, React 19, zero-any architecture, Gatekeeper, automated SLA cron, forensic JSON logger, Drizzle ORM', 't-out');
                    printLine('• [Viziune Urbană Ploiești]: Civic platform, Next.js 15, TypeScript zero-any, Supabase PostgreSQL & Storage, HMAC timing-safe auth, /status FSM tracker, admin storage & ANAF exports, Gatekeeper', 't-out');
                    printLine('• [Portofoliu Tiberiu]: Vite, Three.js 3D universe, strict CSP, zero inline styling, zero-trust DOM, Gatekeeper, OKF SSOT', 't-out');
                    const projTarget = document.getElementById('projects');
                    if (typeof projTarget?.scrollIntoView === 'function') projTarget.scrollIntoView({ behavior: 'smooth' });
                    break;

                case 'skills':
                    printLine('Stack: JavaScript, TypeScript, React, Node.js, PostgreSQL, MySQL, C#, C++, Git', 't-succ');
                    const skillsTarget = document.getElementById('skills');
                    if (typeof skillsTarget?.scrollIntoView === 'function') skillsTarget.scrollIntoView({ behavior: 'smooth' });
                    break;

                case 'experience':
                    printLine('• Database Administrator @ Corpul Expertilor (2026 - Present)', 't-out');
                    printLine('• Assistant Manager & Digital Transformation @ SC SIATI SRL (2014 - 2020)', 't-out');
                    printLine('• IT System Technician (Tier 1 & 2) @ GFR (2010 - 2014)', 't-out');
                    printLine('• Analyst Programmer Studies @ Colegiul Tehnic Elie Radu', 't-out');
                    break;

                case 'contact':
                    printLine('WhatsApp: (+40) 720 955 119 (wa.me/40720955119)', 't-succ');
                    printLine('Email: contact@tiberiumilitaru.ro', 't-succ');
                    printLine('LinkedIn: https://www.linkedin.com/in/tiberiu-militaru-nicolae89', 't-succ');
                    printLine('Location: Ploiesti, Prahova / Remote', 't-out');
                    break;

                case 'cv':
                    printLine('[ACTION] Downloading official Curriculum Vitae (PDF)...', 't-succ');
                    const dlLink = document.createElement('a');
                    dlLink.href = 'CV-Militaru-Tiberiu.pdf';
                    dlLink.download = 'CV-Militaru-Tiberiu.pdf';
                    dlLink.target = '_blank';
                    dlLink.rel = 'noopener noreferrer';
                    document.body.appendChild(dlLink);
                    dlLink.click();
                    dlLink.remove();
                    printLine('[OK] Fișierul "CV-Militaru-Tiberiu.pdf" a fost descărcat cu succes.', 't-succ');
                    break;

                case 'matrix':
                    toggleMatrix();
                    break;

                case 'theme':
                    ThemeModule.toggle();
                    printLine(`Theme switched to: ${ThemeModule.getTheme()}`, 't-sys');
                    break;

                case 'lang':
                    I18nModule.toggle();
                    printLine(`Language switched to: ${I18nModule.getCurrentLang().toUpperCase()}`, 't-sys');
                    break;

                case 'clear':
                    if (output) output.replaceChildren();
                    break;

                default:
                    printSafeError(cmd);
                    break;
            }
        };

        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const val = input.value;
                    if (val.trim()) {
                        history.push(val);
                        historyIdx = -1;
                        executeCommand(val);
                    }
                    input.value = '';
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (history.length > 0) {
                        historyIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
                        input.value = history[historyIdx];
                    }
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (historyIdx !== -1) {
                        historyIdx++;
                        if (historyIdx < history.length) {
                            input.value = history[historyIdx];
                        } else {
                            historyIdx = -1;
                            input.value = '';
                        }
                    }
                } else if (e.key === 'Tab') {
                    e.preventDefault();
                    const currentVal = input.value.trim().toLowerCase();
                    if (!currentVal) return;
                    const matches = commandsList.filter(c => c.startsWith(currentVal));
                    if (matches.length === 1) {
                        input.value = matches[0];
                    } else if (matches.length > 1) {
                        printLine(`tiberiu@dev-os:~$ ${escapeHTML(currentVal)}`, 't-cmd');
                        printLine(matches.join('    '), 't-sys');
                    }
                }
            });

            // Focus on input when clicking terminal viewport
            if (body) {
                body.addEventListener('click', (e) => {
                    if (e.target !== input) input.focus();
                });
            }
        }

        // Quick chip clicks
        document.querySelectorAll('.quick-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const cmd = chip.getAttribute('data-cmd');
                if (cmd) {
                    executeCommand(cmd);
                    if (input) input.focus();
                }
            });
        });

        const openTerminal = (smoothScroll = true) => {
            const termSection = document.getElementById('terminal');
            if (!termSection) return;

            termSection.classList.remove('hidden');
            if (smoothScroll) {
                termSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            setTimeout(() => {
                if (input) input.focus();
            }, 300);
        };

        const hideTerminal = () => {
            const termSection = document.getElementById('terminal');
            if (!termSection) return;
            termSection.classList.add('hidden');
            if (isMatrixActive) toggleMatrix();
        };

        const toggleTerminal = () => {
            const termSection = document.getElementById('terminal');
            if (!termSection) return;
            if (termSection.classList.contains('hidden') || getComputedStyle(termSection).display === 'none') {
                openTerminal(true);
                ToastModule?.show("Terminal CLI Activat", 'info');
            } else {
                hideTerminal();
            }
        };

        // Sincronizare automata cu toate linkurile catre #terminal (meniu desktop, drawer mobil)
        document.querySelectorAll('a[href="#terminal"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                openTerminal(true);
                if (history.pushState) {
                    history.pushState(null, '', '#terminal');
                }
            });
        });

        // Sincronizare cu butoanele dedicate din Hero sau din pagina
        document.querySelectorAll('#heroTerminalBtn, .terminal-trigger').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openTerminal(true);
            });
        });

        // Topbar buttons
        termMin?.addEventListener('click', () => { if (output) output.replaceChildren(); });
        termMax?.addEventListener('click', () => ThemeModule.toggle());
        termClose?.addEventListener('click', () => {
            hideTerminal();
            ToastModule?.show("Terminal închis", 'info');
        });

        // Scurtatura de tastatura: Ctrl+K / Cmd+K
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                toggleTerminal();
            }
        });

        // Deschidere automata daca utilizatorul acceseaza direct #terminal din URL
        if (window.location.hash === '#terminal') {
            openTerminal(false);
        }

        return {
            open: openTerminal,
            hide: hideTerminal,
            toggle: toggleTerminal
        };
    })();


    // ==========================================================================
    // 7.5. PROJECT FILTER MODULE (Varianta A)
    // ==========================================================================
    ProjectFilterModule = (() => {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        if (!filterBtns.length || !projectCards.length) return null;

        const setFilter = (category) => {
            filterBtns.forEach(btn => {
                const isActive = btn.getAttribute('data-filter') === category;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            projectCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                const shouldShow = category === 'all' || cardCat === category;

                if (shouldShow) {
                    card.classList.remove('is-hidden');
                    card.classList.remove('fade-in');
                    void card.offsetHeight; // trigger reflow for animation
                    card.classList.add('fade-in');
                } else {
                    card.classList.remove('fade-in');
                    card.classList.add('is-hidden');
                }
            });
        };

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetFilter = btn.getAttribute('data-filter');
                if (targetFilter) {
                    setFilter(targetFilter);
                }
            });
        });

        return {
            setFilter
        };
    })();


    // ==========================================================================
    // 8. PROJECT DETAILS MODAL
    // ==========================================================================
    ModalModule = (() => {
        const modal = document.getElementById('projectModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        const githubLink = document.getElementById('modalGithubLink');
        const closeBtn = document.getElementById('modalCloseBtn');
        const dismissBtn = document.getElementById('modalDismissBtn');

        const projectData = {
            proj1: {
                ro: {
                    title: "CV Builder Pro & ATS Analyzer (SaaS)",
                    desc: "Platformă SaaS de redactare CV și analiză ATS în timp real, cu monetizare integrată, randare vectorială PDF pe microservicii serverless și flux complet automatizat.",
                    architecture: "Frontend Vanilla JS ES6+ decuplat, fără dependențe grele. Arhitectură Cloud Serverless pe Firebase (Hosting, Firestore Live, Firebase Auth) și microservicii Cloud Functions (Node.js 22) cu Puppeteer ranforsat anti-SSRF/XSS. Ranforsat pe standarde Zero-Defect: Content Security Policy strictă fără 'unsafe-inline', mutație Zero-Trust DOM (replaceChildren), eliminarea completă a stilurilor inline dinamice prin clase BEM, logging structurat JSON cu ID-uri de corelare și procesare plăți prin Stripe Webhooks.",
                    results: [
                        "Arhitectură Serverless auto-scalabilă cu costuri minime de rulare pasivă și cold-start optimizat.",
                        "Politici CSP de nivel bancar (zero 'unsafe-inline' în script-src) și mutații DOM sanitizate la nivel de nod.",
                        "Protecție Red-Team Puppeteer anti-SSRF cu blocare acces la metadata cloud (169.254.169.254) și izolare rețea.",
                        "Sistem de logging forensic JSON (functions.logger) cu correlation ID unificat pentru auditabilitate completă.",
                        "Integrare Stripe Checkout & Webhooks idempotențiale pentru activarea instantă a planurilor PRO.",
                        "Barieră mecanică deterministă Gatekeeper și documentație arhitecturală sincronizată în Open Knowledge Format (OKF)."
                    ]
                },
                en: {
                    title: "CV Builder Pro & ATS Analyzer (SaaS)",
                    desc: "Production SaaS CV builder and real-time ATS scoring platform featuring serverless vector PDF rendering, integrated subscriptions, and automated workflows.",
                    architecture: "Decoupled Vanilla JS ES6+ frontend with zero heavy runtime dependencies. Serverless cloud backend on Firebase (Hosting, Firestore Real-time, Firebase Auth) and Node.js 22 Cloud Functions running Puppeteer hardened against SSRF/XSS. Built to Zero-Defect standards: strict Content Security Policy without 'unsafe-inline', Zero-Trust DOM mutations (replaceChildren), complete removal of dynamic inline styling via semantic BEM classes, structured forensic JSON logging with correlation IDs, and automated Stripe webhook billing.",
                    results: [
                        "Self-scaling serverless architecture with near-zero idle maintenance costs and optimized warm starts.",
                        "Strict Content Security Policy (no 'unsafe-inline') and DOM mutations sanitized at programmatic node level.",
                        "Red-Team Puppeteer hardening with blocked cloud metadata access (169.254.169.254) and network isolation.",
                        "Structured JSON logging pipeline (functions.logger) with unified correlation IDs for auditability.",
                        "Idempotent Stripe Checkout and webhook dispatcher for instantaneous PRO plan provisioning.",
                        "Deterministic Gatekeeper mechanical build barrier and SSOT architectural governance via Open Knowledge Format (OKF)."
                    ]
                },
                github: "https://github.com/tiberiumilitaru89/cv-builder-ats"
            },
            proj2: {
                ro: {
                    title: "Magazin Online cu Chat Live (Florărie)",
                    desc: "Platformă de comerț electronic dedicată unei florării locale, optimizată pentru asistență la comandă în timp real și conversii rapide pe dispozitive mobile.",
                    architecture: "Arhitectură decuplată MVC cu interfață dinamică React.js și backend Node.js. Comunicare bidirecțională prin WebSockets pentru mesagerie instantanee client-vânzător, validare strictă a datelor la intrare și coș de cumpărături optimizat pentru conexiuni mobile.",
                    results: [
                        "Creștere cu 35% a ratei de finalizare a comenzilor datorită asistenței consultative în timp real.",
                        "Timp de încărcare sub 1.2 secunde pe conexiuni mobile 4G prin bundle optimizat.",
                        "Panou simplificat de administrare a comenzilor și a sesiunilor de chat pentru operatorul florăriei.",
                        "Sanitizare Zero-Trust a mesajelor din chat pentru prevenirea oricărei injectări de conținut malițios."
                    ]
                },
                en: {
                    title: "Online Store with Live Chat (Florist)",
                    desc: "A bespoke e-commerce platform built for a local flower boutique, where client purchase decisions heavily rely on instant consultation for custom arrangements.",
                    architecture: "Built on React.js (SPA) with an Express/Node.js backend. Integrated bidirectional WebSockets for zero-latency client-to-seller live messaging, strict request sanitization, and mobile-first checkout.",
                    results: [
                        "35% boost in checkout completion rates via instant conversational chat support.",
                        "Sub-1.2 second load time on standard 4G mobile connections via optimized bundles.",
                        "Streamlined real-time order and messaging dashboard for shop management.",
                        "Zero-Trust input sanitization across all live socket streams preventing malicious payload injection."
                    ]
                },
                github: null
            },
            proj3: {
                ro: {
                    title: "Aplicație CRM & Gestiune Servicii (Instalbloc)",
                    desc: "Platformă enterprise dezvoltată pentru companii de instalații sanitare și intervenții tehnice pe teren, eliminând suprapunerile de programări și întârzierile de intervenție.",
                    architecture: "Full-Stack Next.js 16 cu React 19 și TypeScript în regim strict Zero-Any. Persistență de înaltă performanță prin Drizzle ORM peste SQLite / LibSQL, validare cu Zod, interfață stilizată cu Tailwind CSS v4 și monitorizare cu Sentry. Sistemul include cron automat de triaj și alerte SLA (/api/cron/check-sla), logging forensic structurat JSON (logger.ts) cu mascare automată a datelor PII și ID-uri de corelare, precum și barieră mecanică Gatekeeper (tsc + eslint cu 0 avertismente).",
                    results: [
                        "Tipizare absolută garantată la compilare (Zero-Any) pe întreaga bază de cod și server actions.",
                        "Barieră mecanică Gatekeeper integrată în pipeline (tsc --noEmit && eslint max-warnings 0).",
                        "Cron automat (/api/cron/check-sla) cu detectare proactivă a depășirilor de SLA și alerte de dispecerat.",
                        "Modul forensic de logging structurat JSON cu mascare automată a datelor cu caracter personal (PII).",
                        "Persistență tranzacțională optimizată prin Drizzle ORM cu interogări ultra-rapide și izolare pe asociație.",
                        "Standardizare arhitecturală completă guvernată prin Open Knowledge Format (OKF)."
                    ]
                },
                en: {
                    title: "Service Management & CRM Tool (Instalbloc)",
                    desc: "Enterprise field service CRM engineered for plumbing and technical maintenance contractors, eliminating scheduling overlaps and dispatch delays.",
                    architecture: "Full-Stack Next.js 16 with React 19 and strict Zero-Any TypeScript. High-performance persistence through Drizzle ORM over SQLite / LibSQL, runtime schema validation with Zod, modern styling with Tailwind CSS v4, and observability via Sentry. Engineered with an automated SLA check cron dispatcher (/api/cron/check-sla), structured forensic JSON logger (logger.ts) with automatic PII masking and correlation IDs, and a mechanical Gatekeeper build barrier (tsc + eslint with 0 warnings).",
                    results: [
                        "Absolute compile-time type safety (Zero-Any) across all server actions, models, and UI components.",
                        "Deterministic Gatekeeper barrier halting builds on any TypeScript or ESLint warning.",
                        "Automated SLA cron dispatcher (/api/cron/check-sla) detecting schedule breaches before impact.",
                        "Forensic JSON structured logging with automatic PII masking (names, phones, IBANs, emails).",
                        "Optimized relational persistence with Drizzle ORM delivering zero-latency queries and association isolation.",
                        "Complete architectural alignment and governance under Open Knowledge Format (OKF)."
                    ]
                },
                github: "https://github.com/tiberiumilitaru89/instalbloc"
            },
            proj4: {
                ro: {
                    title: "Viziune Urbană Ploiești — Platformă Civică, Portal Status FSM, Securitate Zero-Trust & Cloud Storage",
                    desc: "Platformă civică de anvergură pentru municipiul Ploiești, dedicată transparentizării auditurilor tehnice la asociațiile de proprietari, modernizării termoficării și digitalizării fluxurilor comunitare.",
                    architecture: "Full-Stack pe Next.js 15.5 cu React 19 și TypeScript strict Zero-Any, conectat la Supabase (PostgreSQL & Storage). Include: strat de autentificare server-side pe bază de HMAC-SHA256 cu timingSafeEqual și cookie-uri HttpOnly; Portal Public de Urmărire (/status) cu căutare după număr dosar unic (DOSAR-PH-XXX) și Stepper FSM în 5 pași determiniști; Panou Administrativ complet (/admin) cu 6 module (Asociații, Parteneri Oficiali, Galerie Lucrări, Metrici Globale, Formulare 230, Donații); pipeline securizat de upload imagini în Supabase Storage (validare MIME strictă, 5MB); generator oficial de Fișe de Avizier (A4 Print/PDF cu QR Code); export borderou centralizator ANAF Formular 230 în CSV cu UTF-8 BOM; sliding-window rate limiting pe IP; validare algoritmică a CNP-urilor; capcane invizibile Honeypot; pipeline de email tranzacțional prin Resend API cu DKIM & SPF verificate și rutare coordonator; barieră mecanică Gatekeeper și documentare OKF.",
                    results: [
                        "Portal public transparent (/status) cu stepper FSM determinist în 5 pași și căutare instantă fără scurgeri PII.",
                        "Panou de control centralizat cu 6 secțiuni administrative, upload Supabase Storage și generator fișe avizier A4.",
                        "Securitate de nivel enterprise: sesiuni server HMAC-SHA256 cu timingSafeEqual, protecție împotriva atacurilor side-channel și rate limiting pe IP.",
                        "Pipeline de email Resend cu livrabilitate maximă garantată prin chei criptografice DKIM & SPF pe domeniu autorizat.",
                        "Conformitate fiscală ANAF: export nativ de borderou Formular 230 în format CSV cu UTF-8 BOM pentru Excel.",
                        "Barieră mecanică Gatekeeper (tsc && eslint && next build) cu 0 erori și 0 avertismente."
                    ]
                },
                en: {
                    title: "Viziune Urbană Ploiești — Civic Platform, FSM Status Tracker, Zero-Trust Security & Cloud Storage",
                    desc: "Large-scale civic platform engineered for the municipality of Ploiești to modernize technical audits for homeowners associations, drive district heating upgrades, and digitize community governance.",
                    architecture: "Full-Stack on Next.js 15.5 with React 19 and strict Zero-Any TypeScript, backed by Supabase (PostgreSQL & Storage). Features: server-side HMAC-SHA256 sessions with timingSafeEqual and HttpOnly cookies; Public Case Tracking Portal (/status) with unique case search (DOSAR-PH-XXX) and a 5-step deterministic FSM stepper; 6-module Admin Dashboard (/admin); secure direct image upload to Supabase Storage (strict MIME filtering, 5MB ceiling); official A4 noticeboard sheet generator with QR code; collective ANAF Form 230 borderou export in CSV with UTF-8 BOM; IP sliding-window rate limiting; algorithmic CNP verification; Honeypot anti-bot traps; transactional email through Resend API with verified DKIM/SPF keys; mechanical Gatekeeper build barrier, and OKF SSOT governance.",
                    results: [
                        "Public dossier tracking portal (/status) with a 5-step deterministic FSM stepper and zero PII exposure.",
                        "Comprehensive admin suite with 6 operational modules, direct Supabase Storage uploads, and printable A4 noticeboard sheets.",
                        "Enterprise Zero-Trust security: timing-safe HMAC-SHA256 server sessions, side-channel attack mitigation, and IP rate limiting.",
                        "Transactional Resend email infrastructure with verified DKIM and SPF records for optimal inbox delivery.",
                        "Fiscal compliance with official ANAF Form 230 collective borderou generation in native Excel CSV format (UTF-8 BOM).",
                        "Mechanical Gatekeeper barrier enforcing clean static compilation, linting, and build integrity at all times."
                    ]
                },
                github: "https://github.com/tiberiumilitaru89/viziune-urbana-ploiesti"
            },
            proj5: {
                ro: {
                    title: "Portofoliu Tiberiu & Universal 3D Engine",
                    desc: "Platformă web ultra-performantă de prezentare profesională și demonstrare de capabilități tehnice, construită de la zero pe principii de arhitectură Zero-Defect.",
                    architecture: "Build toolchain Vite cu Vanilla ES6+ și Three.js pentru redarea pe GPU a unui univers interactiv de particule reactive. Structurat pe standarde Zero-Defect: Content Security Policy strictă fără 'unsafe-inline' în script-src, mutații DOM Zero-Trust prin API-uri native (replaceChildren, createTextNode), separare completă CSS/JS fără atribute de stil inline dinamice, terminal CLI interactiv integrat cu sandboxare de comenzi, sistem bilingv complet (RO/EN) prin I18nModule, barieră mecanică Gatekeeper și guvernanță Open Knowledge Format (OKF).",
                    results: [
                        "Scor de performanță și securitate maxim în auditurile Lighthouse și SAST/DAST (fără vulnerabilități CSP).",
                        "Zero stiluri dinamice inline și Zero innerHTML vulnerabil în întreaga logică de client.",
                        "Motor 3D optimizat pe GPU cu Three.js capabil de 60 FPS constant pe dispozitive desktop și mobile.",
                        "Terminal CLI funcțional direct în browser pentru inspecția stack-ului și navigare prin comenzi.",
                        "Sincronizare bilingvă instantanee (RO/EN) fără refacerea arborelui DOM sau pâlpâire vizuală.",
                        "Verificare mecanică deterministă la build prin scriptul Gatekeeper și trasabilitate OKF în .knowledge/."
                    ]
                },
                en: {
                    title: "Tiberiu Portfolio & Universal 3D Engine",
                    desc: "Ultra-fast professional engineering portfolio and technical demonstration platform, engineered from scratch adhering to Zero-Defect principles.",
                    architecture: "Vite build toolchain with Vanilla ES6+ and Three.js rendering an interactive, GPU-accelerated particle universe. Hardened to Zero-Defect standards: strict Content Security Policy without 'unsafe-inline' in script-src, Zero-Trust DOM mutations through native APIs (replaceChildren, createTextNode), complete CSS/JS decoupling with zero dynamic inline styles, interactive client-side CLI terminal, full bilingual support (RO/EN) via I18nModule, mechanical Gatekeeper barrier, and Open Knowledge Format (OKF) governance.",
                    results: [
                        "Maximum performance and security scores across Lighthouse and SAST/DAST audits with zero CSP dilution.",
                        "Zero dynamic inline styling and Zero innerHTML vulnerabilities across all client-side modules.",
                        "GPU-accelerated Three.js particle engine delivering sustained 60 FPS across desktop and mobile devices.",
                        "Interactive browser CLI terminal providing immediate stack inspection and keyboard-driven navigation.",
                        "Seamless bilingual state switching (RO/EN) without DOM re-instantiation or visual layout shift.",
                        "Deterministic Gatekeeper verification at build time and complete architectural traceability via OKF."
                    ]
                },
                github: "https://github.com/tiberiumilitaru89/portofoliu-tiberiu"
            }
        };

        const createProjectGroup = (iconClass, labelText, content, isEmerald = false) => {
            const group = document.createElement('div');
            group.className = 'project-modal-group';

            const h4 = document.createElement('h4');
            h4.className = isEmerald ? 'project-modal-heading results-heading' : 'project-modal-heading';
            const icon = document.createElement('i');
            icon.className = iconClass;
            h4.append(icon, document.createTextNode(' ' + labelText));
            group.appendChild(h4);

            if (Array.isArray(content)) {
                const ul = document.createElement('ul');
                ul.className = isEmerald ? 'project-modal-results project-modal-list' : 'project-modal-list';
                content.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    ul.appendChild(li);
                });
                group.appendChild(ul);
            } else {
                const p = document.createElement('p');
                if (isEmerald) p.className = 'project-modal-results';
                p.textContent = content;
                group.appendChild(p);
            }

            return group;
        };

        const openModal = (id) => {
            const data = projectData[id];
            if (!data || !modal) return;

            const lang = I18nModule.getCurrentLang();
            const info = data[lang] || data.ro;

            if (modalTitle) modalTitle.textContent = info.title;
            if (modalBody) {
                const labelProblem = lang === 'en' ? 'Problem Solved:' : 'Problema Rezolvată:';
                const labelArch = lang === 'en' ? 'Architecture & Stack:' : 'Arhitectură & Implementare:';
                const labelResults = lang === 'en' ? 'Tangible Results:' : 'Rezultate Tangibile:';

                modalBody.replaceChildren(
                    createProjectGroup('fa-solid fa-bullseye', labelProblem, info.desc),
                    createProjectGroup('fa-solid fa-code', labelArch, info.architecture),
                    createProjectGroup('fa-solid fa-chart-line', labelResults, info.results, true)
                );
            }

            if (githubLink) {
                if (data.github) {
                    githubLink.classList.remove('hidden');
                    githubLink.href = data.github;
                } else {
                    githubLink.classList.add('hidden');
                }
            }

            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
        };

        const closeModal = () => {
            if (!modal) return;
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('modal-open');
        };

        document.querySelectorAll('.btn-project-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-target');
                if (id) openModal(id);
            });
        });

        closeBtn?.addEventListener('click', closeModal);
        dismissBtn?.addEventListener('click', closeModal);
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        const handleEscape = (e) => {
            if ((e.key === 'Escape' || e.key === 'Esc') && modal?.classList.contains('active')) {
                closeModal();
            }
        };
        window.addEventListener('keydown', handleEscape);
        document.addEventListener('keydown', handleEscape);
    })();


    // ==========================================================================
    // 9. TOAST NOTIFICATIONS
    // ==========================================================================
    ToastModule = (() => {
        const container = document.getElementById('toastContainer');

        const show = (message, type = 'success', duration = 4500) => {
            if (!container) return;
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;

            const iconClass = type === 'success' 
                ? 'fa-solid fa-circle-check' 
                : (type === 'info' ? 'fa-solid fa-circle-info' : 'fa-solid fa-circle-exclamation');
            
            const icon = document.createElement('i');
            icon.className = iconClass;
            const span = document.createElement('span');
            span.textContent = message;

            toast.appendChild(icon);
            toast.appendChild(document.createTextNode(' '));
            toast.appendChild(span);

            container.appendChild(toast);

            setTimeout(() => {
                toast.classList.add('toast--hide');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        };

        return { show };
    })();


    // ==========================================================================
    // 10. SECURE CONTACT FORM (With Honeypot, Validation & Email Delivery)
    // ==========================================================================
    ContactFormModule = (() => {
        const form = document.getElementById('contactForm');
        if (!form) return;

        let formInitTime = Date.now();

        const nameInput = document.getElementById('senderName');
        const emailInput = document.getElementById('senderEmail');
        const messageInput = document.getElementById('senderMessage');
        const submitBtn = document.getElementById('submitContactBtn');

        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const messageError = document.getElementById('messageError');

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        const validate = () => {
            let isValid = true;
            const lang = I18nModule.getCurrentLang();

            // Name
            if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
                nameError.textContent = lang === 'ro' ? "Te rog să introduci numele complet." : "Please enter your name.";
                isValid = false;
            } else {
                nameError.textContent = "";
            }

            // Email
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                emailError.textContent = lang === 'ro' ? "Te rog să introduci o adresă de email validă." : "Please enter a valid email address.";
                isValid = false;
            } else {
                emailError.textContent = "";
            }

            // Message
            if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
                messageError.textContent = lang === 'ro' ? "Mesajul trebuie să aibă minim 10 caractere." : "Message must be at least 10 characters.";
                isValid = false;
            } else {
                messageError.textContent = "";
            }

            return isValid;
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Honeypot check for bots
            const honeypot = document.getElementById('_gotcha');
            if (honeypot && honeypot.value) {
                // Silently discard spam bots
                ToastModule.show("Mesaj transmis!", 'success');
                form.reset();
                return;
            }

            if (!validate()) return;

            const lang = I18nModule.getCurrentLang();
            const originalBtnContent = Array.from(submitBtn.childNodes).map(n => n.cloneNode(true));
            submitBtn.disabled = true;
            const spinner = document.createElement('i');
            spinner.className = 'fa-solid fa-spinner fa-spin';
            submitBtn.replaceChildren(spinner, document.createTextNode(lang === 'ro' ? ' Se trimite...' : ' Sending...'));

            const interactionDuration = Date.now() - formInitTime;

            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                _replyto: emailInput.value.trim(),
                service: document.getElementById('projectType')?.value || 'General',
                message: messageInput.value.trim(),
                _formDuration: interactionDuration
            };

            try {
                /**
                 * Endpoint securizat prin Vercel Serverless Functions & Resend API
                 * (Dual-dispatch: alertă administrator + confirmare automată client)
                 */
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ ...formData, _gotcha: honeypot ? honeypot.value : '' })
                });

                if (response.ok) {
                    ToastModule.show(
                        lang === 'ro' 
                            ? "Mesajul tău a fost trimis cu succes! Te voi contacta în cel mai scurt timp." 
                            : "Your message was sent successfully! I will get back to you shortly.",
                        'success'
                    );
                    form.reset();
                    formInitTime = Date.now();
                } else {
                    let errPayload = null;
                    try {
                        errPayload = await response.json();
                    } catch (_) {
                        errPayload = null;
                    }

                    if (response.status === 429) {
                        ToastModule.show(
                            lang === 'ro'
                                ? "Ai depășit limita temporară de mesaje. Te rog să aștepți un minut sau să mă contactezi direct pe WhatsApp la (+40) 720 955 119."
                                : "Rate limit exceeded. Please wait a minute or contact me directly via WhatsApp at (+40) 720 955 119.",
                            'warning',
                            7000
                        );
                    } else if (response.status === 400) {
                        const errorMsg = errPayload?.error || (lang === 'ro' ? "Te rog să verifici corectitudinea câmpurilor completate." : "Please check your form inputs.");
                        ToastModule.show(errorMsg, 'error', 6000);
                    } else {
                        ToastModule.show(
                            lang === 'ro'
                                ? "Serviciul de email a întâmpinat o eroare temporară. Mesajul a rămas salvat în formular — mă poți contacta direct pe WhatsApp la (+40) 720 955 119!"
                                : "The email service experienced a temporary error. Your message is preserved in the form — contact me on WhatsApp at (+40) 720 955 119!",
                            'error',
                            8000
                        );
                    }
                    // Notă: NU apelăm form.reset() pentru ca vizitatorul să nu piardă textul tastat!
                }
            } catch (error) {
                // Dacă rețeaua e offline sau blocată de extensii, textul rămâne intact în formular
                ToastModule.show(
                    lang === 'ro'
                        ? "Eroare de conexiune la rețea. Mesajul tău a rămas salvat în formular — mă poți contacta direct pe WhatsApp la (+40) 720 955 119 sau prin email!"
                        : "Network connection error. Your message is preserved in the form — please contact me on WhatsApp at (+40) 720 955 119 or via email!",
                    'error',
                    8000
                );
            } finally {
                submitBtn.disabled = false;
                submitBtn.replaceChildren(...originalBtnContent);
            }
        });
    })();


    // ==========================================================================
    // 11. PRINT / DOWNLOAD CV CONTROLLER
    // ==========================================================================
    PrintCvModule = (() => {
        const triggers = document.querySelectorAll('.print-cv-trigger, #quickCvBtn');
        triggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const lang = I18nModule.getCurrentLang();
                ToastModule.show(
                    lang === 'ro' 
                        ? 'Descărcarea CV-ului (PDF) a început!' 
                        : 'CV (PDF) download initiated!',
                    'success',
                    3500
                );
            });
        });
    })();

});
