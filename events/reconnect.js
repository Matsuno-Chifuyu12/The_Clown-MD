// reconnect.js
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Gestion des sessions WhatsApp (start, reconnect, remove)

import { handleIncomingMessage } from '../messages/messageHandler.js';
import configManager from '../utils/managerConfigs.js';
import fs from 'fs';

// ── 1. Import sécurisé de baileys --------------------------------------------
let pkg;
try {
  pkg = await import('@whiskeysockets/baileys');
} catch (e) {
  console.error('❌  Le module « baileys » est introuvable. Lancez « npm install ».');
  process.exit(1);
}
const { makeWASocket, useMultiFileAuthState, DisconnectReason } = pkg;

// ── 2. Constantes & variables -----------------------------------------------
const SESSIONS_FILE = './sessions.json';
const sessions      = new Map();          // sock par numéro
const RECONNECT_DELAY = 2000;             // ms

// ── 3. Cache configuration ---------------------------------------------------
let configCache = null;
function getConfig() {
  if (!configCache) configCache = configManager.config;
  return configCache;
}

// ── 4. Suppression propre d’une session -------------------------------------
function removeSession(number) {
  console.log(`❌ Suppression de la session : ${number} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴`);

  try {
    // 4.1 Fichier sessions.json
    if (fs.existsSync(SESSIONS_FILE)) {
      const data = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8'));
      const updated = (data.sessions || []).filter(n => n !== number);
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: updated }, null, 2));
    }

    // 4.2 Dossier auth
    const sessionPath = `./sessions/${number}`;
    if (fs.existsSync(sessionPath)) {
      fs.rmSync(sessionPath, { recursive: true, force: true });
    }

    // 4.3 Mémoire
    sessions.delete(number);

    console.log(`✅ Session supprimée : ${number} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴`);
  } catch (err) {
    console.error(`💥 Erreur suppression session ${number} :`, err.message);
  }
}

// ── 5. Démarrage / création d’une session -----------------------------------
async function startSession(targetNumber) {
  const sessionPath = `./sessions/${targetNumber}`;
  if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true });

  try {
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      syncFullHistory: false,
      markOnlineOnConnect: false,
      generateHighQualityLinkPreview: false
    });

    // 5.1 Événement « connection.update »
    sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
      if (connection === 'close') {
        console.log(`🔌 Session fermée : ${targetNumber} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴`);
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        if (shouldReconnect) {
          console.log(`🔄 Reconnexion dans ${RECONNECT_DELAY}ms : ${targetNumber}`);
          setTimeout(() => startSession(targetNumber), RECONNECT_DELAY);
        } else {
          console.log(`🚫 Déconnexion permanente : ${targetNumber}`);
          removeSession(targetNumber);
        }
      } else if (connection === 'open') {
        console.log(`✅ Session ouverte : ${targetNumber} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴`);
      }
    });

    // 5.2 Événement messages
    sock.ev.on('messages.upsert', async (msg) => {
      try {
        await handleIncomingMessage(msg, sock);
      } catch (err) {
        console.error(`💥 Erreur traitement message ${targetNumber} :`, err.message);
      }
    });

    // 5.3 Sauvegarde des credentials
    sock.ev.on('creds.update', saveCreds);

    // 5.4 Stockage en mémoire
    sessions.set(targetNumber, sock);
    console.log(`✅ Session initialisée : ${targetNumber} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴`);

    return sock;
  } catch (error) {
    console.error(`💥 Erreur création session ${targetNumber} :`, error.message);
    throw error;
  }
}

// ── 6. Reconnexion automatique de toutes les sessions ------------------------
async function reconnect() {
  console.log('🔄 Reconnexion de toutes les sessions | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴');

  if (!fs.existsSync(SESSIONS_FILE)) return;

  let data;
  try {
    data = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8'));
  } catch (err) {
    console.error('💥 Erreur lecture fichier sessions :', err.message);
    return;
  }

  const sessionNumbers = Array.isArray(data.sessions) ? data.sessions : [];
  const config       = getConfig();
  const primaryNumber = config?.users?.root?.primary;

  const promises = sessionNumbers
    .filter(n => n !== primaryNumber)
    .map(async (number) => {
      console.log(`🔄 Tentative reconnexion : ${number} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴`);
      try {
        await startSession(number);
      } catch (err) {
        console.error(`💥 Échec reconnexion ${number} :`, err.message);
        removeSession(number);
      }
    });

  await Promise.allSettled(promises);
}

// ── 7. Exportations ---------------------------------------------------------
export { startSession, removeSession, sessions };
export default reconnect;
