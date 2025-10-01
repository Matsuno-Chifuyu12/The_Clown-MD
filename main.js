// main.js
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴
// Point d'entrée principal

import connectToWhatsApp from './auth/authHandler.js';
import handleIncomingMessage from './messages/messageHandler.js';
import reconnect from './events/reconnect.js';
import { startBot } from './events/bot.js';
import { MODE } from './config.js';
import isValidCode from './utils/validator.js';

// Nom du bot
const BOT_NAME = "🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴";

console.log(`🚀 ${BOT_NAME} | Démarrage en cours...`);

if (MODE === "Default") {
  // Mode WhatsApp uniquement
  (async () => {
    try {
      console.log(`⚡ ${BOT_NAME} | Initialisation en mode WhatsApp...`);
      await connectToWhatsApp(handleIncomingMessage);
      // await reconnect(); // Décommenter si besoin de restaurer automatiquement toutes les sessions
      console.log(`✅ ${BOT_NAME} | Bot opérationnel en mode WhatsApp.`);
    } catch (error) {
      console.error(`💥 ${BOT_NAME} | Erreur au démarrage WhatsApp:`, error.message);
      process.exit(1);
    }
  })();

} else {
  // Mode avec validation de licence
  const durationOrFalse = isValidCode(MODE);

  if (!durationOrFalse) {
    console.log(
      `❌ ${BOT_NAME} | Licence invalide. Exécution refusée.\n` +
      `📩 Contactez le créateur : kurona 🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴`
    );
    process.exit(1);
  }

  console.log(
    `✅ ${BOT_NAME} | Licence validée !` +
    ` Durée restante: ~${Math.ceil(durationOrFalse / (1000 * 60 * 60 * 24))} jours.`
  );

  try {
    startBot(durationOrFalse);
    console.log(`
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
┃          ${BOT_NAME} 
┃    The Ultimate WhatsApp Experience
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯

╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
┃ ❃ 𝗠𝗼𝗱𝗲   : Public
┃ ❃ 𝗢𝘄𝗻𝗲𝗿 : 🎴 𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥 🎴
┃ ❃ 𝗣𝗿𝗲𝗳𝗶𝘅 : [ . ]
┃ ❃ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : v1.0.0
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯

${BOT_NAME} | lancé avec succès ! 
        `);
  } catch (error) {
    console.error(`💥 ${BOT_NAME} | Erreur au démarrage Telegram:`, error.message);
    process.exit(1);
  }
}
