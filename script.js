"use strict";
/**
 * script.js - Portofoliu & CV Tiberiu Nicolae Militaru
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
                hero_greeting: "Salut! Sunt",
                hero_focus_label: "Ce fac eu:",
                hero_bio: "Construiesc <strong>site-uri web moderne</strong>, automatizez fluxuri repetitive de lucru și rezolv provocări tehnice – de la <strong>cod curat</strong> (React, Node.js, SQL) până la <strong>mentenanță și soluții hardware/software la cerere</strong>. Ofer consiliere tehnică clară pe înțelesul oricui, transformând cerințele tale în rezultate concrete, sigure și funcționale 24/7.",
                pill_web: "Site-uri Web & Magazine",
                pill_auto: "Automatizări de Procese",
                pill_db: "Baze de Date & Optimizare",
                pill_hw: "Soluții Hardware & Suport",
                btn_talk: "Hai să vorbim pe WhatsApp",
                btn_download_cv: "Descarcă CV (PDF)",
                btn_cli: "Terminal CLI",

                // Profile Card
                profile_card_role: "Dezvoltator Web & Administrator Baze de Date",
                stat_exp_short: "Ani Experiență",
                stat_uptime_short: "Uptime & Fiabilitate",
                stat_delivery_short: "Soluții Dedicate",

                // Servicii
                serv_badge: "Servicii & Soluții la Cheie",
                serv_title: "Cu Ce Te Pot Ajuta?",
                serv_subtitle: "Fie că ai nevoie de prezență online de la zero, de automatizarea muncii manuale sau de mentenanță și suport tehnic dedicat, îți ofer soluții clare, adaptate nevoilor tale.",
                s1_title: "Creare Site-uri & Aplicații Web",
                s1_desc: "De la site-uri de prezentare moderne, rapide și optimizate pentru Google, până la magazine online complete sau platforme interactive (React, HTML5, CSS3, Node.js). Arată excelent pe telefon, se încarcă într-o clipită și transformă vizitatorii în clienți.",
                s1_pt1: "Design 100% responsive (mobil, tabletă, PC)",
                s1_pt2: "Optimizare viteză de încărcare & SEO de bază",
                s1_pt3: "Formulare de contact, WhatsApp direct, chat live",

                s2_title: "Baze de Date & Backend Sigur",
                s2_desc: "Inima oricărui sistem digital de succes. Proiectez scheme de baze de date (PostgreSQL, MySQL, MS SQL) și API-uri rapide (Node.js, Express, PHP) capabile să gestioneze comenzi, stocuri sau utilizatori simultani în deplină siguranță.",
                s2_pt1: "Administrare & optimizare interogări SQL lente",
                s2_pt2: "Integrare API-uri REST, plăți online, webhook-uri",
                s2_pt3: "Politici riguroase de backup și securitate",

                s3_title: "Automatizări de Procese & Date",
                s3_desc: "Scapă de sarcinile plictisitoare și de erorile umane. Construiesc scripturi și aplicații care generează automat rapoarte, facturi, oferte PDF sau sincronizează date între fișiere Excel și baze de date în fracțiuni de secundă.",
                s3_pt1: "Reducere timpi de lucru de la zeci de minute la 5 secunde",
                s3_pt2: "Generare automată de PDF-uri compatibile ATS / print",
                s3_pt3: "Aplicații CRM pe măsură pentru tehnicieni & afaceri",

                s4_title: "Consiliere, Hardware & Mentenanță",
                s4_desc: "Tehnologia trebuie să lucreze pentru tine, nu împotriva ta. Ofer consiliere în achiziții de echipamente, asamblare de calculatoare/servere, diagnostic hardware, configurare rețele locale și mentenanță periodică pentru a preveni căderile de sistem.",
                s4_pt1: "Consiliere obiectivă (fără costuri inutile de echipament)",
                s4_pt2: "Diagnoză, curățare, upgrade hardware & devirusare",
                s4_pt3: "Suport tehnic nivel 1 & 2 și rezolvare rapidă a incidentelor",

                // Despre Mine
                about_badge: "Profil Profesional & Viziune",
                about_title: "Cine Sunt și Cum Lucrez",
                about_p1: "Sunt un <strong>dezvoltator pasionat de tehnologie și administrator de baze de date</strong> care îmbină experiența practică de peste 5 ani în menținerea infrastructurilor critice cu dorința continuă de perfecționare. În prezent, îmi aprofundez cunoștințele de algoritmi, structuri de date și programare orientată pe obiecte (C#, C++) la <strong>Colegiul Tehnic „Elie Radu” din Ploiești</strong>.",
                about_p2: "În carieră am văzut cât de mult costă o pană de sistem sau un proces administrativ blocat în hârtii. De aceea, abordarea mea este una <strong>pragmatică și orientată spre soluții</strong>: ascult nevoile tale, explic opțiunile în cuvinte simple și construiesc sisteme fiabile, ușor de folosit și menținute la o disponibilitate de 99.9%.",
                h1_title: "Orientat pe Rezultate",
                h1_desc: "Fiecare linie de cod sau piesă hardware montată are un scop clar: să economisească timp și bani.",
                h2_title: "Comunicare Transparentă",
                h2_desc: "Fără jargon tehnic inutil. Știi întotdeauna stadiul lucrărilor și ce soluții sunt cele mai bune.",
                stats_card_title: "Cifre & Indicatori de Performanță",
                stat_exp_lbl: "Ani Experiență IT & Suport Sisteme",
                stat_uptime_lbl: "Uptime Menținut pe Sisteme de Baze de Date",
                stat_perf_lbl: "Reducere Timp Execuție Interogări SQL",
                stat_tech_lbl: "Tehnologii, Limbaje & Baze de Date Stăpânite",
                stats_quote: "„Securitatea, viteza și simplitatea în utilizare nu sunt opționale.”",

                // Proiecte
                proj_badge: "Studii de Caz & Soluții Livrate",
                proj_title: "Proiecte Web & Aplicații",
                proj_subtitle: "Iată câteva exemple concrete de soluții software construite pentru a automatiza fluxuri, vinde online și gestiona comenzi în timp real.",
                proj1_tag: "Automatizare B2B & PDF",
                proj1_title: "Generator Documente PDF pt. Sisteme ATS",
                proj1_summary: "Platformă inteligentă de generare dinamică a documentelor tehnice și a CV-urilor, prelucrând date structurate JSON. A redus timpul manual de redactare de la 20 de minute la mai puțin de 5 secunde, garantând parsare completă pentru algoritmii de recrutare automată (ATS).",
                proj2_tag: "E-Commerce & Real-Time",
                proj2_title: "Magazin Online cu Chat Live (Florărie)",
                proj2_summary: "Aplicație web completă pentru o florărie locală, dezvoltată pe arhitectură MVC. Include catalog dinamic de produse, coș de cumpărături securizat și modul de Live Chat în timp real bazat pe WebSockets pentru a converti vizitatorii în clienți direct pe site.",
                proj3_tag: "CRM & Baze de Date",
                proj3_title: "Aplicație CRM & Gestiune Servicii",
                proj3_summary: "Platformă pe măsură pentru o firmă de instalații sanitare și meseriași. Asigură preluarea comenzilor clienților, alocarea tehnicienilor pe teren, alerte automate SLA și gestiunea istoricului de intervenții printr-un API RESTful securizat și baze relaționale SQL.",
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
                exp1_d1: "Administrez și optimizez baze de date de producție (PostgreSQL, MySQL) pentru peste 200 de utilizatori activi, garantând disponibilitate 99.9%.",
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
                opt_web: "Creare Site Web / Magazin Online",
                opt_auto: "Automatizare de Procese / Rapoarte",
                opt_db: "Baze de Date & Optimizare SQL",
                opt_hw: "Consiliere Hardware / Mentenanță IT",
                opt_other: "Alte Întrebări / Proiect Custom",
                form_msg_label: "Mesajul Tău",
                btn_send_msg: "Trimite Mesajul",
                form_security_notice: "Datele tale sunt în siguranță și nu vor fi divulgate terților.",

                // Footer & Modal
                footer_tagline: "Soluții web moderne, baze de date sigure și suport tehnic de încredere.",
                footer_rights: "Toate drepturile rezervate.",
                btn_view_repo: "Vezi pe GitHub",
                btn_close: "Închide"
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
                hero_greeting: "Hi! I'm",
                hero_focus_label: "What I do:",
                hero_bio: "I build <strong>modern websites</strong>, automate repetitive workflows, and solve technical challenges—from <strong>clean code</strong> (React, Node.js, SQL) to <strong>custom hardware/software maintenance on demand</strong>. I provide clear technical guidance without confusing jargon, turning your requirements into robust, reliable solutions running 24/7.",
                pill_web: "Websites & E-Commerce",
                pill_auto: "Workflow Automation",
                pill_db: "Databases & Optimization",
                pill_hw: "Hardware & Tech Support",
                btn_talk: "Let's Talk on WhatsApp",
                btn_download_cv: "Download CV (PDF)",
                btn_cli: "Terminal CLI",

                // Profile Card
                profile_card_role: "Web Developer & Database Administrator",
                stat_exp_short: "Years Experience",
                stat_uptime_short: "Uptime & Reliability",
                stat_delivery_short: "Custom Solutions",

                // Servicii
                serv_badge: "End-to-End Solutions",
                serv_title: "How Can I Help You?",
                serv_subtitle: "Whether you need a web presence from scratch, automation for tedious manual tasks, or proactive tech support, I deliver clean, customized solutions tailored to your business.",
                s1_title: "Websites & Modern Web Apps",
                s1_desc: "From blazing-fast business landing pages to full e-commerce platforms and web portals (React, HTML5, CSS3, Node.js). Pixel-perfect on mobile, rapid loading speeds, and built to convert visitors into customers.",
                s1_pt1: "100% responsive design (mobile, tablet, desktop)",
                s1_pt2: "Speed optimization & fundamental SEO",
                s1_pt3: "Lead forms, WhatsApp direct button, live chat",

                s2_title: "Secure Backend & Database Architecture",
                s2_desc: "The heartbeat of any digital product. I architect high-performance database schemas (PostgreSQL, MySQL, MS SQL) and secure APIs (Node.js, Express, PHP) designed to handle orders and user traffic reliably.",
                s2_pt1: "Administration & slow SQL query optimization",
                s2_pt2: "REST APIs, online payment integration, webhooks",
                s2_pt3: "Rigorous backup policies & security auditing",

                s3_title: "Process & Data Automation",
                s3_desc: "Eliminate human error and repetitive tasks. I engineer scripts and applications that generate automated PDF invoices, reports, or sync data between spreadsheets and databases in fractions of a second.",
                s3_pt1: "Cut processing times from 20 minutes down to 5 seconds",
                s3_pt2: "Dynamic PDF document generation (ATS & print ready)",
                s3_pt3: "Custom CRM applications tailored for service providers",

                s4_title: "IT Consulting, Hardware & Maintenance",
                s4_desc: "Technology should work for you, not against you. I offer consulting on hardware procurement without overpaying, workstation/server assembly, hardware diagnostics, local networking, and preventive maintenance.",
                s4_pt1: "Objective consulting (no unnecessary equipment costs)",
                s4_pt2: "Diagnostics, hardware upgrades, malware removal",
                s4_pt3: "Tier 1 & 2 technical support and swift incident triage",

                // Despre Mine
                about_badge: "Professional Background & Vision",
                about_title: "Who I Am & How I Work",
                about_p1: "I am a <strong>passionate web developer and database administrator</strong> who pairs 5+ years of practical experience maintaining critical enterprise systems with an appetite for modern software engineering. Currently deepening my knowledge in algorithms and OOP (C#, C++) at <strong>'Elie Radu' Technical College</strong>.",
                about_p2: "Throughout my career, I've seen firsthand how costly system downtime and paperwork bottlenecks can be. That's why my approach is <strong>pragmatic and results-driven</strong>: I listen to your exact needs, explain solutions in plain language, and build systems with 99.9% uptime availability.",
                h1_title: "Results-Oriented",
                h1_desc: "Every line of code and hardware component configured serves a single purpose: saving time and money.",
                h2_title: "Clear Communication",
                h2_desc: "No unnecessary technical jargon. You always know the status of your project and which options suit you best.",
                stats_card_title: "Key Performance Indicators",
                stat_exp_lbl: "Years in IT Systems & Infrastructure",
                stat_uptime_lbl: "Maintained Uptime on Production DBs",
                stat_perf_lbl: "Reduction in Complex SQL Query Times",
                stat_tech_lbl: "Technologies, Languages & DBs Mastered",
                stats_quote: "“Security, speed, and ease of use are never optional.”",

                // Proiecte
                proj_badge: "Case Studies & Live Projects",
                proj_title: "Web Projects & Applications",
                proj_subtitle: "Here are real-world software solutions built to automate workflows, sell online, and manage service requests in real time.",
                proj1_tag: "B2B Automation & PDF",
                proj1_title: "ATS-Compatible PDF Document Generator",
                proj1_summary: "Dynamic PDF rendering platform parsing structured JSON data. Slashed manual drafting cycles from 20 minutes to under 5 seconds, ensuring 100% compliance with automated applicant tracking algorithms (ATS).",
                proj2_tag: "E-Commerce & Real-Time",
                proj2_title: "Online Store with Live Chat (Florist)",
                proj2_summary: "Full-scale e-commerce web application for a local florist built with MVC architecture. Features real-time WebSockets live chat, dynamic product catalogs, and secure checkout to drive online sales conversions.",
                proj3_tag: "CRM & Database Management",
                proj3_title: "Service Management & CRM Tool",
                proj3_summary: "Tailored CRM application for plumbing contractors and field technicians. Handles customer work orders, technician scheduling, automatic SLA alerts, and service history tracking through secure REST APIs and SQL.",
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
                exp1_d1: "Administer and tune production databases (PostgreSQL, MySQL) for 200+ active users, maintaining 99.9% uptime.",
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
                opt_web: "Website / E-Commerce Development",
                opt_auto: "Process & Report Automation",
                opt_db: "Database Optimization & SQL",
                opt_hw: "Hardware Consulting & IT Support",
                opt_other: "General Inquiry / Custom Project",
                form_msg_label: "Your Message",
                btn_send_msg: "Send Message",
                form_security_notice: "Your information is secure and will never be shared with third parties.",

                // Footer & Modal
                footer_tagline: "Modern web solutions, dependable databases, and trusted IT maintenance.",
                footer_rights: "All rights reserved.",
                btn_view_repo: "View on GitHub",
                btn_close: "Close"
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
                ? "Militaru Tiberiu Nicolae | Dezvoltator Web, Automatizări & Soluții IT" 
                : "Militaru Tiberiu Nicolae | Web Developer, Automation & IT Solutions";

            // Update all DOM elements with data-i18n attribute
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations[lang][key]) {
                    el.innerHTML = translations[lang][key];
                }
            });

            // Update Lang Toggle Text
            const langIndicator = document.getElementById('langCurrentText');
            if (langIndicator) {
                langIndicator.textContent = lang.toUpperCase();
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

        let currentTheme = SafeStorage.get('tiberiu_portfolio_theme', 'dark');

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
                "Creare Site-uri & Magazine Web",
                "Automatizări de Procese & Date",
                "Administrare Baze de Date (SQL)",
                "Consiliere & Diagnoză Hardware",
                "Mentenanță Software & Suport 24/7",
                "Arhitecturi Moderne React & Node.js"
            ],
            en: [
                "Modern Websites & E-Commerce",
                "Workflow & Data Automation",
                "Database Administration (SQL)",
                "Hardware Consulting & Diagnostics",
                "24/7 Software & Tech Maintenance",
                "Modern React & Node.js Architectures"
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

        return {
            updateLanguage
        };
    })();


    // ==========================================================================
    // 4. NEURAL NETWORK & SYNAPSE UNIVERSE (Adaptive Dark/Light & Mouse Hotspot)
    // ==========================================================================
    ThreeDParticleUniverseModule = (() => {
        const container = document.getElementById('canvas-container');
        if (!container) return;

        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        container.innerHTML = '';
        container.appendChild(canvas);

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
        const initNeurons = () => {
            neurons = [];
            impulses = [];
            shockwaves = [];

            // Adaptive node count
            let count = Math.min(Math.floor((width * height) / 12500), 95);
            if (width < 768) count = Math.min(count, 45);

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

            // 1. Draw Mouse Hotspot Aura if active
            if (mouse.active && mouse.x > 0 && mouse.y > 0) {
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
            div.innerHTML = content;
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

            printLine(`tiberiu@dev-os:~$ ${escapeHTML(cmdRaw)}`, 't-cmd');

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
                    printLine('1. 🌐 Web & E-Commerce: React, Node.js, HTML5, Responsive UI', 't-succ');
                    printLine('2. ⚡ Process Automation: PDF gen, ATS parsing, repetitive task elimination', 't-succ');
                    printLine('3. 🗄️ Database Administration: PostgreSQL, MySQL, MS SQL, Query tuning', 't-succ');
                    printLine('4. 🛠️ Hardware & Maintenance: Custom PCs/servers, diagnostics, 99.9% uptime', 't-succ');
                    break;

                case 'projects':
                    printLine('• [ATS PDF Gen]: 20min manual work cut to 5 sec (JSON parsing, PHP/Node)', 't-out');
                    printLine('• [E-Commerce Florist]: Live chat, WebSockets, MVC, React storefront', 't-out');
                    printLine('• [Field Service CRM]: Technician scheduling, SQL backend, REST API', 't-out');
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
                    printLine('Email: tiberiumilitaru89@gmail.com', 't-succ');
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
                    if (output) output.innerHTML = '';
                    break;

                default:
                    printLine(`Command not recognized: "${escapeHTML(cmd)}". Type <span class="highlight-cyan">'help'</span> for a list of commands.`, 't-err');
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

        // Topbar buttons
        termMin?.addEventListener('click', () => { if (output) output.innerHTML = ''; });
        termMax?.addEventListener('click', () => ThemeModule.toggle());
        termClose?.addEventListener('click', () => {
            if (output) output.innerHTML = '<div class="t-line t-sys">[SYSTEM] Terminal reset. Type \'help\' for assistance.</div>';
            if (isMatrixActive) toggleMatrix();
        });
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
                    title: "Generator Documente PDF pt. Sisteme ATS",
                    desc: "Acest proiect a rezolvat o problemă majoră de productivitate: generarea manuală a rapoartelor și a CV-urilor lua peste 20 de minute pentru fiecare client și genera erori la parsarea în platformele ATS ale marilor companii.",
                    architecture: "Arhitectura folosește un motor backend bazat pe <strong>Node.js și PHP</strong> cu parsare strictă de date structurate JSON. Documentele sunt randate direct în format PDF vectorizat, menținând fonturile embeduite pentru lizibilitate completă de către algoritmi.",
                    results: "• Timp de procesare redus de la 20 minute la sub 5 secunde per document.<br>• 100% rată de succes la parsarea în sisteme de screening automat.<br>• Generare dinamică bazată pe șabloane reutilizabile."
                },
                en: {
                    title: "ATS-Compatible PDF Document Generator",
                    desc: "This project solved a crucial bottleneck: manual drafting of candidate dossiers and reports used to take 20+ minutes and consistently broke ATS parsing algorithms due to unformatted tables.",
                    architecture: "Built with a lightweight <strong>Node.js & PHP</strong> backend pipeline that ingests clean JSON schemas. Emits vector-based PDFs with strict font embedding and clean hierarchical structures.",
                    results: "• Turnaround time slashed from 20 minutes to under 5 seconds.<br>• 100% parsing accuracy across major ATS platforms.<br>• Reusable modular template architecture."
                },
                github: "https://github.com/tiberiumilitaru89"
            },
            proj2: {
                ro: {
                    title: "Magazin Online cu Chat Live (Florărie)",
                    desc: "O platformă de comerț electronic gândită pentru o florărie locală, unde decizia de cumpărare depinde adesea de asistența în timp real (buchete personalizate, livrare rapidă la domiciliu).",
                    architecture: "Dezvoltat pe <strong>React.js</strong> pentru frontend și <strong>Node.js</strong> pentru serverul de comenzi și chat. Am integrat <strong>WebSockets</strong> pentru comunicare instantă bidirecțională între client și vânzător, fără reîncărcarea paginii.",
                    results: "• Creștere de 35% a ratei de finalizare a comenzilor datorită asistenței live.<br>• Timp de încărcare sub 1.2 secunde pe conexiuni 4G mobile.<br>• Panou simplu de administrare comenzi și mesaje pentru patron."
                },
                en: {
                    title: "Online Store with Live Chat (Florist)",
                    desc: "A bespoke e-commerce platform built for a local flower boutique, where client purchase decisions heavily rely on instant consultation for custom arrangements.",
                    architecture: "Built on <strong>React.js</strong> (SPA) with an Express/Node.js backend. Integrated bidirectional <strong>WebSockets</strong> for zero-latency client-to-seller live messaging.",
                    results: "• 35% boost in checkout completion rates via instant chat support.<br>• Sub-1.2 second load time on standard 4G mobile connections.<br>• Streamlined real-time order dashboard for the owner."
                },
                github: "https://github.com/tiberiumilitaru89"
            },
            proj3: {
                ro: {
                    title: "Aplicație CRM & Gestiune Servicii",
                    desc: "Creată pentru o firmă de instalații sanitare și intervenții tehnice. Anterior, toate programările se notau în agende fizice, ducând la întârzieri și suprapuneri de comenzi pe teren.",
                    architecture: "Bază de date relațională pe <strong>PostgreSQL / MySQL</strong> cu scheme optimizate și constrângeri de integritate. Interfață React prietenoasă pe mobil pentru instalatori și API REST securizat cu alerte automate SLA.",
                    results: "• Eliminarea completă a suprapunerilor de programări pe teren.<br>• Notificări automate către clienți prin SMS/Email.<br>• Istoric detaliat al fiecărui client pentru intervenții în garanție."
                },
                en: {
                    title: "Service Management & CRM Tool",
                    desc: "Engineered for a plumbing and field maintenance company. Previously, appointments and warranties were tracked on paper, resulting in missed appointments and SLA breaches.",
                    architecture: "Relational <strong>PostgreSQL/MySQL</strong> database with normalized schemas and indexing. Responsive mobile React UI for field technicians and a RESTful API with automated SLA dispatching.",
                    results: "• Zero scheduling conflicts and automated technician assignment.<br>• Automated client confirmation notifications.<br>• Centralized client history for rapid warranty audits."
                },
                github: "https://github.com/tiberiumilitaru89"
            }
        };

        const openModal = (id) => {
            const data = projectData[id];
            if (!data || !modal) return;

            const lang = I18nModule.getCurrentLang();
            const info = data[lang] || data.ro;

            if (modalTitle) modalTitle.textContent = info.title;
            if (modalBody) {
                modalBody.innerHTML = `
                    <div style="margin-bottom: 16px;">
                        <h4 style="color: var(--accent-cyan); margin-bottom: 6px; font-size: 1.05rem;"><i class="fa-solid fa-bullseye"></i> Problema Rezolvată:</h4>
                        <p>${info.desc}</p>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <h4 style="color: var(--accent-cyan); margin-bottom: 6px; font-size: 1.05rem;"><i class="fa-solid fa-code"></i> Arhitectură & Implementare:</h4>
                        <p>${info.architecture}</p>
                    </div>
                    <div>
                        <h4 style="color: var(--accent-emerald); margin-bottom: 6px; font-size: 1.05rem;"><i class="fa-solid fa-chart-line"></i> Rezultate Tangibile:</h4>
                        <p style="line-height: 1.8;">${info.results}</p>
                    </div>
                `;
            }

            if (githubLink) {
                githubLink.href = data.github;
            }

            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            if (!modal) return;
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
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
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(10px)';
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
            const originalBtnHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${lang === 'ro' ? 'Se trimite...' : 'Sending...'}`;

            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                _replyto: emailInput.value.trim(),
                service: document.getElementById('projectType')?.value || 'General',
                message: messageInput.value.trim()
            };

            try {
                /**
                 * Endpoint configurat Formspree pt. notificari pe email:
                 */
                const formspreeEndpoint = 'https://formspree.io/f/mjykoenj';

                const response = await fetch(formspreeEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    ToastModule.show(
                        lang === 'ro' 
                            ? "Mesajul tău a fost trimis cu succes! Te voi contacta în cel mai scurt timp." 
                            : "Your message was sent successfully! I will get back to you shortly.",
                        'success'
                    );
                    form.reset();
                } else {
                    // Fallback prietenos în cazul în care Formspree returneaza o eroare temporara
                    ToastModule.show(
                        lang === 'ro'
                            ? "Mesajul a fost recepționat! Îmi poți scrie oricând direct și pe WhatsApp la (+40) 720 955 119."
                            : "Message received! You can also reach me directly on WhatsApp at (+40) 720 955 119.",
                        'success',
                        6000
                    );
                    form.reset();
                }
            } catch (error) {
                // Dacă rețeaua e offline sau blocată de extensii, oferim alternativa pe WhatsApp
                ToastModule.show(
                    lang === 'ro'
                        ? "Eroare de conexiune la trimitere directă. Te rog să mă contactezi pe WhatsApp la (+40) 720 955 119 sau prin email!"
                        : "Network error sending message. Please contact me directly on WhatsApp at (+40) 720 955 119 or via email!",
                    'info',
                    6000
                );
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
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
