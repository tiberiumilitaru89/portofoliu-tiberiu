import sharp from 'sharp';
import fs from 'fs';

async function optimize() {
    try {
        // 1. Generează imaginea de profil mică pentru mobil
        await sharp('public/profile.webp')
            .resize({ width: 400 })
            .toFile('public/profile-mobile.webp');
        console.log('✅ profile-mobile.webp generat cu succes.');

        // 2. Creează un favicon.svg personalizat (Litera T pe fundal Cyan)
        const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <rect width="100" height="100" rx="20" fill="#00f0ff"/>
          <text x="50" y="72" font-size="65" font-family="monospace" font-weight="bold" fill="#030712" text-anchor="middle">T</text>
        </svg>`;
        fs.writeFileSync('public/favicon.svg', svgFavicon);
        
        // Creează și un favicon.ico gol ca să blocăm complet orice request automat al browserelor vechi care ar da 404
        fs.writeFileSync('public/favicon.ico', '');
        console.log('✅ Favicon-uri generate cu succes.');

    } catch (e) {
        console.error('❌ Eroare:', e.message);
    }
}

optimize();
