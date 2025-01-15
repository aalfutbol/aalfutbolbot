const TelegramBot = require('node-telegram-bot-api');

// Bot API token'ınızı burada girin
const token = '7694032626:AAHNXLXwAGGeIVMSWhUL47vGxNR1e9jPpvQ';  // BotFather'dan aldığınız token'ı buraya yapıştırın

// Telegram botunu başlatıyoruz, polling true yaparak sürekli dinlemesini sağlıyoruz
const bot = new TelegramBot(token, { polling: true });

// Ev sahibi takım ve deplasman takımı seçimi için durumu takip edeceğiz
let currentStep = 0;
let homeTeam = '';
let awayTeam = '';
let matchData = {}; // Maç verilerini burada tutacağız

// /start komutuna yanıt vermek için event listener ekliyoruz
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  currentStep = 1;
  bot.sendMessage(chatId, 'Lütfen ev sahibi takımını seçin (takım numarasını yazın):\n1. Resitaal\n2. Follofoş\n3. Firavunun Musası\n4. Bamba\n5. Hazyurs\n6. CPT\n7. Filiz Kemaal\n8. Dombaalak\n9. Hilmi FC\n10. BirBeşBir\n11. Mangolu İce Tea\n12. SDM Sporting\n13. FSA FC\n14. Best Ham United\n15. Arriero');
});

// Takım seçimini ve gol sayısını alma
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Ev sahibi takım seçimi
  if (currentStep === 1) {
    if (text === '1') {
      homeTeam = 'Resitaal';
      matchData.homeTeam = homeTeam;
    } else if (text === '2') {
      homeTeam = 'Follofoş';
      matchData.homeTeam = homeTeam;
    } else if (text === '3') {
      homeTeam = 'Firavunun Musası';
      matchData.homeTeam = homeTeam;
    } else if (text === '4') {
      homeTeam = 'Bamba';
      matchData.homeTeam = homeTeam;
    } else if (text === '5') {
      homeTeam = 'Hazyurs';
      matchData.homeTeam = homeTeam;
    } else if (text === '6') {
      homeTeam = 'CPT';
      matchData.homeTeam = homeTeam;
    } else if (text === '7') {
      homeTeam = 'Filiz Kemaal';
      matchData.homeTeam = homeTeam;
    } else if (text === '8') {
      homeTeam = 'Dombaalak';
      matchData.homeTeam = homeTeam;
    } else if (text === '9') {
      homeTeam = 'Hilmi FC';
      matchData.homeTeam = homeTeam;
    } else if (text === '10') {
      homeTeam = 'BirBeşBir';
      matchData.homeTeam = homeTeam;
    } else if (text === '11') {
      homeTeam = 'Mangolu İce Tea';
      matchData.homeTeam = homeTeam;
    } else if (text === '12') {
      homeTeam = 'SDM Sporting';
      matchData.homeTeam = homeTeam;
    } else if (text === '13') {
      homeTeam = 'FSA FC';
      matchData.homeTeam = homeTeam;
    } else if (text === '14') {
      homeTeam = 'Best Ham United';
      matchData.homeTeam = homeTeam;
    } else if (text === '15') {
      homeTeam = 'Arriero';
      matchData.homeTeam = homeTeam;
    } else {
      bot.sendMessage(chatId, 'Geçersiz takım numarası. Lütfen tekrar deneyin.');
      return;
    }

    currentStep = 2; // Ev sahibi takım seçildi, gol sayısını sormaya geçiyoruz.
    bot.sendMessage(chatId, `${homeTeam} takımının attığı gol sayısını girin:`);
  }

  // Ev sahibi takımın gol sayısı alındıktan sonra deplasman takımının gol sayısını soruyoruz
  else if (currentStep === 2) {
    matchData.homeGoals = parseInt(text); // Ev sahibi gol sayısını kaydediyoruz
    currentStep = 3;
    bot.sendMessage(chatId, 'Lütfen deplasman takımını seçin (takım numarasını yazın):\n1. Resitaal\n2. Follofoş\n3. Firavunun Musası\n4. Bamba\n5. Hazyurs\n6. CPT\n7. Filiz Kemaal\n8. Dombaalak\n9. Hilmi FC\n10. BirBeşBir\n11. Mangolu İce Tea\n12. SDM Sporting\n13. FSA FC\n14. Best Ham United\n15. Arriero');
  }

  // Deplasman takımı seçildikten sonra gol sayısını soruyoruz
  else if (currentStep === 3) {
    if (text === '1') {
      awayTeam = 'Resitaal';
      matchData.awayTeam = awayTeam;
    } else if (text === '2') {
      awayTeam = 'Follofoş';
      matchData.awayTeam = awayTeam;
    } else if (text === '3') {
      awayTeam = 'Firavunun Musası';
      matchData.awayTeam = awayTeam;
    } else if (text === '4') {
      awayTeam = 'Bamba';
      matchData.awayTeam = awayTeam;
    } else if (text === '5') {
      awayTeam = 'Hazyurs';
      matchData.awayTeam = awayTeam;
    } else if (text === '6') {
      awayTeam = 'CPT';
      matchData.awayTeam = awayTeam;
    } else if (text === '7') {
      awayTeam = 'Filiz Kemaal';
      matchData.awayTeam = awayTeam;
    } else if (text === '8') {
      awayTeam = 'Dombaalak';
      matchData.awayTeam = awayTeam;
    } else if (text === '9') {
      awayTeam = 'Hilmi FC';
      matchData.awayTeam = awayTeam;
    } else if (text === '10') {
      awayTeam = 'BirBeşBir';
      matchData.awayTeam = awayTeam;
    } else if (text === '11') {
      awayTeam = 'Mangolu İce Tea';
      matchData.awayTeam = awayTeam;
    } else if (text === '12') {
      awayTeam = 'SDM Sporting';
      matchData.awayTeam = awayTeam;
    } else if (text === '13') {
      awayTeam = 'FSA FC';
      matchData.awayTeam = awayTeam;
    } else if (text === '14') {
      awayTeam = 'Best Ham United';
      matchData.awayTeam = awayTeam;
    } else if (text === '15') {
      awayTeam = 'Arriero';
      matchData.awayTeam = awayTeam;
    } else {
      bot.sendMessage(chatId, 'Geçersiz takım numarası. Lütfen tekrar deneyin.');
      return;
    }

    currentStep = 4; // Deplasman takımı seçildi, gol sayısını sormaya geçiyoruz.
    bot.sendMessage(chatId, `${awayTeam} takımının attığı gol sayısını girin:`);
  }

  // Deplasman takımının gol sayısını aldık
  else if (currentStep === 4) {
    matchData.awayGoals = parseInt(text); // Deplasman gol sayısını kaydediyoruz
    bot.sendMessage(chatId, `Maç tamamlandı!\nEv Sahibi: ${matchData.homeTeam} (${matchData.homeGoals} gol)\nDeplasman: ${matchData.awayTeam} (${matchData.awayGoals} gol)\nTeşekkürler!`);
    currentStep = 0; // İşlem tamamlandığı için sıfırlıyoruz
  }
});
