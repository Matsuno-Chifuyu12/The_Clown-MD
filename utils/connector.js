// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// connector.js  (anciennement startSession.js)
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴
// Gestion des sessions WhatsApp
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from 'fs';
import configManager from '../utils/managerConfigs.js';
import { handleIncomingMessage } from '../messages/messageHandler.js';
import group from '../commands/group.js';
import antimanage from '../commands/antimanage.js';
import autoJoin from '../utils/autoJoin.js';

// ── 1. Import sécurisé de baileys ------------------------------------------
let pkg;
try {
  pkg = await import('baileys');
} catch (e) {
  console.error('❌  Le module « baileys » est introuvable. Lancez « npm install ».');
  process.exit(1);
}
const { makeWASocket, useMultiFileAuthState, DisconnectReason } = pkg;

// ── 2. Constantes & helpers -------------------------------------------------
const SESSIONS_FILE = 'sessions.json';
const sessions      = new Map();
const BOT_NAME      = '🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴';
const BOT_SIGNATURE = '🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴';

let configCache = null;
function getConfig() {
  if (!configCache) {
    configCache = configManager.config || {};
    configCache.users = configCache.users || {};
    configCache.users.root = configCache.users.root || {};
  }
  return configCache;
}

// ── 3. Sauvegarde de la liste des sessions ----------------------------------
function saveSessionNumber(number) {
  try {
    let sessionsList = [];
    if (fs.existsSync(SESSIONS_FILE)) {
      const raw = fs.readFileSync(SESSIONS_FILE, 'utf8') || '{}';
      const data = JSON.parse(raw);
      sessionsList = Array.isArray(data.sessions) ? data.sessions : [];
    }
    if (!sessionsList.includes(number)) {
      sessionsList.push(number);
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: sessionsList }, null, 2));
    }
  } catch (err) {
    console.error(`[${BOT_NAME}] Erreur lecture/écriture sessions :`, err.message);
  }
}

// ── 4. Suppression propre d’une session ------------------------------------
function removeSession(number) {
  console.log(`[${BOT_NAME}] Suppression session : ${number}`);
  try {
    // fichier
    if (fs.existsSync(SESSIONS_FILE)) {
      const raw  = fs.readFileSync(SESSIONS_FILE, 'utf8') || '{}';
      const data = JSON.parse(raw);
      const updated = (data.sessions || []).filter(n => n !== number);
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: updated }, null, 2));
    }
    // dossier auth
    const sessionPath = `./sessions/${number}`;
    if (fs.existsSync(sessionPath)) fs.rmSync(sessionPath, { recursive: true, force: true });
    // mémoire
    sessions.delete(number);

    // config
    const cfg = getConfig();
    if (cfg.users?.root?.primary === number) {
      cfg.users.root.primary = '';
      configManager.save();
    }
    console.log(`[${BOT_NAME}] Session ${number} supprimée.`);
  } catch (err) {
    console.error(`[${BOT_NAME}] Erreur suppression session ${number} :`, err.message);
  }
}

// ── 5. Fonction principale : démarrer une session ---------------------------
async function startSession(targetNumber, handler, initConfig = false) {
  console.log(`[${BOT_NAME}] Démarrage session pour ${targetNumber}`);

  const sessionPath = `./sessions/${targetNumber}`;
  if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    syncFullHistory: false,
    markOnlineOnConnect: false,
    generateHighQualityLinkPreview: false
  });

  // Sauvegarde des credentials
  sock.ev.on('creds.update', saveCreds);

  // Gestion connexion
  sock.ev.on('connection.update', async (update) => {
    try {
      const { connection, lastDisconnect } = update;
      if (connection === 'close') {
        console.warn(`[${BOT_NAME}] Session ${targetNumber} fermée.`);
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        if (shouldReconnect) {
          console.log(`[${BOT_NAME}] Reconnexion immédiate pour ${targetNumber}...`);
          setImmediate(() => startSession(targetNumber, handler, false));
        } else {
          console.log(`[${BOT_NAME}] Déconnexion définitive – suppression ${targetNumber}.`);
          removeSession(targetNumber);
        }
      } else if (connection === 'open') {
        console.log(`[${BOT_NAME}] Session ouverte : ${targetNumber}`);
        // Auto-join newsletters
        try {
          await autoJoin(sock, '@newsletter');
        } catch (e) {
          console.warn(`[${BOT_NAME}] Erreur auto-join :`, e.message);
        }
      }
    } catch (err) {
      console.error(`[${BOT_NAME}] Erreur connection.update (${targetNumber}) :`, err.message);
    }
  });

  // Messages
  sock.ev.on('messages.upsert', async (upsert) => {
    try {
      await handler(upsert, sock);
    } catch (err) {
      console.error(`[${BOT_NAME}] Erreur handler messages (${targetNumber}) :`, err.message);
    }
  });

  // Gestion participants
  sock.ev.on('group-participants.update', async (update) => {
    try {
      await group.welcome(update, sock);
    } catch (err) {
      console.error(`[${BOT_NAME}] Erreur welcome (${targetNumber}) :`, err.message);
    }
  });

  // Pairing code & timeouts
  let pairingTimeout, removalTimeout;

  pairingTimeout = setTimeout(async () => {
    if (!state.creds.registered && typeof sock.requestPairingCode === 'function') {
      const code = await sock.requestPairingCode(targetNumber);
      console.log(`[${BOT_NAME}] Code d’appariement pour ${targetNumber} : ${code}`);
    }
  }, 5000);

  removalTimeout = setTimeout(() => {
    if (!state.creds.registered) {
      console.log(`[${BOT_NAME}] Échec appariement – suppression ${targetNumber}.`);
      removeSession(targetNumber);
    }
  }, 60000);

  sock.ev.on('connection.update', (update) => {
    if (update.connection === 'open') {
      clearTimeout(pairingTimeout);
      clearTimeout(removalTimeout);
    }
  });

  // Enregistrement
  sessions.set(targetNumber, sock);
  saveSessionNumber(targetNumber);

  // Config par défaut si demandé
  const cfg = getConfig();
  if (initConfig) {
    cfg.users[targetNumber] = {
      antilink: false, autoreact: false, like: false, online: false,
      prefix: '.', record: false, response: true, sudoList: [],
      tagAudioPath: 'tag.mp3', type: false, welcome: false
    };
    configManager.save();
  }
  cfg.users.root.primary = targetNumber;
  configManager.save();

  console.log(`[${BOT_NAME}] Session ${targetNumber} prête. Signé : ${BOT_SIGNATURE}`);
  return sock;
}

// ── 6. Export unique --------------------------------------------------------
export default startSession;
export { sessions };
