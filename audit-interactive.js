const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('d:/Antigravity/portofoliu-tiberiu/index.html', 'utf8');
const dom = new JSDOM(html);
const doc = dom.window.document;

console.log('=== BUTTONS AUDIT ===');
const buttons = Array.from(doc.querySelectorAll('button'));
console.log('Total buttons:', buttons.length);
buttons.forEach((b, i) => {
    console.log(`${i + 1}. [${b.tagName}] id="${b.id || ''}" class="${b.className}" text="${b.textContent.trim().replace(/\s+/g, ' ').slice(0, 30)}" aria="${b.getAttribute('aria-label') || ''}"`);
});

console.log('\n=== LINKS AUDIT ===');
const links = Array.from(doc.querySelectorAll('a'));
console.log('Total links:', links.length);
links.forEach((a, i) => {
    console.log(`${i + 1}. [<a>] id="${a.id || ''}" href="${a.getAttribute('href')}" target="${a.getAttribute('target') || '_self'}" rel="${a.getAttribute('rel') || ''}" text="${a.textContent.trim().replace(/\s+/g, ' ').slice(0, 30)}"`);
});

console.log('\n=== FORMS AUDIT ===');
const forms = Array.from(doc.querySelectorAll('form'));
forms.forEach((f, i) => {
    console.log(`${i + 1}. [<form>] id="${f.id}" action="${f.getAttribute('action')}" method="${f.getAttribute('method')}" novalidate="${f.hasAttribute('novalidate')}"`);
});
