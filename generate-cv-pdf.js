const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'CV-Militaru-Tiberiu.pdf');
const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 40, bottom: 40, left: 45, right: 45 },
    info: {
        Title: 'Curriculum Vitae - Militaru Tiberiu Nicolae',
        Author: 'Militaru Tiberiu Nicolae',
        Subject: 'Full-Stack Developer & Database Administrator',
        Keywords: 'Full-Stack Developer, React, Node.js, SQL, Hardware, Mentenanță'
    }
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Colors
const primaryColor = '#0284c7'; // Cyan/Blue accent
const darkNavy = '#0f172a';
const textMuted = '#475569';
const borderGray = '#e2e8f0';
const tagBg = '#f1f5f9';

// Header section
doc.fillColor(darkNavy)
   .font('Helvetica-Bold')
   .fontSize(22)
   .text('MILITARU TIBERIU NICOLAE', { characterSpacing: 1 });

doc.fillColor(primaryColor)
   .font('Helvetica-Bold')
   .fontSize(12)
   .text('FULL-STACK DEVELOPER | DATABASE ADMINISTRATOR | HARDWARE & SOFTWARE CONSULTANT', { characterSpacing: 0.5 });

doc.moveDown(0.3);

// Contact Info Bar
doc.fillColor(textMuted)
   .font('Helvetica')
   .fontSize(9.5)
   .text('Telefon / WhatsApp: (+40) 720 955 119  |  Email: tiberiumilitaru89@gmail.com  |  Locatie: Ploiesti / Remote', { lineGap: 3 });
doc.text('GitHub: github.com/tiberiumilitaru89  |  LinkedIn: linkedin.com/in/tiberiu-militaru-nicolae89');

// Horizontal separator line
doc.moveDown(0.6);
doc.strokeColor(primaryColor).lineWidth(1.5).moveTo(45, doc.y).lineTo(550, doc.y).stroke();
doc.moveDown(0.6);

// Helper function for section titles
function addSectionHeader(title) {
    doc.moveDown(0.6);
    doc.fillColor(primaryColor)
       .font('Helvetica-Bold')
       .fontSize(12)
       .text(title.toUpperCase(), { characterSpacing: 1 });
    doc.strokeColor(borderGray).lineWidth(0.8).moveTo(45, doc.y + 2).lineTo(550, doc.y + 2).stroke();
    doc.moveDown(0.4);
}

// 1. Profil Profesional
addSectionHeader('Despre Mine / Profil Profesional');
doc.fillColor(darkNavy)
   .font('Helvetica')
   .fontSize(9.5)
   .text(
       'Dezvoltator Web si Specialist Tehnic orientat pe rezultate practice si scalabile. Ofer servicii complete: de la crearea de site-uri si aplicatii web moderne (React, Node.js, SQL), automatizari de procese de date si generatoare de documente, pana la consultanta si mentenanta software si hardware 24/7. Transform cerinte complexe de business in solutii concrete, sigure si usor de utilizat.',
       { align: 'justify', lineGap: 2.5 }
   );

// 2. Servicii & Competente Tehnice
addSectionHeader('Servicii & Competente Tehnice');

doc.font('Helvetica-Bold').fontSize(10).fillColor(darkNavy).text('1. Dezvoltare Web (Front-End & Back-End):');
doc.font('Helvetica').fontSize(9).fillColor(textMuted).text('   - JavaScript ES6+, React.js, HTML5, CSS3/SCSS, Tailwind, Glassmorphism UI, Three.js 3D', { lineGap: 2 });
doc.text('   - Node.js, Express.js, Arhitecturi RESTful API, Autentificare JWT & Securitate Web');

doc.moveDown(0.3);
doc.font('Helvetica-Bold').fontSize(10).fillColor(darkNavy).text('2. Baze de Date & Optimizare SQL:');
doc.font('Helvetica').fontSize(9).fillColor(textMuted).text('   - PostgreSQL, MySQL, SQL Server, modelare relationala, proceduri stocate, indexare avansata', { lineGap: 2 });
doc.text('   - Diagnoza query-uri lente, planuri de executie, securitate si politici automate de backup');

doc.moveDown(0.3);
doc.font('Helvetica-Bold').fontSize(10).fillColor(darkNavy).text('3. Automatizari de Procese & Date:');
doc.font('Helvetica').fontSize(9).fillColor(textMuted).text('   - Scripturi de extragere si sincronizare date, generare automata rapoarte si PDF-uri compatibile ATS', { lineGap: 2 });
doc.text('   - Integrare webhook-uri si notificari automate (WhatsApp, Email, Slack)');

doc.moveDown(0.3);
doc.font('Helvetica-Bold').fontSize(10).fillColor(darkNavy).text('4. Solutii & Mentenanta Hardware / Software la Cerere:');
doc.font('Helvetica').fontSize(9).fillColor(textMuted).text('   - Asistenta tehnica si consiliere in achizitii hardware, asamblare statii de lucru si servere dedicate', { lineGap: 2 });
doc.text('   - Diagnoza hardware la nivel de componenta, mentenanta software preventiva si suport 24/7');

// 3. Experienta Profesionala
addSectionHeader('Experienta Profesionala');

// Job 1
doc.font('Helvetica-Bold').fontSize(10.5).fillColor(darkNavy).text('Full-Stack Web Developer & Consultant Tehnic', { continued: true });
doc.font('Helvetica').fontSize(9.5).fillColor(textMuted).text('  |  Freelance / Colaborari B2B', { continued: true });
doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text(' (2021 - Prezent)', { align: 'right' });

doc.font('Helvetica').fontSize(9).fillColor(textMuted).text(
    '- Proiectare si implementare site-uri web responsive, magazine si platforme de prezentare optimizate SEO.\n' +
    '- Creare scripturi de automatizare documente PDF si fluxuri de date pentru companii mici si mijlocii.\n' +
    '- Consultanta si configurare hardware pentru statii grafice de lucru si sisteme de calcul de inalta performanta.\n' +
    '- Asigurare suport tehnic continuu si mentenanta software pentru platforme web in productie.',
    { lineGap: 2 }
);

doc.moveDown(0.4);

// Job 2
doc.font('Helvetica-Bold').fontSize(10.5).fillColor(darkNavy).text('Administrator Baze de Date & Suport IT', { continued: true });
doc.font('Helvetica').fontSize(9.5).fillColor(textMuted).text('  |  Infrastructura & Servicii Tehnice', { continued: true });
doc.font('Helvetica-Bold').fontSize(9).fillColor(primaryColor).text(' (2019 - 2021)', { align: 'right' });

doc.font('Helvetica').fontSize(9).fillColor(textMuted).text(
    '- Gestionarea integritatii si performantei bazelor de date relationale SQL; creare de scripturi de mentenanta.\n' +
    '- Diagnoza si remediere defecte hardware la PC-uri si servere locale; inlocuire componente defecte.\n' +
    '- Asistenta utilizatori pentru rezolvarea incidentelor software si configurari de retea.',
    { lineGap: 2 }
);

// 4. Proiecte Reprezentative
addSectionHeader('Proiecte Reprezentative');

doc.font('Helvetica-Bold').fontSize(10).fillColor(darkNavy).text('1. Generator Documente & CV PDF (Compatibil ATS)');
doc.font('Helvetica').fontSize(9).fillColor(textMuted).text('Solutie de randare automata a documentelor profesionale PDF pe baza sabloanelor dinamice, cu parsare rapida si styling precis.');

doc.moveDown(0.2);
doc.font('Helvetica-Bold').fontSize(10).fillColor(darkNavy).text('2. Panou de Administrare Baze de Date SQL (React, Node.js, SQL)');
doc.font('Helvetica').fontSize(9).fillColor(textMuted).text('Interfata web pentru monitorizarea volumului de date, verificarea timpilor de raspuns si executarea interogarilor frecvente.');

doc.moveDown(0.2);
doc.font('Helvetica-Bold').fontSize(10).fillColor(darkNavy).text('3. Portofoliu Web Interactiv & Terminal CLI');
doc.font('Helvetica').fontSize(9).fillColor(textMuted).text('Website de prezentare cu motor 3D Three.js, bilingv (RO/EN), terminal CLI cu Matrix Rain, contact direct WhatsApp/Email si optimizare Lighthouse maxima.');

// Footer
doc.moveDown(0.8);
doc.strokeColor(borderGray).lineWidth(0.5).moveTo(45, doc.y).lineTo(550, doc.y).stroke();
doc.moveDown(0.4);
doc.font('Helvetica-Oblique').fontSize(8).fillColor(textMuted).text(
    'Disponibil pentru proiecte freelance, colaborari pe termen lung si consultanta tehnica. Contact: (+40) 720 955 119.',
    { align: 'center' }
);

doc.end();

writeStream.on('finish', () => {
    console.log('✓ PDF generated successfully at:', outputPath);
});
