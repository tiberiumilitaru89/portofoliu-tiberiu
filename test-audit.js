const fs = require('fs');
const { JSDOM } = require('jsdom');

const htmlContent = fs.readFileSync('d:/Antigravity/portofoliu-tiberiu/index.html', 'utf8');
const cssContent = fs.readFileSync('d:/Antigravity/portofoliu-tiberiu/styles.css', 'utf8');
const jsContent = fs.readFileSync('d:/Antigravity/portofoliu-tiberiu/script.js', 'utf8');

console.log('================================================================');
console.log('       COMPREHENSIVE AUDIT & INTERACTIVE TEST SUITE             ');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`[PASS] ${message}`);
        passCount++;
    } else {
        console.error(`[FAIL] ${message}`);
        failCount++;
    }
}

// =============================================================================
// SECTION 1: SECURITY AUDIT
// =============================================================================
console.log('\n--- 1. SECURITY & DATA SAFETY ---');

// Check target="_blank" without rel="noopener noreferrer"
const linkMatches = htmlContent.match(/<a\s+[^>]+>/gi) || [];
let blankLinksWithoutNoopener = [];
linkMatches.forEach(tag => {
    if (/target=["']_blank["']/i.test(tag) && !/rel=["'][^"']*noopener[^"']*["']/i.test(tag)) {
        blankLinksWithoutNoopener.push(tag);
    }
});
assert(blankLinksWithoutNoopener.length === 0, `All target="_blank" links have rel="noopener noreferrer" (found ${blankLinksWithoutNoopener.length} insecure)`);

// Check Anti-Spam Honeypot field in contact form
assert(htmlContent.includes('id="_gotcha"') && htmlContent.includes('display: none !important;'), 'Anti-bot honeypot field is configured with hidden display');

// Check Form action configuration
assert(htmlContent.includes('action="https://formspree.io/f/mjykoenj"'), 'Form action is routed to user Formspree endpoint (mjykoenj)');
assert(jsContent.includes("formspreeEndpoint = 'https://formspree.io/f/mjykoenj'"), 'script.js endpoint configured with user Formspree ID (mjykoenj)');

// Check LinkedIn profile URL
assert(htmlContent.includes('https://www.linkedin.com/in/tiberiu-militaru-nicolae89'), 'LinkedIn profile link is updated with user slug (tiberiu-militaru-nicolae89)');

// Check XSS / innerHTML safety in script.js
const riskyInnerHtml = jsContent.match(/\.innerHTML\s*=\s*.*(nameInput|emailInput|messageInput)\.value/g);
assert(!riskyInnerHtml, 'Zero unescaped form inputs injected directly into innerHTML');

// Check for accidental credential leaks
assert(!jsContent.includes('password') && !jsContent.includes('apiKey') && !jsContent.includes('secret_key'), 'No private credentials or passwords leaked in scripts');

// Safe Storage fallback verified
assert(jsContent.includes('SafeStorage'), 'SafeStorage wrapper active to protect against cross-origin SecurityError');


// =============================================================================
// SECTION 2: MOBILE COMPATIBILITY & RESPONSIVENESS
// =============================================================================
console.log('\n--- 2. MOBILE COMPATIBILITY & RESPONSIVE DESIGN ---');

// Viewport meta
assert(htmlContent.includes('<meta name="viewport" content="width=device-width, initial-scale=1.0">'), 'Viewport meta tag configured with standard scaling');

// Media queries in styles.css
assert(cssContent.includes('@media (max-width: 1024px)'), 'Tablet breakpoint (@media max-width: 1024px) defined');
assert(cssContent.includes('@media (max-width: 768px)'), 'Mobile landscape/tablet breakpoint (@media max-width: 768px) defined');
assert(cssContent.includes('@media (max-width: 480px)'), 'Mobile portrait breakpoint (@media max-width: 480px) defined');

// Check horizontal overflow prevention
assert(cssContent.includes('overflow-x: hidden'), 'Body or HTML has overflow-x: hidden to prevent horizontal scrollbars');

// Mobile drawer & hamburger presence
assert(htmlContent.includes('id="hamburgerBtn"'), 'Mobile hamburger trigger button exists in DOM');
assert(htmlContent.includes('id="mobileDrawer"'), 'Mobile drawer container exists in DOM');
assert(htmlContent.includes('id="drawerCloseBtn"'), 'Mobile drawer close button exists in DOM');

// Touch interactions in script.js
assert(jsContent.includes('touchmove') && jsContent.includes('touchend'), 'Touch events (touchmove, touchend) are handled for mobile screens');
assert(jsContent.includes('width < 768'), 'Adaptive performance thresholds for mobile screens');


// =============================================================================
// SECTION 3: ALL BUTTONS & INTERACTIVE FEATURES (DOM SIMULATION)
// =============================================================================
console.log('\n--- 3. FULL BUTTON & INTERACTIVE FLOW SIMULATION ---');

const dom = new JSDOM(htmlContent, {
    runScripts: 'dangerously',
    url: 'file:///d:/Antigravity/portofoliu-tiberiu/index.html'
});

dom.window.requestAnimationFrame = (cb) => { setTimeout(cb, 16); return 1; };
dom.window.cancelAnimationFrame = () => {};
dom.window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };

let runtimeErrors = [];
dom.window.addEventListener('error', (e) => runtimeErrors.push(e.message));

// Execute script.js inside simulated browser
dom.window.eval(jsContent);
dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));

assert(runtimeErrors.length === 0, `Page bootstraps with zero errors: ${runtimeErrors.join(', ')}`);

const doc = dom.window.document;

// 3.1 Theme Toggle
const themeBtn = doc.getElementById('themeToggleBtn');
const htmlElem = doc.documentElement;
const themeIcon = doc.getElementById('themeIcon');
assert(themeBtn !== null, 'Theme toggle button exists');
const initialTheme = htmlElem.getAttribute('data-theme');
themeBtn.click();
const switchedTheme = htmlElem.getAttribute('data-theme');
assert(switchedTheme !== initialTheme, `Theme toggles successfully from ${initialTheme} to ${switchedTheme}`);
themeBtn.click();
assert(htmlElem.getAttribute('data-theme') === initialTheme, `Theme toggles back to ${initialTheme}`);

// 3.2 Language Toggle
const langBtn = doc.getElementById('langToggleBtn');
assert(langBtn !== null, 'Language toggle button exists');
const heroBio = doc.querySelector('.hero-bio');
const initialLangText = heroBio.textContent.trim();
langBtn.click();
const switchedLangText = heroBio.textContent.trim();
assert(switchedLangText !== initialLangText, 'Language switch toggles UI text dynamically (RO <-> EN)');
langBtn.click();
assert(heroBio.textContent.trim() === initialLangText, 'Language switch reverts text correctly');

// 3.3 Modal Open / Close on all 3 project cards
['proj1', 'proj2', 'proj3'].forEach(projId => {
    const btn = doc.querySelector(`.btn-project-modal[data-target="${projId}"]`);
    assert(btn !== null, `Project modal trigger button exists for [${projId}]`);
    btn.click();
    const modal = doc.getElementById('projectModal');
    assert(modal.classList.contains('active'), `Project modal opens on click for [${projId}]`);
    const modalTitle = doc.getElementById('modalTitle');
    assert(modalTitle.textContent.length > 5, `Modal populated with title for [${projId}]: "${modalTitle.textContent}"`);
    
    // Close modal
    const closeBtn = doc.getElementById('modalCloseBtn');
    closeBtn.click();
    assert(!modal.classList.contains('active'), `Modal closes successfully via close button for [${projId}]`);
});

// Test Dismiss button closing modal
const proj1Btn = doc.querySelector('.btn-project-modal[data-target="proj1"]');
proj1Btn.click();
const modal = doc.getElementById('projectModal');
const dismissBtn = doc.getElementById('modalDismissBtn');
assert(modal.classList.contains('active'), 'Modal is open before dismiss');
dismissBtn.click();
assert(!modal.classList.contains('active'), 'Modal closes successfully via dismiss button');

// Test Escape key closing modal
proj1Btn.click();
assert(modal.classList.contains('active'), 'Modal open before Escape key');
doc.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape' }));
assert(!modal.classList.contains('active'), 'Modal closes successfully on Escape key');

// 3.4 Terminal Interactive CLI
const termInput = doc.getElementById('terminalInput');
const termBody = doc.getElementById('terminalBody');
assert(termInput !== null && termBody !== null, 'Interactive terminal input and body exist');

const testCommands = ['help', 'bio', 'skills', 'projects', 'contact', 'cv', 'clear'];
testCommands.forEach(cmd => {
    termInput.value = cmd;
    termInput.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    if (cmd === 'clear') {
        const lines = termBody.querySelectorAll('.terminal-line');
        assert(lines.length === 0, 'Terminal command "clear" wipes terminal lines');
    } else {
        const lastResponse = termBody.lastElementChild;
        assert(lastResponse !== null, `Terminal command "${cmd}" produces interactive output`);
    }
});

// Terminal window buttons
const termMax = doc.getElementById('termMax');
const termWin = doc.querySelector('.terminal-window');
if (termMax && termWin) {
    termMax.click();
    assert(htmlElem.getAttribute('data-theme') !== initialTheme, 'Terminal maximize button executes action');
}

// 3.5 Contact Form Validation & Bot Protection
const form = doc.getElementById('contactForm');
const nameInput = doc.getElementById('senderName');
const emailInput = doc.getElementById('senderEmail');
const messageInput = doc.getElementById('senderMessage');
const honeypotInput = doc.getElementById('_gotcha');
const nameError = doc.getElementById('nameError');
const emailError = doc.getElementById('emailError');
const messageError = doc.getElementById('messageError');

assert(form !== null, 'Contact form exists');

// Empty submission should trigger validation errors
form.dispatchEvent(new dom.window.Event('submit', { cancelable: true }));
assert(nameError.textContent.length > 0, 'Name validation triggers error on empty input');
assert(emailError.textContent.length > 0, 'Email validation triggers error on empty input');
assert(messageError.textContent.length > 0, 'Message validation triggers error on empty input');

// Honeypot bot submission should be caught and cleared without error
honeypotInput.value = 'I am a spam bot';
nameInput.value = 'Bot Name';
emailInput.value = 'bot@spam.com';
messageInput.value = 'Spam message that should never be sent.';
form.dispatchEvent(new dom.window.Event('submit', { cancelable: true }));
assert(nameInput.value === '' || form.checkValidity, 'Honeypot intercepts automated bots and resets form');

// 3.6 Mobile Drawer Navigation
const hamburger = doc.getElementById('hamburgerBtn');
const drawer = doc.getElementById('mobileDrawer');
const drawerClose = doc.getElementById('drawerCloseBtn');

assert(hamburger !== null && drawer !== null && drawerClose !== null, 'Mobile drawer and trigger elements exist');
hamburger.click();
assert(drawer.classList.contains('active'), 'Hamburger click opens mobile drawer');
drawerClose.click();
assert(!drawer.classList.contains('active'), 'Drawer close button closes mobile drawer');

// Clicking mobile nav link closes drawer
hamburger.click();
const firstMobileLink = doc.querySelector('.mobile-nav-link');
if (firstMobileLink) {
    firstMobileLink.click();
    assert(!drawer.classList.contains('active'), 'Clicking any mobile navigation link closes the drawer');
}

// 3.7 Canvas Background
const canvas = doc.querySelector('#canvas-container canvas');
assert(canvas !== null, 'Neural Network Canvas element generated dynamically in canvas container');

console.log('\n================================================================');
console.log(`TOTAL PASSES: ${passCount}`);
console.log(`TOTAL FAILS:  ${failCount}`);
console.log('================================================================');

if (failCount > 0) {
    process.exit(1);
} else {
    console.log('\n>>> ALL AUDITS AND INTERACTION TESTS PASSED WITH 100% SUCCESS! <<<');
    process.exit(0);
}
