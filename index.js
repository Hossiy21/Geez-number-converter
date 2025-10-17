require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const Geezify = require("geezify-js");
const geezer = Geezify.create();

const express = require('express');
const app = express();

// Load environment variables
require('dotenv').config();
const BOT_TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;

if (!BOT_TOKEN) {
  console.error('Error: BOT_TOKEN is not defined in .env file');
  process.exit(1);
}

app.get('/', (req, res) => {
  res.send("Working");
});

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  } else if (error.code === 'EACCES') {
    console.error(`Permission denied for port ${PORT}. Try a port number higher than 1024.`);
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});

// Initialize Telegram bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text.trim();

  if (message.startsWith('/start')) {
    const username = msg.from.first_name;
    const userId = msg.from.id;
    bot.sendMessage(chatId, `🙋‍♂️ ሰላም <a href="tg://user?id=${userId}">${username}</a> እንኳን ደህና መጣችሁ! ይህን ቦት በመጠቀም በቀላሉ የአረብኛ ቁጥሮችን ወደ ግዕዝ ቁጥር ይቀየሩ።`, { parse_mode: 'HTML' });
  } else if (!isNaN(message)) {
    const geezNumber = geezer.toGeez(parseInt(message));
    bot.sendMessage(chatId, `🔰 ያስገቡት ${message} ቁጥር ወደ ግእዝ ቁጥር ሲቀየር ፡ ${geezNumber} ነው። `);
  } else if (isGeezNumber(message)) {
    const arabicNumber = geezer.toAscii(message);
    bot.sendMessage(chatId, `🔰 ያስገቡት ${message} ቁጥር ወደ አረብኛ ቁጥር ሲቀየር ፡ ${arabicNumber} ነው። `);
  } else {
    bot.sendMessage(chatId, '⚠️ ይቅርታ ያስገቡት ቁጥር ልክ አይደለም እንደገና ይሞክሩ!');
  }
});

// Function to check if the given number is in Geez format
function isGeezNumber(str) {
  return /[\u1200-\u137F]/.test(str);
}
