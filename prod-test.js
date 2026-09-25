async function runProductionTests() {
    const targetUrl = 'https://portofoliu-tiberiu.vercel.app';
    console.log(`Pornesc suita de teste de producție pe: ${targetUrl}\n`);

    // ==========================================
    // 1. TESTUL DE FOC AL FORMULARULUI (API)
    // ==========================================
    console.log('--- 1. TESTUL FORMULARULUI (SERVERLESS API) ---');
    try {
        const apiRes = await fetch(`${targetUrl}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Tiberiu (Automated API Test)',
                email: 'test@tiberiu.dev',
                message: 'Acesta este un test automatizat pentru validarea rutei Serverless de pe Vercel. 1234567890'
            })
        });
        
        console.log(`Status HTTP: ${apiRes.status} ${apiRes.statusText}`);
        
        if (apiRes.status === 200) {
            console.log('✅ REZULTAT: Endpoint-ul API funcționează perfect. Formspree primește datele.');
        } else if (apiRes.status === 500) {
            console.log('❌ EROARE 500: Serverless a crăpat. Ai setat FORMSPREE_URL în Vercel? Ai dat Redeploy?');
            console.log('Detalii eroare:', await apiRes.text());
        } else {
            console.log('⚠️ Status neașteptat:', await apiRes.text());
        }
    } catch (e) {
        console.error('❌ EROARE FATALĂ API:', e.message);
    }

    // ==========================================
    // 2. AUDITUL LIGHTHOUSE (Google PageSpeed)
    // ==========================================
    console.log('\n--- 2. AUDITUL LIGHTHOUSE (Rulare prin Google PageSpeed Insights API) ---');
    console.log('Se analizează metricele (durează aproximativ 10-15 secunde)...');
    try {
        // Fetch Performance, Accessibility, Best Practices, and SEO for Mobile
        const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=mobile&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO`;
        
        const psiRes = await fetch(psiUrl);
        const psiData = await psiRes.json();
        
        if (psiData.lighthouseResult && psiData.lighthouseResult.categories) {
            const categories = psiData.lighthouseResult.categories;
            const perf = categories.performance.score * 100;
            const a11y = categories.accessibility.score * 100;
            const bp = categories['best-practices'].score * 100;
            const seo = categories.seo.score * 100;
            
            console.log(`Performance:    ${perf >= 90 ? '🟢' : '🟡'} ${perf}/100`);
            console.log(`Accessibility:  ${a11y >= 90 ? '🟢' : '🟡'} ${a11y}/100`);
            console.log(`Best Practices: ${bp >= 90 ? '🟢' : '🟡'} ${bp}/100`);
            console.log(`SEO:            ${seo >= 90 ? '🟢' : '🟡'} ${seo}/100`);
            
            if (perf >= 95 && a11y >= 95 && bp >= 95 && seo >= 95) {
                console.log('\n🏆 VERDICT: Performanță de top atinsă. Vite și optimizările au dat roade!');
            } else {
                console.log('\n⚠️ VERDICT: Scoruri bune, dar se mai pot face micro-optimizări.');
            }
        } else {
            console.log('❌ Nu s-au putut extrage scorurile Lighthouse.');
        }
    } catch (e) {
        console.error('❌ EROARE Lighthouse API:', e.message);
    }
    
    console.log('\nTeste finalizate.');
}

runProductionTests();
