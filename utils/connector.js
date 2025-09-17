// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// startSession.js
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴
// Gestion des sessions WhatsApp (Kurona)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { makeWASocket, useMultiFileAuthState, DisconnectReason } from 'bailey';
import configManager from '../utils/manageConfigs.js';
import fs from "fs";
import handleIncomingMessage from '../events/messageHandler.js';
import group from '../commands/group.js';

// Constantes
const SESSIONS_FILE = "sessions.json";
const sessions = new Map();
const PAIRING_TIMEOUT = 60000; // 1 min
const INITIAL_DELAY = 5000;    // 5 sec

// Cache de configuration
let configCache = null;

function getConfig() {
    if (!configCache) {
        configCache = configManager.config || {};
        configCache.users = configCache.users || {};
        configCache.users.root = configCache.users.root || {};
    }
    return configCache;
}

// Sauvegarde du numéro de session
function saveSessionNumber(number) {
    try {
        let sessionsList = [];
        if (fs.existsSync(SESSIONS_FILE)) {
            const data = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8'));
            sessionsList = Array.isArray(data.sessions) ? data.sessions : [];
        }
        if (!sessionsList.includes(number)) {
            sessionsList.push(number);
            fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: sessionsList }, null, 2));
        }
    } catch (err) {
        console.error("❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴] Erreur lecture fichier sessions:", err.message);
    }
}

// Suppression d'une session
function removeSession(number) {
    console.log(`🗑️ Suppression session ${number} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴`);

    try {
        // Mise à jour du fichier sessions
        if (fs.existsSync(SESSIONS_FILE)) {
            const data = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8'));
            const sessionsList = Array.isArray(data.sessions) ? data.sessions : [];
            const updated = sessionsList.filter(num => num !== number);
            fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: updated }, null, 2));
        }

        // Suppression du dossier de session
        const sessionPath = `./sessions/${number}`;
        if (fs.existsSync(sessionPath)) {
            fs.rmSync(sessionPath, { recursive: true, force: true });
        }

        // Suppression mémoire
        sessions.delete(number);

        // Mise à jour config si c'était la session principale
        const config = getConfig();
        if (number === config.users?.root?.primary) {
            config.users.root.primary = "";
            configManager.save();
        }

        console.log(`✅ Session ${number} supprimée avec succès | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴`);
    } catch (err) {
        console.error(`💥 Erreur suppression session ${number}:`, err.message);
    }
}

// Démarrage d'une session
async function startSession(targetNumber, handler, initConfig = false) {
    try {
        console.log(`🚀 Lancement session pour ${targetNumber} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴`);

        const sessionPath = `./sessions/${targetNumber}`;
        if (!fs.existsSync(sessionPath)) {
            fs.mkdirSync(sessionPath, { recursive: true });
        }

        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            syncFullHistory: false,
            markOnlineOnConnect: false,
            generateHighQualityLinkPreview: false
        });

        // Mise à jour des credentials
        sock.ev.on('creds.update', saveCreds);

        // Gestion de la connexion
        sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
            if (connection === 'close') {
                console.log(`⚠️ Session fermée ${targetNumber} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴`);
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

                if (shouldReconnect) {
                    console.log(`🔄 Tentative reconnexion: ${targetNumber}`);
                    startSession(targetNumber, handler);
                } else {
                    console.log(`🚫 Déconnexion définitive: ${targetNumber}`);
                    removeSession(targetNumber);
                }
            } else if (connection === 'open') {
                console.log(`✅ Session ouverte avec succès ${targetNumber} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴`);
            }
        });

        // Génération du code de pairing
        setTimeout(async () => {
            if (!state.creds.registered) {
                try {
                    const code = await sock.requestPairingCode(targetNumber, "kurona 🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴");
                    console.log(`🔑 Code d'appariement ${targetNumber}: ${code} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴`);
                    console.log("📱 Entrez ce code dans votre WhatsApp pour connecter.");
                } catch (error) {
                    console.error(`❌ Erreur génération code pour ${targetNumber}:`, error.message);
                }
            }
        }, INITIAL_DELAY);

        // Timeout de pairing
        setTimeout(() => {
            if (!state.creds.registered) {
                console.log(`⏰ Pairing expiré ${targetNumber}, suppression...`);
                removeSession(targetNumber);
            }
        }, PAIRING_TIMEOUT);

        // Gestion des messages entrants
        sock.ev.on('messages.upsert', async (msg) => {
            try {
                await handler(msg, sock);
            } catch (error) {
                console.error(`💥 Erreur traitement message ${targetNumber}:`, error.message);
            }
        });

        // Gestion des mises à jour de participants dans les groupes
        sock.ev.on('group-participants.update', async (update) => {
            try {
                await group.welcome(update, sock);
            } catch (error) {
                console.error(`💥 Erreur gestion participants ${targetNumber}:`, error.message);
            }
        });

        // Sauvegarde et enregistrement session
        sessions.set(targetNumber, sock);
        saveSessionNumber(targetNumber);

        // Configuration initiale si demandée
        const config = getConfig();
        if (initConfig) {
            config.users[targetNumber] = {
                sudoList: [],
                tagAudioPath: "tag.mp3",
                antilink: false,
                response: true,
                autoreact: false,
                prefix: ".",
                welcome: false,
                record: false,
                type: false,
                like: false,
                online: false
            };
        }

        // Définition de la session root
        config.users.root.primary = targetNumber;
        configManager.save();

        return sock;

    } catch (err) {
        console.error(`💥 Erreur création session ${targetNumber}:`, err.message);
        throw err;
    }
}

export default startSession;
