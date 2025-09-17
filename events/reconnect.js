// reconnect.js
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴
// Gestion des sessions WhatsApp (start, reconnect, remove)
// Hyper performant • Fluide • Robuste • Design Propre

import pkg from 'bailey';
const { makeWASocket, useMultiFileAuthState, DisconnectReason } = pkg;
import handleIncomingMessage from '../events/messageHandler.js';
import configManager from '../utils/manageConfigs.js';
import fs from 'fs';

const SESSIONS_FILE = './sessions.json';
const sessions = new Map();
const RECONNECT_DELAY = 2000;

// Cache configuration
let configCache = null;
function getConfig() {
    if (!configCache) configCache = configManager.config;
    return configCache;
}

/**
 * Supprime proprement une session
 */
function removeSession(number) {
    console.log(`❌ Suppression de la session: ${number} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴`);

    try {
        // Fichier sessions
        if (fs.existsSync(SESSIONS_FILE)) {
            const data = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8'));
            const sessionsList = Array.isArray(data.sessions) ? data.sessions : [];
            const updated = sessionsList.filter(num => num !== number);
            fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: updated }, null, 2));
        }

        // Dossier session
        const sessionPath = `./sessions/${number}`;
        if (fs.existsSync(sessionPath)) fs.rmSync(sessionPath, { recursive: true, force: true });

        // Mémoire
        sessions.delete(number);

        console.log(`✅ Session supprimée: ${number} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴`);
    } catch (err) {
        console.error(`💥 Erreur suppression session ${number}:`, err.message);
    }
}

/**
 * Démarre une session WhatsApp
 */
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

        // Événement connexion
        sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
            if (connection === 'close') {
                console.log(`🔌 Session fermée: ${targetNumber} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴`);
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

                if (shouldReconnect) {
                    console.log(`🔄 Reconnexion dans ${RECONNECT_DELAY}ms: ${targetNumber}`);
                    setTimeout(() => startSession(targetNumber), RECONNECT_DELAY);
                } else {
                    console.log(`🚫 Déconnexion permanente: ${targetNumber}`);
                    removeSession(targetNumber);
                }
            } else if (connection === 'open') {
                console.log(`✅ Session ouverte: ${targetNumber} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴`);
            }
        });

        // Événement messages
        sock.ev.on('messages.upsert', async (msg) => {
            try { await handleIncomingMessage(msg, sock); }
            catch (err) { console.error(`💥 Erreur traitement message ${targetNumber}:`, err.message); }
        });

        // Sauvegarde credentials
        sock.ev.on('creds.update', saveCreds);

        // Stockage session
        sessions.set(targetNumber, sock);
        console.log(`✅ Session initialisée: ${targetNumber} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴`);

        return sock;

    } catch (error) {
        console.error(`💥 Erreur création session ${targetNumber}:`, error.message);
        throw error;
    }
}

/**
 * Reconnexion automatique de toutes les sessions actives
 */
async function reconnect() {
    console.log("🔄 Reconnexion de toutes les sessions | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴");

    if (!fs.existsSync(SESSIONS_FILE)) return;

    let data;
    try { data = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8')); }
    catch (err) { console.error("💥 Erreur lecture fichier sessions:", err.message); return; }

    const sessionNumbers = Array.isArray(data.sessions) ? data.sessions : [];
    const config = getConfig();
    const primaryNumber = config?.users?.root?.primary;

    const reconnectPromises = sessionNumbers
        .filter(number => number !== primaryNumber)
        .map(async (number) => {
            console.log(`🔄 Tentative reconnexion: ${number} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴`);
            try { await startSession(number); }
            catch (err) { console.error(`💥 Échec reconnexion ${number}:`, err.message); removeSession(number); }
        });

    await Promise.allSettled(reconnectPromises);
}

export { startSession, removeSession, sessions };
export default reconnect;
