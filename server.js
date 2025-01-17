const express = require('express');
const path = require('path');
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas'); // Canvas modülünü ekliyoruz
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/submit', (req, res) => {
  const data = req.body;
  console.log('Form Verileri:', data);

  // JSON dosyasına kaydetme
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync('logs/matchData.json', jsonData);

  // Görseli oluşturma
  createMatchImage(data).then(() => {
    res.send('Form başarıyla alındı, veriler kaydedildi ve görsel oluşturuldu!');
  }).catch(err => {
    console.error("Görsel oluşturulurken hata:", err);
    res.status(500).send('Görsel oluşturulurken hata oluştu.');
  });
});

async function createMatchImage(data) {
  const canvas = createCanvas(2537, 1800); // Yeni boyutları ayarlıyoruz
  const ctx = canvas.getContext('2d');

  // Arka planı ekliyoruz
  const background = await loadImage('/Users/kemalaziz/newpro/public/logos/macsonucu.png'); // Arka plan görselini yüklüyoruz
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height); // Arka planı canvas'a ekliyoruz

  // Takım logolarını ekleyelim
  const homeTeamLogo = await loadImage(path.join(__dirname, 'public', 'logos', `${data.homeTeam}.png`));
  const awayTeamLogo = await loadImage(path.join(__dirname, 'public', 'logos', `${data.awayTeam}.png`));
  
  // Ev sahibi takım logosunu ekleme
  ctx.drawImage(homeTeamLogo, 100, 150, 200, 200); // Boyut ve pozisyonu ayarlıyoruz

  // Deplasman takım logosunu ekleme
  ctx.drawImage(awayTeamLogo, 2237, 150, 200, 200); // Boyut ve pozisyonu ayarlıyoruz

  // Takım isimlerini yazma
  ctx.font = '48px Arial';
  ctx.fillStyle = '#000';
  ctx.fillText(data.homeTeam, 100, 400); // Ev sahibi takım ismi
  ctx.fillText(data.awayTeam, 2237, 400); // Deplasman takım ismi

  // Gol atan oyuncuları yazma
  ctx.font = '36px Arial';
  ctx.fillText(`Gol atan oyuncular: ${data.homeGoals}`, 100, 480); // Ev sahibi oyuncular
  ctx.fillText(`Gol atan oyuncular: ${data.awayGoals}`, 2237, 480); // Deplasman oyuncular

  // Sonuç: Ev sahibi - Deplasman
  ctx.font = '72px Arial';
  ctx.fillText(`${data.homeScore} - ${data.awayScore}`, 1290, 900); // Skor

  // Görseli kaydediyoruz
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('logs/matchImage.png', buffer); // Görseli kaydediyoruz
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
