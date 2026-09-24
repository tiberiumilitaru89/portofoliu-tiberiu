const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
const jsPath = path.join(__dirname, 'script.js');

const html = fs.readFileSync(htmlPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

console.log('=== TEST SUITE PORTOFOLIU TIBERIU ===\n');

// 1. Extract HTML data-i18n attributes
const htmlKeyMatches = [...html.matchAll(/data-i18n="([^"]+)"/g)];
const htmlKeys = [...new Set(htmlKeyMatches.map(m => m[1]))];
console.log(`[1] Total unique i18n keys in HTML: ${htmlKeys.length}`);

// 2. Extract ro/en keys from script.js
const roSection = js.substring(js.indexOf('ro: {'), js.indexOf('en: {'));
const enSection = js.substring(js.indexOf('en: {'), js.indexOf('let currentLang'));

const roKeys = [...new Set([...roSection.matchAll(/([a-zA-Z0-9_]+):/g)].map(m => m[1]))];
const enKeys = [...new Set([...enSection.matchAll(/([a-zA-Z0-9_]+):/g)].map(m => m[1]))];

console.log(`[2] Keys found in RO dictionary: ${roKeys.length}`);
console.log(`[3] Keys found in EN dictionary: ${enKeys.length}`);

const missingInRo = htmlKeys.filter(k => !roKeys.includes(k));
const missingInEn = htmlKeys.filter(k => !enKeys.includes(k));

if (missingInRo.length === 0) {
    console.log('✓ PASS: All HTML keys exist in the Romanian dictionary (100% parity)');
} else {
    console.error('✗ FAIL: Missing keys in RO dictionary:', missingInRo);
}

if (missingInEn.length === 0) {
    console.log('✓ PASS: All HTML keys exist in the English dictionary (100% parity)');
} else {
    console.error('✗ FAIL: Missing keys in EN dictionary:', missingInEn);
}

// 3. Verify getElementById references
const getElementByIdMatches = [...new Set([...js.matchAll(/getElementById\(['"]([^'"]+)['"]\)/g)].map(m => m[1]))];
const missingIds = getElementByIdMatches.filter(id => !html.includes(`id="${id}"`));

if (missingIds.length === 0) {
    console.log(`✓ PASS: All ${getElementByIdMatches.length} getElementById calls have matching DOM elements in HTML`);
} else {
    console.error('✗ FAIL: Missing element IDs in HTML:', missingIds);
}

// 4. Verify Contact Links
const hasWhatsApp = html.includes('wa.me/40720955119');
const hasPhone = html.includes('tel:+40720955119');
const hasEmail = html.includes('mailto:tiberiumilitaru89@gmail.com');
const hasHoneypot = html.includes('id="_gotcha"');

console.log(hasWhatsApp ? '✓ PASS: WhatsApp link is correctly formatted with (+40) 720 955 119' : '✗ FAIL: WhatsApp link error');
console.log(hasPhone ? '✓ PASS: Phone link is formatted with clean international format +40720955119' : '✗ FAIL: Phone link error');
console.log(hasEmail ? '✓ PASS: Mailto link is correctly configured' : '✗ FAIL: Mailto link error');
console.log(hasHoneypot ? '✓ PASS: Anti-spam honeypot field is present in contact form' : '✗ FAIL: Honeypot missing');

// 5. Verify local profile photo
const profilePath = path.join(__dirname, 'profile.jpg');
if (fs.existsSync(profilePath)) {
    console.log(`✓ PASS: profile.jpg exists (${(fs.statSync(profilePath).size / 1024).toFixed(1)} KB)`);
} else {
    console.error('✗ FAIL: profile.jpg missing');
}

// 6. Verify local Three.js and downloadable CV PDF
const pdfPath = path.join(__dirname, 'CV-Militaru-Tiberiu.pdf');
if (fs.existsSync(pdfPath)) {
    console.log(`✓ PASS: CV-Militaru-Tiberiu.pdf exists (${(fs.statSync(pdfPath).size / 1024).toFixed(1)} KB)`);
} else {
    console.error('✗ FAIL: CV-Militaru-Tiberiu.pdf is missing');
}

const threePath = path.join(__dirname, 'three.min.js');
if (fs.existsSync(threePath)) {
    console.log(`✓ PASS: three.min.js exists locally (${(fs.statSync(threePath).size / 1024).toFixed(1)} KB)`);
} else {
    console.error('✗ FAIL: three.min.js is missing');
}

console.log('\n=== ALL AUTOMATED CHECKS COMPLETE ===');
