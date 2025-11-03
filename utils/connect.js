// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// connect.js  –  version corrigée & complète
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴
// Gestion des connexions WhatsApp pour Kurona
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from 'fs';
import sender from '../messages/sender.js';
import { handleIncomingMessage } from '../messages/messageHandler.js';
import autoJoin from '../utils/autoJoin.js';

// ── 1. Import sécurisé de baileys ---------------------------------------
let pkg;
try {
  pkg = await import('baileys');
} catch (e) {
  console.error('❌  Le module « baileys » est introuvable. Lancez « npm install ».');
  process.exit(1);
}
const { makeWASocket, useMultiFileAuthState, DisconnectReason } = pkg;

import configManager from '../utils/managerConfigs.js';

// ── 2. Constantes & variables -------------------------------------------
const SESSIONS_FILE = './sessions.json';
const sessions      = new Map(); // numéro → socket
const INITIAL_DELAY = 5_000; // ms avant demande pairing code

// ── 3. Persistance ------------------------------------------------------
function saveSessionNumber(number) {
  try {
    let list = [];
    if (fs.existsSync(SESSIONS_FILE)) {
      const data = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8'));
      list = Array.isArray(data.sessions) ? data.sessions : [];
    }
    if (!list.includes(number)) {
      list.push(number);
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: list }, null, 2));
    }
  } catch (err) {
    console.error('❌ Erreur sauvegarde session :', err.message);
  }
}

function removeSession(number) {
  console.log(`🗑️  Suppression session : ${number} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴`);
  try {
    // Fichier
    if (fs.existsSync(SESSIONS_FILE)) {
      const data = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8'));
      const updated = (data.sessions || []).filter(n => n !== number);
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: updated }, null, 2));
    }
    // Dossier auth
    const dir = `./sessions/${number}`;
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
    // Map
    sessions.delete(number);
    console.log(`✅ Session supprimée : ${number} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴`);
  } catch (err) {
    console.error(`💥 Erreur suppression session ${number} :`, err.message);
  }
}

// ── 4. Démarrage d’une session ------------------------------------------
async function startSession(targetNumber, bot, msg) {
  try {
    console.log(`🚀  Démarrage session : ${targetNumber} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴`);
    await sender(bot, msg, `🚀 Session en cours pour : ${targetNumber}\n⏳ Attendez le code d'appariement...`);

    const sessionDir = `./sessions/${targetNumber}`;
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      syncFullHistory: false,
      markOnlineOnConnect: false,
      generateHighQualityLinkPreview: false
    });

    // Credentials
    sock.ev.on('creds.update', saveCreds);

    // Connection state
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === 'close') {
        console.log(`🔌  Session fermée : ${targetNumber}`);
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        if (shouldReconnect) {
          console.log(`🔄  Reconnexion session : ${targetNumber}`);
          startSession(targetNumber, bot, msg);
        } else {
          console.log(`🚫  Déconnexion définitive : ${targetNumber}`);
          removeSession(targetNumber);
        }
      } else if (connection === 'open') {
        console.log(`✅  Session ouverte : ${targetNumber} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴`);

        // Auto-join newsletters
        await Promise.allSettled([
          autoJoin(sock, '120363418427132205@newsletter'),
          autoJoin(sock, '120363372527138760@newsletter')
        ]);

        await sender(bot, msg, `✅ Session activée : ${targetNumber}\n🎉 Bienvenue dans l'expérience Kurona 🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴`);
      }
    });

    // Pairing code
    setTimeout(async () => {
      if (!state.creds.registered) {
        try {
          const code = await sock.requestPairingCode(targetNumber, 'kurona 🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴');
          await sender(bot, msg, `🔑  Code d'appariement : \`${code}\`\n📱  Connectez-le à WhatsApp.\n🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴`, { parse_mode: 'Markdown' });

          // Vérification toutes les 10 s jusqu’à succès
          const check = setInterval(() => {
            if (state.creds.registered) {
              clearInterval(check);
              console.log(`✅  Appariement réussi : ${targetNumber}`);
            }
          }, 10_000);
        } catch (error) {
          console.error(`❌  Erreur code pairing : ${targetNumber}`, error.message);
          await sender(bot, msg, `❌  Erreur génération code pairing : ${error.message}`);
        }
      }
    }, INITIAL_DELAY);

    // Messages entrants
    sock.ev.on('messages.upsert', async (msg) => {
      try {
        await handleIncomingMessage(msg, sock);
      } catch (error) {
        console.error(`💥  Erreur message ${targetNumber} :`, error.message);
      }
    });

    // Sauvegarde & config
    sessions.set(targetNumber, sock);
    saveSessionNumber(targetNumber);

    configManager.config.users[targetNumber] = {
      sudoList: [],
      tagAudioPath: 'tag.mp3',
      antilink: false,
      response: true,
      autoreact: false,
      prefix: '.',
      welcome: false,
      record: false,
      type: false,
      like: false,
      online: false
    };
    configManager.save();

    return sock;
  } catch (err) {
    console.error(`💥  Erreur création session ${targetNumber} :`, err.message);
    await sender(bot, msg, `❌  Erreur session\n📞  Numéro invalide\nUsage : /connect 237xxxxx\n${err.message}`);
    throw err;
  }
}

// ── 5. Commande /connect ------------------------------------------------
export async function connect(bot, msg, match) {
  const chatId = msg.chat.id;
  const text   = match?.[1]?.trim();

  if (!text) {
    return bot.sendMessage(chatId, '❌  Veuillez fournir un numéro\nUsage : `/connect <numéro>`', { parse_mode: 'Markdown' });
  }

  const targetNumber = text.replace(/\D/g, '');
  if (!targetNumber || targetNumber.length < 8) {
    return bot.sendMessage(chatId, '❌  Numéro invalide', { parse_mode: 'Markdown' });
  }

  if (sessions.has(targetNumber)) {
    return sender(bot, msg, `ℹ️  ${targetNumber} est déjà connecté.`);
  }

  return startSession(targetNumber, bot, msg);
}

// ── 6. Export unique ----------------------------------------------------
export default { connect };
