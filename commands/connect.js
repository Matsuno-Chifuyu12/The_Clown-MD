// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// sessionManager.js  –  version corrigée & complète
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴
// Gestionnaire de sessions WhatsApp Multi-Device
// Créateur : 🎴𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from 'fs';
import sender from '../messages/sender.js';
import { handleIncomingMessage } from '../messages/messageHandler.js';

// ── 1. Import sécurisé de baileys ---------------------------------------
let pkg;
try {
  pkg = await import('@whiskeysockets/baileys');
} catch (e) {
  console.error('❌  Le module « baileys » est introuvable. Lancez « npm install ».');
  process.exit(1);
}
const { makeWASocket, useMultiFileAuthState, DisconnectReason } = pkg;

import configManager from '../utils/managerConfigs.js';

// ── 2. Constantes & variables -------------------------------------------
const BOT_NAME  = '🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴';
const CREATOR   = '🎴𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴';
const SESSIONS_FILE = './sessions.json';
const sessions = {}; // sock by number

// ── 3. Persistances ------------------------------------------------------
function saveSessionNumber(number) {
  let list = [];
  if (fs.existsSync(SESSIONS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8'));
      list = Array.isArray(data.sessions) ? data.sessions : [];
    } catch (e) {
      console.warn(`[${BOT_NAME}] ⚠️ Erreur lecture sessions :`, e.message);
    }
  }
  if (!list.includes(number)) {
    list.push(number);
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: list }, null, 2));
    console.log(`[${BOT_NAME}] ✅ Session sauvegardée : ${number}`);
  }
}

function removeSession(number) {
  console.log(`[${BOT_NAME}] ❌ Suppression session ${number}…`);
  // Fichier
  if (fs.existsSync(SESSIONS_FILE)) {
    let list = [];
    try {
      list = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8')).sessions || [];
    } catch {}
    list = list.filter(n => n !== number);
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: list }, null, 2));
  }
  // Dossier auth
  const dir = `./sessions/${number}`;
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  // Mémoire
  delete sessions[number];
  console.log(`[${BOT_NAME}] ✅ Session ${number} supprimée.`);
}

// ── 4. Démarrage / création d’une session --------------------------------
async function startSession(targetNumber, message, client) {
  console.log(`[${BOT_NAME}] 🚀 Démarrage session ${targetNumber}`);

  const sessionDir = `./sessions/${targetNumber}`;
  if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    syncFullHistory: false,
    markOnlineOnConnect: false
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      console.log(`[${BOT_NAME}] 🔌 Session fermée ${targetNumber}`);
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        console.log(`[${BOT_NAME}] 🔄 Reconnexion ${targetNumber}…`);
        await startSession(targetNumber, message, client);
      } else {
        console.log(`[${BOT_NAME}] 🚫 Déconnexion définitive ${targetNumber}`);
        removeSession(targetNumber);
      }
    } else if (connection === 'open') {
      console.log(`[${BOT_NAME}] ✅ Session active ${targetNumber}`);
    }
  });

  // Génération code pairing
  setTimeout(async () => {
    if (!state.creds.registered && typeof sock.requestPairingCode === 'function') {
      const code = await sock.requestPairingCode(targetNumber);
      console.log(`[${BOT_NAME}] 📲 Code pairing ${targetNumber} : ${code}`);
      if (message) sender(message, client, `${code}`);
    }
  }, 5_000);

  // Timeout pairing
  setTimeout(async () => {
    if (!state.creds.registered) {
      console.log(`[${BOT_NAME}] ❌ Pairing expiré ${targetNumber}`);
      if (message) sender(message, client, `❌ Pairing expiré pour ${targetNumber}. Réessayez.`);
      removeSession(targetNumber);
    }
  }, 60_000);

  // Messages
  sock.ev.on('messages.upsert', async (msg) => handleIncomingMessage(msg, sock));

  // Sauvegarde
  sessions[targetNumber] = sock;
  saveSessionNumber(targetNumber);

  // Config par défaut
  configManager.config.users[targetNumber] = {
    sudoList: [],
    tagAudioPath: 'tag.mp3',
    antilink: false,
    response: true,
    autoreact: false,
    prefix: '.',
    reaction: '🌹',
    welcome: false,
    record: false,
    type: false
  };
  configManager.save();

  return sock;
}

// ── 5. Reconnexion automatique ------------------------------------------
async function reconnect(client) {
  if (!fs.existsSync(SESSIONS_FILE)) return;
  const list = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8')).sessions || [];
  for (const num of list) {
    console.log(`[${BOT_NAME}] 🔄 Reconnexion ${num}`);
    try {
      await startSession(num, null, client);
    } catch (e) {
      console.error(`[${BOT_NAME}] ❌ Erreur reconnexion ${num} :`, e);
      removeSession(num);
    }
  }
}

// ── 6. Connexion manuelle (commande) ------------------------------------
async function connect(message, client) {
  let targetNumber;

  if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
    targetNumber = message.message.extendedTextMessage.contextInfo.participant;
  } else {
    const body = message.message?.extendedTextMessage?.text || message.message?.conversation || '';
    const parts = body.split(/\s+/);
    targetNumber = parts[1];
  }

  if (!targetNumber) {
    return sender(message, client, `❌ [${BOT_NAME}] Fournis un numéro ou réponds à un message pour te connecter.`);
  }

  targetNumber = targetNumber.replace('@s.whatsapp.net', '').trim();

  if (sessions[targetNumber]) {
    return sender(message, client, `[${BOT_NAME}] Ce numéro est déjà connecté.`);
  }

  await startSession(targetNumber, message, client);
}

// ── 7. Exportations -----------------------------------------------------
export default { connect, reconnect };

// ── 8. Banner -----------------------------------------------------------
console.log(
  `\n╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│  ${BOT_NAME} prêt à fonctionner
│  Créateur : ${CREATOR}
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯\n`
);
