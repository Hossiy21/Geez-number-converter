const TelegramBot = require('node-telegram-bot-api');
const Geezify = require("geezify-js");
const geezer = Geezify.create();

const express = require('express');
const app = express();
app.get('/',(req,res)=>{
  res.send("Working");
});

const port = 3000;
app.listen(port,()=>{
  console.log(`Server running at http://localhost:${port}`);
});

const token = '6562304192:AAGCHlJvUr5AmrgKogZtuOia0yhlclgpP4Q';
const bot = new TelegramBot(token, { polling: true });

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
