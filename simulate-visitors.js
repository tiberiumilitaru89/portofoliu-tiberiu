const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log('================================================================');
console.log('       MULTI-USER & REAL-WORLD SCENARIO SIMULATION SUITE        ');
console.log('================================================================\n');

const htmlContent = fs.readFileSync('d:/Antigravity/portofoliu-tiberiu/index.html', 'utf8');
const cssContent = fs.readFileSync('d:/Antigravity/portofoliu-tiberiu/styles.css', 'utf8');
const jsContent = fs.readFileSync('d:/Antigravity/portofoliu-tiberiu/script.js', 'utf8');

let simulationPasses = 0;
let simulationFails = 0;

function simAssert(condition, message) {
    if (condition) {
        console.log(`[PASS] ${message}`);
        simulationPasses++;
    } else {
        console.error(`[FAIL] ${message}`);
        simulationFails++;
    }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runSimulation() {
    // Set up virtual browser environment
    const dom = new JSDOM(htmlContent, {
        runScripts: 'dangerously',
        url: 'https://tiberiumilitaru.dev/'
    });

    // Polyfills for browser APIs in Node/JSDOM
    dom.window.requestAnimationFrame = (cb) => { setTimeout(cb, 16); return 1; };
    dom.window.cancelAnimationFrame = () => {};
    dom.window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };

    // Intercept fetch calls to verify Formspree transmissions
    let interceptedFetchCalls = [];
    dom.window.fetch = async (url, options) => {
        interceptedFetchCalls.push({ url, options });
        return {
            ok: true,
            status: 200,
            json: async () => ({ next: 'https://formspree.io/thanks' })
        };
    };

    // Bootstrap the app
    dom.window.eval(jsContent);
    dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));

    const doc = dom.window.document;


    // =============================================================================
    // SCENARIO 1: CLIENT LOOKING FOR E-COMMERCE & WEB DEV
    // =============================================================================
    console.log('\n--- SCENARIO 1: Potential Client (Radu - E-Commerce Store Lead) ---');

    // 1.1 Client views projects and clicks on Project 2 (Florist E-commerce)
    const proj2Btn = doc.querySelector('.btn-project-modal[data-target="proj2"]');
    simAssert(proj2Btn !== null, 'Client finds "Detalii Tehnice" button for Project 2 (Florărie E-Commerce)');
    proj2Btn.click();

    const modal = doc.getElementById('projectModal');
    const modalTitle = doc.getElementById('modalTitle');
    const modalBody = doc.getElementById('modalBody');
    simAssert(modal.classList.contains('active'), 'Project modal opens smoothly for client');
    simAssert(modalTitle.textContent.includes('Magazin Online') || modalTitle.textContent.includes('Florărie'), `Modal displays correct project: "${modalTitle.textContent}"`);
    simAssert(modalBody.innerHTML.includes('React.js') && modalBody.innerHTML.includes('WebSockets'), 'Modal describes technical architecture (React, WebSockets)');

    // 1.2 Client closes modal via Dismiss button
    const dismissBtn = doc.getElementById('modalDismissBtn');
    dismissBtn.click();
    simAssert(!modal.classList.contains('active'), 'Client closes project modal and continues browsing');

    // 1.3 Client fills out the Contact Form with genuine project inquiry
    const nameField = doc.getElementById('senderName');
    const emailField = doc.getElementById('senderEmail');
    const serviceSelect = doc.getElementById('projectType');
    const messageField = doc.getElementById('senderMessage');
    const form = doc.getElementById('contactForm');
    const submitBtn = doc.getElementById('submitContactBtn');

    nameField.value = 'Radu Georgescu';
    emailField.value = 'radu.georgescu@florariabucuresti.ro';
    if (serviceSelect) serviceSelect.value = 'site_web';
    messageField.value = 'Bună ziua Tiberiu! Avem nevoie de un magazin online modern cu catalog de flori, comenzi online și chat live pentru consultanță. Care ar fi disponibilitatea ta?';

    interceptedFetchCalls = [];
    form.dispatchEvent(new dom.window.Event('submit', { cancelable: true }));

    // Await async handler to complete
    await sleep(60);

    simAssert(interceptedFetchCalls.length === 1, 'Form submission triggered exactly one network request to Formspree');
    if (interceptedFetchCalls.length > 0) {
        const call = interceptedFetchCalls[0];
        simAssert(call.url === 'https://formspree.io/f/mjykoenj', `Request sent to user's Formspree endpoint (${call.url})`);
        const sentData = JSON.parse(call.options.body);
        simAssert(sentData.name === 'Radu Georgescu', `Payload name correct: "${sentData.name}"`);
        simAssert(sentData.email === 'radu.georgescu@florariabucuresti.ro', `Payload email correct: "${sentData.email}"`);
        simAssert(sentData._replyto === 'radu.georgescu@florariabucuresti.ro', `Reply-To header correctly configured for instant email client reply: "${sentData._replyto}"`);
        simAssert(sentData.message.length > 20, 'Message body passed through cleanly');
    }


    // =============================================================================
    // SCENARIO 2: TECHNICAL RECRUITER / HR SPECIALIST (ENGLISH LANGUAGE)
    // =============================================================================
    console.log('\n--- SCENARIO 2: Technical Recruiter (Sarah - Senior Tech Talent) ---');

    // 2.1 Recruiter switches language to English
    const langBtn = doc.getElementById('langToggleBtn');
    langBtn.click();
    const heroGreeting = doc.querySelector('.greeting');
    simAssert(heroGreeting.textContent.trim() === 'Hello! I am' || heroGreeting.textContent.trim() === "Hi! I'm", `Language switches to English: "${heroGreeting.textContent.trim()}"`);

    // 2.2 Recruiter tests theme toggle
    const themeBtn = doc.getElementById('themeToggleBtn');
    themeBtn.click();
    simAssert(doc.documentElement.getAttribute('data-theme') === 'light', 'Recruiter switches UI to clean Light Theme');
    themeBtn.click();
    simAssert(doc.documentElement.getAttribute('data-theme') === 'dark', 'Recruiter switches back to Cyber Dark Theme');

    // 2.3 Recruiter interacts with Terminal CLI
    const termInput = doc.getElementById('terminalInput');
    const termBody = doc.getElementById('terminalBody');

    termInput.value = 'skills';
    termInput.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    simAssert(termBody.textContent.includes('TypeScript') && termBody.textContent.includes('React'), 'Terminal CLI correctly prints technical skill matrix');

    termInput.value = 'contact';
    termInput.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    simAssert(termBody.textContent.includes('tiberiu-militaru-nicolae89'), 'Terminal CLI provides direct link to updated LinkedIn profile');

    // 2.4 Recruiter checks CV download links
    const heroCvLink = doc.getElementById('heroPrintCvBtn');
    simAssert(heroCvLink.getAttribute('href') === 'CV-Militaru-Tiberiu.pdf', 'Hero CV button points to official PDF CV');
    simAssert(heroCvLink.getAttribute('target') === '_blank' && heroCvLink.getAttribute('rel').includes('noopener'), 'CV button opens securely in new tab with rel="noopener noreferrer"');

    // Switch back to RO for remaining tests
    langBtn.click();


    // =============================================================================
    // SCENARIO 3: MOBILE PHONE USER (PHONE NAVIGATION & ERGONOMICS)
    // =============================================================================
    console.log('\n--- SCENARIO 3: Mobile Phone Visitor (iPhone 14 / Android) ---');

    const hamburgerBtn = doc.getElementById('hamburgerBtn');
    const mobileDrawer = doc.getElementById('mobileDrawer');
    const drawerCloseBtn = doc.getElementById('drawerCloseBtn');

    // 3.1 Mobile user taps hamburger menu
    hamburgerBtn.click();
    simAssert(mobileDrawer.classList.contains('active'), 'Mobile drawer slides into view upon hamburger tap');
    simAssert(doc.body.style.overflow === 'hidden', 'Background body scrolling is locked to prevent background scrolling behind drawer');

    // 3.2 Mobile user presses Escape key to close
    doc.defaultView.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape' }));
    simAssert(!mobileDrawer.classList.contains('active'), 'Mobile drawer closes cleanly when Escape key is pressed');
    simAssert(doc.body.style.overflow === '', 'Background scrolling is unlocked');

    // 3.3 Mobile user opens drawer again and taps close "X" button
    hamburgerBtn.click();
    simAssert(mobileDrawer.classList.contains('active'), 'Mobile drawer opens again');
    drawerCloseBtn.click();
    simAssert(!mobileDrawer.classList.contains('active'), 'Drawer close button "X" closes mobile drawer');

    // 3.4 Mobile user tests WhatsApp action link
    const heroWhatsApp = doc.getElementById('heroWhatsAppBtn');
    simAssert(heroWhatsApp.getAttribute('href').includes('wa.me/40720955119'), 'WhatsApp button connects to correct number (40720955119)');
    simAssert(heroWhatsApp.getAttribute('href').includes('text='), 'WhatsApp link contains prefilled greeting message');


    // =============================================================================
    // SCENARIO 4: ATTACK VECTORS, BOTS & FORM VALIDATION EDGE CASES
    // =============================================================================
    console.log('\n--- SCENARIO 4: Security Defense (Bots, XSS & Validation Edge Cases) ---');

    // 4.1 Honeypot bot detection
    interceptedFetchCalls = [];
    const honeypot = doc.getElementById('_gotcha');
    honeypot.value = 'http://spam-link-viagra-bot.xyz';
    nameField.value = 'Spam Bot 3000';
    emailField.value = 'spambot@spam.org';
    messageField.value = 'Buy followers cheap now http://spam.xyz';

    form.dispatchEvent(new dom.window.Event('submit', { cancelable: true }));

    simAssert(interceptedFetchCalls.length === 0, 'Honeypot intercepted automated spam bot: ZERO requests sent to Formspree');
    simAssert(nameField.value === '' && emailField.value === '', 'Form was automatically reset to discard spam');

    // Reset honeypot
    honeypot.value = '';

    // 4.2 Empty submission validation
    nameField.value = '';
    emailField.value = '';
    messageField.value = '';

    form.dispatchEvent(new dom.window.Event('submit', { cancelable: true }));
    const nameErr = doc.getElementById('nameError');
    const emailErr = doc.getElementById('emailError');
    const messageErr = doc.getElementById('messageError');

    simAssert(nameErr.textContent.length > 0, 'Validation shows friendly error for empty name');
    simAssert(emailErr.textContent.length > 0, 'Validation shows friendly error for empty email');
    simAssert(messageErr.textContent.length > 0, 'Validation shows friendly error for empty message');

    // 4.3 Invalid email format validation
    nameField.value = 'Test Client';
    emailField.value = 'not-an-email-address';
    messageField.value = 'This is a message that is long enough.';

    form.dispatchEvent(new dom.window.Event('submit', { cancelable: true }));
    simAssert(emailErr.textContent.length > 0, 'Validation catches invalid email format without @ or domain');

    // 4.4 XSS / Injection safety check
    nameField.value = '<script>alert("xss")</script>';
    emailField.value = 'victim@example.com';
    messageField.value = '<img src=x onerror=alert("pwned")> Mesaj de test securitate.';

    interceptedFetchCalls = [];
    form.dispatchEvent(new dom.window.Event('submit', { cancelable: true }));
    await sleep(60);

    simAssert(interceptedFetchCalls.length === 1, 'XSS test submitted safely through validation');
    // Verify that the document DOM did not evaluate any injected script
    simAssert(!doc.body.innerHTML.includes('<script>alert("xss")</script>'), 'XSS payload was never executed or injected into DOM HTML');

    // 4.5 Network failure graceful degradation
    dom.window.fetch = async () => { throw new Error('Network connection offline'); };
    nameField.value = 'Offline Client';
    emailField.value = 'offline@example.com';
    messageField.value = 'Mesaj trimis când conexiunea are probleme de rețea.';

    form.dispatchEvent(new dom.window.Event('submit', { cancelable: true }));
    await sleep(60);

    const toastContainer = doc.getElementById('toastContainer');
    simAssert(toastContainer !== null, 'Toast container exists for friendly notification');
    simAssert(!submitBtn.disabled, 'Submit button is properly re-enabled after network exception');


    // =============================================================================
    // SCENARIO 5: ACCESSIBILITY & A11Y STANDARDS
    // =============================================================================
    console.log('\n--- SCENARIO 5: Accessibility & A11y Standards ---');

    let missingAriaButtons = [];
    doc.querySelectorAll('button').forEach(btn => {
        const hasText = btn.textContent.trim().length > 0;
        const hasAria = btn.getAttribute('aria-label') && btn.getAttribute('aria-label').trim().length > 0;
        const hasTitle = btn.getAttribute('title') && btn.getAttribute('title').trim().length > 0;
        if (!hasText && !hasAria && !hasTitle) {
            missingAriaButtons.push(btn.outerHTML.slice(0, 50));
        }
    });
    simAssert(missingAriaButtons.length === 0, `All ${doc.querySelectorAll('button').length} buttons have accessible labels (found ${missingAriaButtons.length} unlabeled)`);

    let missingImgAlt = [];
    doc.querySelectorAll('img').forEach(img => {
        if (!img.getAttribute('alt')) {
            missingImgAlt.push(img.outerHTML.slice(0, 50));
        }
    });
    simAssert(missingImgAlt.length === 0, `All images have descriptive alt attributes (found ${missingImgAlt.length} missing alt)`);


    console.log('\n================================================================');
    console.log(`TOTAL SIMULATION CHECKS: ${simulationPasses + simulationFails}`);
    console.log(`PASSES: ${simulationPasses}`);
    console.log(`FAILS:  ${simulationFails}`);
    console.log('================================================================');

    if (simulationFails > 0) {
        process.exit(1);
    } else {
        console.log('\n>>> ALL REAL-WORLD USER SIMULATIONS & SECURITY AUDITS PASSED WITH 100% SUCCESS! <<<');
        process.exit(0);
    }
}

runSimulation();
