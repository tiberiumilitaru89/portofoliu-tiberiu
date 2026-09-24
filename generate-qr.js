const QRCode = require('qrcode');

const url = 'https://portofoliu-tiberiu.vercel.app/';
const filePath = 'qr-code.png';

QRCode.toFile(filePath, url, {
  width: 500,
  margin: 4,
  color: {
    dark: '#000000',
    light: '#ffffff'
  }
}, function (err) {
  if (err) throw err;
  console.log(`QR code generated successfully at: ${filePath}`);
});
