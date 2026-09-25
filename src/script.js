"use strict";
/**
 * script.js - Portofoliu & CV Tiberiu Nicolae Militaru
 * ArhitecturÄƒ modularÄƒ, securizatÄƒ, optimizatÄƒ pentru performanÈ›Äƒ & Vercel
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
                nav_home: "AcasÄƒ",
                nav_services: "Servicii",
                nav_about: "Despre Mine",
                nav_projects: "Portofoliu",
                nav_skills: "CompetenÈ›e",
                nav_experience: "ExperienÈ›Äƒ",
                nav_terminal: "Terminal",
                nav_contact: "Contact",
                nav_btn_cv: "CV PDF",
                btn_print_cv: "DescarcÄƒ CV (PDF)",

                // Hero
                hero_status: "Disponibil pentru Proiecte & ColaborÄƒri",
                hero_greeting: "Salut! Sunt",
                hero_focus_label: "Ce fac eu:",
                hero_bio: "Construiesc <strong>site-uri web moderne</strong>, automatizez fluxuri repetitive de lucru È™i rezolv provocÄƒri tehnice â€“ de la <strong>cod curat</strong> (React, Node.js, SQL) pÃ¢nÄƒ la <strong>mentenanÈ›Äƒ È™i soluÈ›ii hardware/software la cerere</strong>. Ofer consiliere tehnicÄƒ clarÄƒ pe Ã®nÈ›elesul oricui, transformÃ¢nd cerinÈ›ele tale Ã®n rezultate concrete, sigure È™i funcÈ›ionale 24/7.",
                pill_web: "Site-uri Web & Magazine",
                pill_auto: "AutomatizÄƒri de Procese",
                pill_db: "Baze de Date & Optimizare",
                pill_hw: "SoluÈ›ii Hardware & Suport",
                btn_talk: "Hai sÄƒ vorbim pe WhatsApp",
                btn_download_cv: "DescarcÄƒ CV (PDF)",
                btn_cli: "Terminal CLI",

                // Profile Card
                profile_card_role: "Dezvoltator Web & Administrator Baze de Date",
                stat_exp_short: "Ani ExperienÈ›Äƒ",
                stat_uptime_short: "Uptime & Fiabilitate",
                stat_delivery_short: "SoluÈ›ii Dedicate",

                // Servicii
                serv_badge: "Servicii & SoluÈ›ii la Cheie",
                serv_title: "Cu Ce Te Pot Ajuta?",
                serv_subtitle: "Fie cÄƒ ai nevoie de prezenÈ›Äƒ online de la zero, de automatizarea muncii manuale sau de mentenanÈ›Äƒ È™i suport tehnic dedicat, Ã®È›i ofer soluÈ›ii clare, adaptate nevoilor tale.",
                s1_title: "Creare Site-uri & AplicaÈ›ii Web",
                s1_desc: "De la site-uri de prezentare moderne, rapide È™i optimizate pentru Google, pÃ¢nÄƒ la magazine online complete sau platforme interactive (React, HTML5, CSS3, Node.js). AratÄƒ excelent pe telefon, se Ã®ncarcÄƒ Ã®ntr-o clipitÄƒ È™i transformÄƒ vizitatorii Ã®n clienÈ›i.",
                s1_pt1: "Design 100% responsive (mobil, tabletÄƒ, PC)",
                s1_pt2: "Optimizare vitezÄƒ de Ã®ncÄƒrcare & SEO de bazÄƒ",
                s1_pt3: "Formulare de contact, WhatsApp direct, chat live",

                s2_title: "Baze de Date & Backend Sigur",
                s2_desc: "Inima oricÄƒrui sistem digital de succes. Proiectez scheme de baze de date (PostgreSQL, MySQL, MS SQL) È™i API-uri rapide (Node.js, Express, PHP) capabile sÄƒ gestioneze comenzi, stocuri sau utilizatori simultani Ã®n deplinÄƒ siguranÈ›Äƒ.",
                s2_pt1: "Administrare & optimizare interogÄƒri SQL lente",
                s2_pt2: "Integrare API-uri REST, plÄƒÈ›i online, webhook-uri",
                s2_pt3: "Politici riguroase de backup È™i securitate",

                s3_title: "AutomatizÄƒri de Procese & Date",
                s3_desc: "ScapÄƒ de sarcinile plictisitoare È™i de erorile umane. Construiesc scripturi È™i aplicaÈ›ii care genereazÄƒ automat rapoarte, facturi, oferte PDF sau sincronizeazÄƒ date Ã®ntre fiÈ™iere Excel È™i baze de date Ã®n fracÈ›iuni de secundÄƒ.",
                s3_pt1: "Reducere timpi de lucru de la zeci de minute la 5 secunde",
                s3_pt2: "Generare automatÄƒ de PDF-uri compatibile ATS / print",
                s3_pt3: "AplicaÈ›ii CRM pe mÄƒsurÄƒ pentru tehnicieni & afaceri",

                s4_title: "Consiliere, Hardware & MentenanÈ›Äƒ",
                s4_desc: "Tehnologia trebuie sÄƒ lucreze pentru tine, nu Ã®mpotriva ta. Ofer consiliere Ã®n achiziÈ›ii de echipamente, asamblare de calculatoare/servere, diagnostic hardware, configurare reÈ›ele locale È™i mentenanÈ›Äƒ periodicÄƒ pentru a preveni cÄƒderile de sistem.",
                s4_pt1: "Consiliere obiectivÄƒ (fÄƒrÄƒ costuri inutile de echipament)",
                s4_pt2: "DiagnozÄƒ, curÄƒÈ›are, upgrade hardware & devirusare",
                s4_pt3: "Suport tehnic nivel 1 & 2 È™i rezolvare rapidÄƒ a incidentelor",

                // Despre Mine
                about_badge: "Profil Profesional & Viziune",
                about_title: "Cine Sunt È™i Cum Lucrez",
                about_p1: "Sunt un <strong>dezvoltator pasionat de tehnologie È™i administrator de baze de date</strong> care Ã®mbinÄƒ experienÈ›a practicÄƒ de peste 5 ani Ã®n menÈ›inerea infrastructurilor critice cu dorinÈ›a continuÄƒ de perfecÈ›ionare. ÃŽn prezent, Ã®mi aprofundez cunoÈ™tinÈ›ele de algoritmi, structuri de date È™i programare orientatÄƒ pe obiecte (C#, C++) la <strong>Colegiul Tehnic â€žElie Raduâ€ din PloieÈ™ti</strong>.",
                about_p2: "ÃŽn carierÄƒ am vÄƒzut cÃ¢t de mult costÄƒ o panÄƒ de sistem sau un proces administrativ blocat Ã®n hÃ¢rtii. De aceea, abordarea mea este una <strong>pragmaticÄƒ È™i orientatÄƒ spre soluÈ›ii</strong>: ascult nevoile tale, explic opÈ›iunile Ã®n cuvinte simple È™i construiesc sisteme fiabile, uÈ™or de folosit È™i menÈ›inute la o disponibilitate de 99.9%.",
                h1_title: "Orientat pe Rezultate",
                h1_desc: "Fiecare linie de cod sau piesÄƒ hardware montatÄƒ are un scop clar: sÄƒ economiseascÄƒ timp È™i bani.",
                h2_title: "Comunicare TransparentÄƒ",
                h2_desc: "FÄƒrÄƒ jargon tehnic inutil. È˜tii Ã®ntotdeauna stadiul lucrÄƒrilor È™i ce soluÈ›ii sunt cele mai bune.",
                stats_card_title: "Cifre & Indicatori de PerformanÈ›Äƒ",
                stat_exp_lbl: "Ani ExperienÈ›Äƒ IT & Suport Sisteme",
                stat_uptime_lbl: "Uptime MenÈ›inut pe Sisteme de Baze de Date",
                stat_perf_lbl: "Reducere Timp ExecuÈ›ie InterogÄƒri SQL",
                stat_tech_lbl: "Tehnologii, Limbaje & Baze de Date StÄƒpÃ¢nite",
                stats_quote: "â€žSecuritatea, viteza È™i simplitatea Ã®n utilizare nu sunt opÈ›ionale.â€",

                // Proiecte
                proj_badge: "Studii de Caz & SoluÈ›ii Livrate",
                proj_title: "Proiecte Web & AplicaÈ›ii",
                proj_subtitle: "IatÄƒ cÃ¢teva exemple concrete de soluÈ›ii software construite pentru a automatiza fluxuri, vinde online È™i gestiona comenzi Ã®n timp real.",
                proj1_tag: "Automatizare B2B & PDF",
                proj1_title: "Generator Documente PDF pt. Sisteme ATS",
                proj1_summary: "PlatformÄƒ inteligentÄƒ de generare dinamicÄƒ a documentelor tehnice È™i a CV-urilor, prelucrÃ¢nd date structurate JSON. A redus timpul manual de redactare de la 20 de minute la mai puÈ›in de 5 secunde, garantÃ¢nd parsare completÄƒ pentru algoritmii de recrutare automatÄƒ (ATS).",
                proj2_tag: "E-Commerce & Real-Time",
                proj2_title: "Magazin Online cu Chat Live (FlorÄƒrie)",
                proj2_summary: "AplicaÈ›ie web completÄƒ pentru o florÄƒrie localÄƒ, dezvoltatÄƒ pe arhitecturÄƒ MVC. Include catalog dinamic de produse, coÈ™ de cumpÄƒrÄƒturi securizat È™i modul de Live Chat Ã®n timp real bazat pe WebSockets pentru a converti vizitatorii Ã®n clienÈ›i direct pe site.",
                proj3_tag: "CRM & Baze de Date",
                proj3_title: "AplicaÈ›ie CRM & Gestiune Servicii",
                proj3_summary: "PlatformÄƒ pe mÄƒsurÄƒ pentru o firmÄƒ de instalaÈ›ii sanitare È™i meseriaÈ™i. AsigurÄƒ preluarea comenzilor clienÈ›ilor, alocarea tehnicienilor pe teren, alerte automate SLA È™i gestiunea istoricului de intervenÈ›ii printr-un API RESTful securizat È™i baze relaÈ›ionale SQL.",
                btn_details: "Detalii Tehnice",
                proj_cta_text: "Ai o idee de proiect sau vrei sÄƒ optimizezi un flux de lucru existent?",
                proj_cta_btn: "DiscutÄƒ Proiectul TÄƒu pe WhatsApp",

                // CompetenÈ›e
                skills_badge: "Stack Tehnologic & Unelte",
                skills_title: "CompetenÈ›e & Tehnologii",
                skills_subtitle: "O privire completÄƒ asupra tehnologiilor folosite Ã®n dezvoltarea frontend, arhitectura backend, administrarea bazelor de date È™i mentenanÈ›a hardware.",
                cat_front_title: "Dezvoltare Frontend & UI",
                cat_front_sub: "InterfeÈ›e moderne, responsive & intuitive",
                cat_back_title: "Backend & Baze de Date",
                cat_back_sub: "Arhitecturi rapide, securizate & scalabile",
                cat_hw_title: "Hardware, Suport & MentenanÈ›Äƒ",
                cat_hw_sub: "Continuitate operaÈ›ionalÄƒ & infrastructurÄƒ",
                cat_devops_title: "DevOps, Limbaje OOP & Unelte",
                cat_devops_sub: "Fluxuri de lucru profesionale & automatizate",
                lang_box_title: "Limbi StrÄƒine Vorbite",
                lang_ro_lvl: "Nativ",
                lang_en_lvl: "C1 (Avansat / Fluent profesional)",
                lang_de_lvl: "B2 (Mediu-Superior)",

                // ExperienÈ›Äƒ
                exp_badge: "EvoluÈ›ie ProfesionalÄƒ",
                exp_title: "ExperienÈ›Äƒ & EducaÈ›ie",
                exp_subtitle: "Un parcurs solid format din responsabilitÄƒÈ›i reale Ã®n sisteme critice, completat de studii riguroase de programare È™i management.",
                exp1_period: "Ianuarie 2026 â€“ Prezent",
                exp1_role: "Administrator Baze de Date (DBA)",
                exp1_d1: "Administrez È™i optimizez baze de date de producÈ›ie (PostgreSQL, MySQL) pentru peste 200 de utilizatori activi, garantÃ¢nd disponibilitate 99.9%.",
                exp1_d2: "Am refÄƒcut strategiile de indexare È™i optimizare a interogÄƒrilor SQL complexe, reducÃ¢nd timpii medii de execuÈ›ie cu 40%.",
                exp1_d3: "Asigur proiectarea schemelor relaÈ›ionale pentru noi module funcÈ›ionale, monitorizarea proactivÄƒ È™i rezolvarea anomaliilor Ã®n timp real.",
                exp2_role: "Asistent Manager & Coordonator Digitalizare",
                exp2_d1: "Am condus digitalizarea fluxurilor de documente interne pentru o echipÄƒ de peste 50 de angajaÈ›i.",
                exp2_d2: "Am proiectat È™i implementat un sistem intern de gestiune a sarcinilor care a redus timpul de procesare cu 30%.",
                exp2_d3: "Am negociat contracte de mentenanÈ›Äƒ IT È™i am coordonat partenerii externi pentru upgrade-uri de sistem.",
                exp3_role: "Tehnician IT (Suport Nivel 1 È™i 2)",
                exp3_d1: "Am Ã®ntreÈ›inut È™i monitorizat infrastructura hardware È™i software a unui sistem feroviar naÈ›ional (300+ utilizatori activi).",
                exp3_d2: "Am efectuat analize root-cause (RCA) pentru defecÈ›iuni, reducÃ¢nd timpul mediu de rezolvare a incidentelor critice cu 25%.",
                exp3_d3: "Am colaborat direct cu echipele de dezvoltare software pentru raportarea bug-urilor È™i aplicarea patch-urilor de securitate.",
                edu1_period: "Septembrie 2025 â€“ Prezent",
                edu1_title: "Studii Analist Programator (Nivel 5)",
                edu1_desc: "Specializare axatÄƒ pe Programare OrientatÄƒ pe Obiecte (C#, C++), Structuri de Date & Algoritmi, Arhitecturi Baze de Date RelaÈ›ionale (SQL) È™i Dezvoltare Web Full-Stack (HTML5, React.js, Node.js).",
                edu2_title: "Master & LicenÈ›Äƒ Ã®n Management",
                edu2_desc: "Specializare Ã®n Managementul PerformanÈ›ei, Optimizarea Sistemelor È™i Arhitecturi de Control Ã®n IMM-uri.",

                // Terminal
                term_badge: "ConsolÄƒ InteractivÄƒ",
                term_title: "Terminal CLI v3.0",
                term_subtitle: "Preferi linia de comandÄƒ? Scrie help pentru a explora profilul sau Ã®ncearcÄƒ matrix pentru o ploaie digitalÄƒ!",

                // Contact
                contact_badge: "Contact Rapid",
                contact_title: "Hai SÄƒ ColaborÄƒm!",
                contact_subtitle: "Ai o Ã®ntrebare, vrei un site nou sau ai nevoie de o mÃ¢nÄƒ de ajutor cu un sistem sau o bazÄƒ de date? Sunt la doar un mesaj distanÈ›Äƒ.",
                contact_direct_title: "InformaÈ›ii Directe",
                contact_direct_desc: "ÃŽmi poÈ›i scrie direct pe WhatsApp pentru un rÄƒspuns rapid sau trimite un email. Pe PC se va deschide WhatsApp Web / clientul tÄƒu de mail, iar pe telefon se deschid aplicaÈ›iile native.",
                contact_loc_label: "LocaÈ›ie & Disponibilitate",
                contact_loc_val: "PloieÈ™ti, Prahova / Remote (NaÈ›ional)",
                contact_social_label: "ReÈ›ele & Repozitorii:",
                form_title: "Trimite un Mesaj Direct",
                form_sub: "CompleteazÄƒ formularul È™i vei primi un rÄƒspuns Ã®n maxim 24 de ore.",
                form_name_label: "Numele TÄƒu",
                form_email_label: "Adresa de Email",
                form_type_label: "Despre ce este vorba?",
                opt_web: "Creare Site Web / Magazin Online",
                opt_auto: "Automatizare de Procese / Rapoarte",
                opt_db: "Baze de Date & Optimizare SQL",
                opt_hw: "Consiliere Hardware / MentenanÈ›Äƒ IT",
                opt_other: "Alte ÃŽntrebÄƒri / Proiect Custom",
                form_msg_label: "Mesajul TÄƒu",
                btn_send_msg: "Trimite Mesajul",
                form_security_notice: "Datele tale sunt Ã®n siguranÈ›Äƒ È™i nu vor fi divulgate terÈ›ilor.",

                // Footer & Modal
                footer_tagline: "SoluÈ›ii web moderne, baze de date sigure È™i suport tehnic de Ã®ncredere.",
                footer_rights: "Toate drepturile rezervate.",
                btn_view_repo: "Vezi pe GitHub",
                btn_close: "ÃŽnchide",
                footer_qr: "ScaneazÄƒ pentru a distribui"
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
                hero_bio: "I build <strong>modern websites</strong>, automate repetitive workflows, and solve technical challengesâ€”from <strong>clean code</strong> (React, Node.js, SQL) to <strong>custom hardware/software maintenance on demand</strong>. I provide clear technical guidance without confusing jargon, turning your requirements into robust, reliable solutions running 24/7.",
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
                stats_quote: "â€œSecurity, speed, and ease of use are never optional.â€",

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

                // CompetenÈ›e
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

                // ExperienÈ›Äƒ
                exp_badge: "Career Milestones",
                exp_title: "Experience & Education",
                exp_subtitle: "A solid track record of enterprise responsibilities backed by academic foundations in computer analysis and management.",
                exp1_period: "January 2026 â€“ Present",
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
                edu1_period: "September 2025 â€“ Present",
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
                btn_close: "Close",
                footer_qr: "Scan to share"
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
                ? "Militaru Tiberiu Nicolae | Dezvoltator Web, AutomatizÄƒri & SoluÈ›ii IT" 
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
                toggleBtn.setAttribute('aria-label', isDark ? 'ComutÄƒ pe Modul Luminos' : 'ComutÄƒ pe Modul ÃŽntunecat');
                toggleBtn.setAttribute('title', isDark ? 'ComutÄƒ pe Modul Luminos (Light Mode)' : 'ComutÄƒ pe Modul ÃŽntunecat (Dark Mode)');
            }

            // Dispatch event for Neural Canvas and any dynamic subscribers
            window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));

            if (notify && typeof ToastModule !== 'undefined' && ToastModule && typeof ToastModule.show === 'function') {
                const lang = (typeof I18nModule !== 'undefined' && I18nModule) ? I18nModule.getCurrentLang() : 'ro';
                ToastModule.show(
                    theme === 'dark' 
                        ? (lang === 'ro' ? 'Mod ÃŽntunecat activat ðŸŒ™' : 'Dark Mode activated ðŸŒ™')
                        : (lang === 'ro' ? 'Mod Luminos activat â˜€ï¸' : 'Light Mode activated â˜€ï¸'),
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
                "AutomatizÄƒri de Procese & Date",
                "Administrare Baze de Date (SQL)",
                "Consiliere & DiagnozÄƒ Hardware",
                "MentenanÈ›Äƒ Software & Suport 24/7",
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
        // isMobile este acum definit mai jos Ã®n interior pentru a fi dinamic, nu distrugem canvas-ul
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
                    printLine('1. ðŸŒ Web & E-Commerce: React, Node.js, HTML5, Responsive UI', 't-succ');
                    printLine('2. âš¡ Process Automation: PDF gen, ATS parsing, repetitive task elimination', 't-succ');
                    printLine('3. ðŸ—„ï¸ Database Administration: PostgreSQL, MySQL, MS SQL, Query tuning', 't-succ');
                    printLine('4. ðŸ› ï¸ Hardware & Maintenance: Custom PCs/servers, diagnostics, 99.9% uptime', 't-succ');
                    break;

                case 'projects':
                    printLine('â€¢ [ATS PDF Gen]: 20min manual work cut to 5 sec (JSON parsing, PHP/Node)', 't-out');
                    printLine('â€¢ [E-Commerce Florist]: Live chat, WebSockets, MVC, React storefront', 't-out');
                    printLine('â€¢ [Field Service CRM]: Technician scheduling, SQL backend, REST API', 't-out');
                    const projTarget = document.getElementById('projects');
                    if (typeof projTarget?.scrollIntoView === 'function') projTarget.scrollIntoView({ behavior: 'smooth' });
                    break;

                case 'skills':
                    printLine('Stack: JavaScript, TypeScript, React, Node.js, PostgreSQL, MySQL, C#, C++, Git', 't-succ');
                    const skillsTarget = document.getElementById('skills');
                    if (typeof skillsTarget?.scrollIntoView === 'function') skillsTarget.scrollIntoView({ behavior: 'smooth' });
                    break;

                case 'experience':
                    printLine('â€¢ Database Administrator @ Corpul Expertilor (2026 - Present)', 't-out');
                    printLine('â€¢ Assistant Manager & Digital Transformation @ SC SIATI SRL (2014 - 2020)', 't-out');
                    printLine('â€¢ IT System Technician (Tier 1 & 2) @ GFR (2010 - 2014)', 't-out');
                    printLine('â€¢ Analyst Programmer Studies @ Colegiul Tehnic Elie Radu', 't-out');
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
                    printLine('[OK] FiÈ™ierul "CV-Militaru-Tiberiu.pdf" a fost descÄƒrcat cu succes.', 't-succ');
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

        // Easter Egg: Ctrl+K / Cmd+K to toggle Terminal visibility
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                const termSection = document.getElementById('terminal');
                if (termSection) {
                    if (termSection.style.display === 'none') {
                        termSection.style.display = 'block';
                        termSection.scrollIntoView({ behavior: 'smooth' });
                        setTimeout(() => input?.focus(), 500);
                        ToastModule.show("Terminal Hacker Mode Activat", 'success');
                    } else {
                        termSection.style.display = 'none';
                    }
                }
            }
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
                    title: 'CV Builder Pro & ATS Analyzer (SaaS)',
                    desc: 'O aplicatie web avansata (SaaS) dezvoltata de la zero, care permite utilizatorilor sa-si construiasca, vizeze si analizeze CV-urile in timp real. Platforma include un sistem complet de monetizare, autentificare sigura si generare de PDF-uri direct din cloud.',
                    architecture: 'Frontend Zero-Dependency (Vanilla JS, CSS Grid). Backend complet Serverless pe Google Firebase: Hosting, Firestore (NoSQL Live), si Authentication (Google OAuth). Include Microservicii pe Firebase Cloud Functions (Node.js 22) pentru validarea platilor prin Stripe Webhook si generarea securizata de PDF-uri cu Puppeteer.',
                    results: '✅ Arhitectura complet Serverless (0 mentenanta), auto-scalabila.<br>✅ Integrare completa Stripe (Abonamente & Checkout) si functionare autonoma end-to-end.<br>✅ Algoritm client-side pentru scoring ATS in functie de cuvinte cheie.'
                },
                en: {
                    title: 'CV Builder Pro & ATS Analyzer (SaaS)',
                    desc: 'An advanced SaaS web application built from scratch, allowing users to build, preview, and analyze their CVs in real-time. Features a full monetization system, secure authentication, and cloud-based PDF generation.',
                    architecture: 'Zero-Dependency Frontend (Vanilla JS, CSS Grid). Full Serverless Backend on Google Firebase: Hosting, Firestore (Real-time NoSQL), and Authentication (Google OAuth). Includes Node.js 22 Firebase Cloud Functions for Stripe Webhook validation and secure PDF rendering via headless Puppeteer.',
                    results: '✅ Fully Serverless architecture (zero maintenance), auto-scalable.<br>✅ Complete Stripe integration (Subscriptions & Checkout) for an autonomous end-to-end flow.<br>✅ Client-side ATS scoring algorithm based on keyword matching.'
                },
                github: 'https://github.com/tiberiumilitaru89'
            },
            proj2: {
                ro: {
                    title: "Magazin Online cu Chat Live (FlorÄƒrie)",
                    desc: "O platformÄƒ de comerÈ› electronic gÃ¢nditÄƒ pentru o florÄƒrie localÄƒ, unde decizia de cumpÄƒrare depinde adesea de asistenÈ›a Ã®n timp real (buchete personalizate, livrare rapidÄƒ la domiciliu).",
                    architecture: "Dezvoltat pe <strong>React.js</strong> pentru frontend È™i <strong>Node.js</strong> pentru serverul de comenzi È™i chat. Am integrat <strong>WebSockets</strong> pentru comunicare instantÄƒ bidirecÈ›ionalÄƒ Ã®ntre client È™i vÃ¢nzÄƒtor, fÄƒrÄƒ reÃ®ncÄƒrcarea paginii.",
                    results: "â€¢ CreÈ™tere de 35% a ratei de finalizare a comenzilor datoritÄƒ asistenÈ›ei live.<br>â€¢ Timp de Ã®ncÄƒrcare sub 1.2 secunde pe conexiuni 4G mobile.<br>â€¢ Panou simplu de administrare comenzi È™i mesaje pentru patron."
                },
                en: {
                    title: "Online Store with Live Chat (Florist)",
                    desc: "A bespoke e-commerce platform built for a local flower boutique, where client purchase decisions heavily rely on instant consultation for custom arrangements.",
                    architecture: "Built on <strong>React.js</strong> (SPA) with an Express/Node.js backend. Integrated bidirectional <strong>WebSockets</strong> for zero-latency client-to-seller live messaging.",
                    results: "â€¢ 35% boost in checkout completion rates via instant chat support.<br>â€¢ Sub-1.2 second load time on standard 4G mobile connections.<br>â€¢ Streamlined real-time order dashboard for the owner."
                },
                github: "https://github.com/tiberiumilitaru89"
            },
            proj3: {
                ro: {
                    title: "AplicaÈ›ie CRM & Gestiune Servicii",
                    desc: "CreatÄƒ pentru o firmÄƒ de instalaÈ›ii sanitare È™i intervenÈ›ii tehnice. Anterior, toate programÄƒrile se notau Ã®n agende fizice, ducÃ¢nd la Ã®ntÃ¢rzieri È™i suprapuneri de comenzi pe teren.",
                    architecture: "BazÄƒ de date relaÈ›ionalÄƒ pe <strong>PostgreSQL / MySQL</strong> cu scheme optimizate È™i constrÃ¢ngeri de integritate. InterfaÈ›Äƒ React prietenoasÄƒ pe mobil pentru instalatori È™i API REST securizat cu alerte automate SLA.",
                    results: "â€¢ Eliminarea completÄƒ a suprapunerilor de programÄƒri pe teren.<br>â€¢ NotificÄƒri automate cÄƒtre clienÈ›i prin SMS/Email.<br>â€¢ Istoric detaliat al fiecÄƒrui client pentru intervenÈ›ii Ã®n garanÈ›ie."
                },
                en: {
                    title: "Service Management & CRM Tool",
                    desc: "Engineered for a plumbing and field maintenance company. Previously, appointments and warranties were tracked on paper, resulting in missed appointments and SLA breaches.",
                    architecture: "Relational <strong>PostgreSQL/MySQL</strong> database with normalized schemas and indexing. Responsive mobile React UI for field technicians and a RESTful API with automated SLA dispatching.",
                    results: "â€¢ Zero scheduling conflicts and automated technician assignment.<br>â€¢ Automated client confirmation notifications.<br>â€¢ Centralized client history for rapid warranty audits."
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
                        <h4 style="color: var(--accent-cyan); margin-bottom: 6px; font-size: 1.05rem;"><i class="fa-solid fa-bullseye"></i> Problema RezolvatÄƒ:</h4>
                        <p>${info.desc}</p>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <h4 style="color: var(--accent-cyan); margin-bottom: 6px; font-size: 1.05rem;"><i class="fa-solid fa-code"></i> ArhitecturÄƒ & Implementare:</h4>
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
                nameError.textContent = lang === 'ro' ? "Te rog sÄƒ introduci numele complet." : "Please enter your name.";
                isValid = false;
            } else {
                nameError.textContent = "";
            }

            // Email
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                emailError.textContent = lang === 'ro' ? "Te rog sÄƒ introduci o adresÄƒ de email validÄƒ." : "Please enter a valid email address.";
                isValid = false;
            } else {
                emailError.textContent = "";
            }

            // Message
            if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
                messageError.textContent = lang === 'ro' ? "Mesajul trebuie sÄƒ aibÄƒ minim 10 caractere." : "Message must be at least 10 characters.";
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
                 * Endpoint securizat prin Vercel Serverless Functions
                 * (Endpoint-ul real Formspree e ascuns in Variabile de Mediu pe backend)
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
                            ? "Mesajul tÄƒu a fost trimis cu succes! Te voi contacta Ã®n cel mai scurt timp." 
                            : "Your message was sent successfully! I will get back to you shortly.",
                        'success'
                    );
                    form.reset();
                } else {
                    // Fallback prietenos Ã®n cazul Ã®n care Formspree returneaza o eroare temporara
                    ToastModule.show(
                        lang === 'ro'
                            ? "Mesajul a fost recepÈ›ionat! ÃŽmi poÈ›i scrie oricÃ¢nd direct È™i pe WhatsApp la (+40) 720 955 119."
                            : "Message received! You can also reach me directly on WhatsApp at (+40) 720 955 119.",
                        'success',
                        6000
                    );
                    form.reset();
                }
            } catch (error) {
                // DacÄƒ reÈ›eaua e offline sau blocatÄƒ de extensii, oferim alternativa pe WhatsApp
                ToastModule.show(
                    lang === 'ro'
                        ? "Eroare de conexiune la trimitere directÄƒ. Te rog sÄƒ mÄƒ contactezi pe WhatsApp la (+40) 720 955 119 sau prin email!"
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
                        ? 'DescÄƒrcarea CV-ului (PDF) a Ã®nceput!' 
                        : 'CV (PDF) download initiated!',
                    'success',
                    3500
                );
            });
        });
    })();

});

