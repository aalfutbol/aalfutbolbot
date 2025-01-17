const express = require('express');
const path = require('path');
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const app = express();

const teams = [
  'Resitaal', 'Follofoş', 'Firavunun Musası', 'Bamba', 'Hazyurs',
  'CPT', 'Filiz Kemaal', 'Dombaalak', 'Hilmi FC', 'BirBeşBir',
  'Mangolu İce Tea', 'SDM Sporting', 'FSA FC', 'Best Ham United', 'Arriero'
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  // Ev sahibi ve deplasman takımlarını seçmek için HTML formu döndürüyoruz
  let formHTML = '<h1 style="text-align:center;">AALFUTBOL MAÇ OTOMATİK GÖRSELİ BOTU</h1>';
  formHTML += '<form method="POST" action="/submit" style="text-align:center;">';
  
  // Ev sahibi takım seçimi
  formHTML += '<label for="homeTeam">Ev Sahibi Takım:</label>';
  formHTML += '<select name="homeTeam" id="homeTeam" onchange="updateAwayTeam()" style="font-size: 18px;">';
  formHTML += '<option value="">Seçiniz</option>'; // Varsayılan "Seçiniz" seçeneği
  teams.forEach(team => {
    formHTML += `<option value="${team}">${team}</option>`;
  });
  formHTML += '</select><br><br>';

  // Deplasman takım seçimi
  formHTML += '<label for="awayTeam">Deplasman Takım:</label>';
  formHTML += '<select name="awayTeam" id="awayTeam" style="font-size: 18px;">';
  formHTML += '<option value="">Seçiniz</option>'; // Varsayılan "Seçiniz" seçeneği
  teams.forEach(team => {
    formHTML += `<option value="${team}">${team}</option>`;
  });
  formHTML += '</select><br><br>';

  formHTML += '<label for="homeScore">Ev Sahibi Skoru:</label><input type="number" name="homeScore" required style="font-size: 18px;"><br><br>';
  formHTML += '<label for="awayScore">Deplasman Skoru:</label><input type="number" name="awayScore" required style="font-size: 18px;"><br><br>';

  formHTML += '<label for="homeGoals">Ev Sahibi Gol Atanlar:</label><input type="text" name="homeGoals" style="font-size: 18px;"><br><br>';
  formHTML += '<label for="awayGoals">Deplasman Gol Atanlar:</label><input type="text" name="awayGoals" style="font-size: 18px;"><br><br>';

  formHTML += '<input type="submit" value="Görseli Oluştur" style="font-size: 18px; padding: 10px 20px;"><br><br>';
  formHTML += '</form>';
  formHTML += `<script>
    function updateAwayTeam() {
      const homeTeam = document.getElementById('homeTeam').value;
      const awayTeamSelect = document.getElementById('awayTeam');
      for (let option of awayTeamSelect.options) {
        if (option.value === homeTeam) {
          option.disabled = true;
        } else {
          option.disabled = false;
        }
      }
    }
  </script>`;
  res.send(formHTML);
});

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
  const homeTeamLogo = await loadImage(path.join(__dirname, 'public', 'logos', `${data.homeTeam.replace(/\s+/g, '').toLowerCase()}.png`));
  const awayTeamLogo = await loadImage(path.join(__dirname, 'public', 'logos', `${data.awayTeam.replace(/\s+/g, '').toLowerCase()}.png`));
  
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
