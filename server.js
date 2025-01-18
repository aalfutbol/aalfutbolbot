const express = require('express');
const path = require('path');
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
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
    res.send(`
      <html>
        <head>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
            }
            .message {
              text-align: center;
              font-size: 24px;
              color: green;
              margin-bottom: 20px;
            }
            .button-container {
              text-align: center;
            }
            button {
              background-color: #4CAF50;
              color: white;
              padding: 15px 32px;
              font-size: 18px;
              border: none;
              cursor: pointer;
              text-align: center;
            }
            button:hover {
              background-color: #45a049;
            }
          </style>
        </head>
        <body>
          <div>
            <div class="message">Form başarıyla alındı, veriler kaydedildi ve görsel oluşturuldu!</div>
            <div class="button-container">
              <button onclick="window.history.back()">Ana Menüye dön</button>
            </div>
          </div>
        </body>
      </html>
    `);
  }).catch(err => {
    console.error("Görsel oluşturulurken hata:", err);
    res.status(500).send('Görsel oluşturulurken hata oluştu.');
  });
});

async function createMatchImage(data) {
  const canvas = createCanvas(2537, 1800); // Yeni boyutları ayarlıyoruz
  const ctx = canvas.getContext('2d');

  // Arka planı ekliyoruz
  const background = await loadImage(path.join(__dirname, 'public', 'logos', 'macsonucu.png')); // Arka plan görselini yüklüyoruz
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height); // Arka planı canvas'a ekliyoruz

  // Takım logolarını ekleyelim
  const homeTeamLogo = await loadImage(path.join(__dirname, 'public', 'logos', `${data.homeTeam.replace(/\s+/g, '').toLowerCase()}.png`));
  const awayTeamLogo = await loadImage(path.join(__dirname, 'public', 'logos', `${data.awayTeam.replace(/\s+/g, '').toLowerCase()}.png`));
  
  // Ev sahibi takım logosunu ekleme
  ctx.drawImage(homeTeamLogo, 250, 335, 600, 600); // Boyut ve pozisyonu ayarlıyoruz

  // Deplasman takım logosunu ekleme
  ctx.drawImage(awayTeamLogo, 1700, 335, 600, 600); // Boyut ve pozisyonu ayarlıyoruz

  // Gol atan oyuncuları işleyelim
  const homeGoals = parseGoals(data.homeGoals);
  const awayGoals = parseGoals(data.awayGoals);

  // Ev sahibi gol atan oyuncuları yazma
  ctx.fillStyle = 'white'; // Yazı rengini beyaz yapıyoruz
  ctx.font = '100px Arial';
  let yPosition = 950; // Ev sahibi için ilk pozisyon
  homeGoals.forEach(goal => {
    ctx.fillText(goal.name, 250, yPosition);
    if (goal.goals > 1) {
      ctx.fillText(`${goal.goals} gol`, 400, yPosition); // Gol sayısı 1'den fazla ise göster
    }
    yPosition += 100; // Y ekseninde aralık bırakıyoruz
  });

  // Deplasman gol atan oyuncuları yazma
  yPosition = 950; // Deplasman için ilk pozisyon
  awayGoals.forEach(goal => {
    ctx.fillText(goal.name, 2000, yPosition);
    if (goal.goals > 1) {
      ctx.fillText(`${goal.goals} gol`, 2150, yPosition); // Gol sayısı 1'den fazla ise göster
    }
    yPosition += 100; // Y ekseninde aralık bırakıyoruz
  });

  // Sonuç: Ev sahibi - Deplasman
  ctx.fillStyle = 'white'; // Skor beyaz renkte olacak
  ctx.font = '200px Arial';
  ctx.fillText(`${data.homeScore} - ${data.awayScore}`, 1050, 650); // Skor

  // Görseli kaydediyoruz
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('logs/matchImage.png', buffer); // Görseli kaydediyoruz
}

// Gol atan oyuncuları ayrıştırmak için yardımcı fonksiyon
function parseGoals(goalString) {
  const goalEntries = goalString.split(','); // Virgülle ayrılmış oyuncu-gol sayısı
  const goals = goalEntries.map(entry => {
    const parts = entry.trim().split(/(\d+)/); // İsmi ve gol sayısını ayırıyoruz
    const name = parts[0].trim();
    const goals = parseInt(parts[1], 10);
    return { name, goals };
  });

  return goals;
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
