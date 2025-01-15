const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const app = express();

// Bot API token'ınızı burada girin
const token = '7694032626:AAHNXLXwAGGeIVMSWhUL47vGxNR1e9jPpvQ';  // BotFather'dan aldığınız token'ı buraya yapıştırın

// Telegram botunu başlatıyoruz
const bot = new TelegramBot(token, { polling: true });

// /start komutuna yanıt vermek için event listener ekliyoruz
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Merhaba! Bu bot ile maç bilgilerini kolayca girebilirsiniz.');
});

// /help komutuna yanıt vermek için event listener ekliyoruz
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Bu bot ile maç bilgilerini girip görseller oluşturabilirsiniz. Kullanmak için /start komutunu girin.');
});

// Express ile HTTP isteği dinleme
app.get('/', (req, res) => {
  res.send('Bot is running');
});

// Sunucuyu çalıştırıyoruz
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
