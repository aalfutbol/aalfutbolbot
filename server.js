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
  const isAnnouncement = data.background === 'matchAnnouncement';
  const canvas = createCanvas(2537, 1800);
  const ctx = canvas.getContext('2d');

  // Arka planı ekliyoruz
  const backgroundImagePath = path.join(__dirname, 'public', 'logos', isAnnouncement ? 'macduyurusu.png' : 'macsonucu.png');
  const background = await loadImage(backgroundImagePath);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Takım logolarını ekleyelim
  const homeTeamLogo = await loadImage(path.join(__dirname, 'public', 'logos', `${data.homeTeam.replace(/\s+/g, '').toLowerCase()}.png`));
  const awayTeamLogo = await loadImage(path.join(__dirname, 'public', 'logos', `${data.awayTeam.replace(/\s+/g, '').toLowerCase()}.png`));

  ctx.drawImage(homeTeamLogo, 250, 335, 600, 600); // Ev sahibi takım logosu
  ctx.drawImage(awayTeamLogo, 1700, 335, 600, 600); // Deplasman takım logosu

  if (!isAnnouncement) {
    // Maç sonucu için ekstra bilgiler ekliyoruz
    const homeGoals = parseGoals(data.homeGoals);
    const awayGoals = parseGoals(data.awayGoals);

    ctx.fillStyle = 'white';
    ctx.font = '100px Arial';
    let yPosition = 950;
    homeGoals.forEach(goal => {
      ctx.fillText(goal.name, 250, yPosition);
      if (goal.goals > 1) {
        ctx.fillText(`${goal.goals} gol`, 400, yPosition);
      }
      yPosition += 100;
    });

    yPosition = 950;
    awayGoals.forEach(goal => {
      ctx.fillText(goal.name, 2000, yPosition);
      if (goal.goals > 1) {
        ctx.fillText(`${goal.goals} gol`, 2150, yPosition);
      }
      yPosition += 100;
    });

    ctx.font = '200px Arial';
    ctx.fillText(`${data.homeScore} - ${data.awayScore}`, 1050, 650);
  }

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('logs/matchImage.png', buffer);
}

function parseGoals(goalString) {
  const goalEntries = goalString.split(',');
  return goalEntries.map(entry => {
    const parts = entry.trim().split(/(\d+)/);
    const name = parts[0].trim();
    const goals = parseInt(parts[1], 10);
    return { name, goals };
  });
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
