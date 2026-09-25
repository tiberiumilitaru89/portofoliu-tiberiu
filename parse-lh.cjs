const fs = require('fs');
const data = JSON.parse(fs.readFileSync('report.json', 'utf8'));
const audits = data.audits;

console.log("=== FAILED AUDITS ===");
for (const key of Object.keys(audits)) {
    const audit = audits[key];
    if (audit.score !== null && audit.score < 1 && audit.score !== undefined) {
        console.log(`- [${audit.id}] Score: ${audit.score} | ${audit.title}`);
        if (audit.details && audit.details.items && audit.details.items.length > 0) {
            console.log('  Items:', JSON.stringify(audit.details.items.slice(0,2)));
        }
    }
}
