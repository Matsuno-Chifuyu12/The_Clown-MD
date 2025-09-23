//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Commande START
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { isUserInChannel } from '../utils/checkmember.js';
import fs from 'fs';
import path from 'path';

export async function start(bot, msg) {
  const CHANNEL_USERNAME = '@kurona_tech_channel';
  const GROUP_USERNAME = '@kurona_tech';

  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const user = msg.from.first_name || "Utilisateur";

  const date = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Vérifier si l'utilisateur est abonné au channel
  const isMember = await isUserInChannel(bot, userId);

  const menu = `
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
|       🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴
|   𝐓𝐡𝐞 𝐔𝐥𝐭𝐢𝐦𝐚𝐭𝐞 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐄𝐱𝐩𝐞𝐫𝐢𝐞𝐧𝐜𝐞
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯

╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│       🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝐼𝛮𝑭𝛩🎴
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
│ ❃ 𝗢𝘄𝗻𝗲𝗿 : 🎴 𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
│ ❃ 𝗨𝘀𝗲𝗿 : ${user}
│ ❃ 𝗣𝗿𝗲𝗳𝗶𝘅 : [ / ]
│ ❃ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : v1.0.0
│ ❃ 𝗗𝗮𝘁𝗲 : ${date}
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯

╭┅┅┅┅┅┅ 🎴 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 🎴 ┅┅┅┅┅┅┅┅╮
| Utilisez /menu pour contempler la
| totalité des commandes disponibles !
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯

🎴 ℬ𝓎  𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥 🎴
`;

  if (isMember) {
    // Envoi de la photo avec caption
    await bot.sendPhoto(chatId, fs.createReadStream(path.resolve('assets/images/logo.png')), {
      caption: menu,
      parse_mode: 'Markdown'
    });
  } else {
    // Message pour inviter à rejoindre le channel et le groupe
    await bot.sendMessage(
      chatId,
      `👋🏾 *Ah, noble invité ${user}...*\n\nPour que je puisse vous servir correctement et vous offrir
l'accès à ce sanctuaire de commandes, veuillez d'abord rejoindre notre channel et notre groupe :\n\n➳ [Join Channel](https://t.me/${CHANNEL_USERNAME})\n➳ [Join Group](https://t.me/${GROUP_USERNAME})\n\nPuis, cliquez sur le bouton ci-dessous pour confirmer votre loyauté.`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: "✅ Ma loyauté est acquise", callback_data: 'check_join' }]
          ]
        }
      }
    );
  }
}

export default start;
