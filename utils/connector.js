// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// startSession.js
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴
// Gestion des sessions WhatsApp
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import pkg from 'baileys';
const { makeWASocket, useMultiFileAuthState, DisconnectReason } = pkg;

import configManager from '../utils/managerConfigs.js';
import fs from 'fs';
import handleIncomingMessage from '../messages/messageHandler.js';
import group from '../commands/group.js';
import antimanage from '../commands/antimanage.js';

const SESSIONS_FILE = 'sessions.json';
const sessions = new Map();
const BOT_NAME = '🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴';
const BOT_SIGNATURE = '🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴';

/* -------------------------
Config cache helper
------------------------- */
let configCache = null;
function getConfig() {
    if (!configCache) {
        configCache = configManager.config || {};
        configCache.users = configCache.users || {};
        configCache.users.root = configCache.users.root || {};
    }
    return configCache;
}

/* -------------------------
Persist session list safely
------------------------- */
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
        console.error("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ [" + BOT_NAME + "] Erreur lecture/écriture sessions:\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯", err?.message || err);
    }
}

/* -------------------------
Remove session (clean)
------------------------- */
function removeSession(number) {
    try {
        console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🗑️ Suppression session " + number + "\n│ [" + BOT_NAME + "] s'en occupe.\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");

        if (fs.existsSync(SESSIONS_FILE)) {  
            const raw = fs.readFileSync(SESSIONS_FILE, 'utf8') || '{}';  
            const data = JSON.parse(raw);  
            const sessionsList = Array.isArray(data.sessions) ? data.sessions : [];  
            const updated = sessionsList.filter(n => n !== number);  
            fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: updated }, null, 2));  
        }  

        const sessionPath = `./sessions/${number}`;  
        if (fs.existsSync(sessionPath)) fs.rmSync(sessionPath, { recursive: true, force: true });  

        sessions.delete(number);  

        const cfg = getConfig();  
        if (cfg.users?.root?.primary === number) {  
            cfg.users.root.primary = '';  
            configManager.save();  
        }  

        console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ✅ [" + BOT_NAME + "] Session " + number + " supprimée\n│ avec élégance.\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");

    } catch (err) {
        console.error("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 💥 [" + BOT_NAME + "] Erreur suppression session " + number + ":\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯", err?.message || err);
    }
}

/* -------------------------
startSession

targetNumber: digits-only string

handler: function(upsert, sock) -> handles messages

initConfig: if true, create default user config
------------------------- */
async function startSession(targetNumber, handler, initConfig = false) {
    try {
        console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🚀 [" + BOT_NAME + "] Démarrage session pour " + targetNumber + "\n│ préparation.\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");

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

        // persist credentials when they change  
        sock.ev.on('creds.update', saveCreds);  

        // robust connection updates handling  
        sock.ev.on('connection.update', async (update) => {  
            try {  
                const { connection, lastDisconnect } = update;  

                if (connection === 'close') {  
                    console.warn("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ⚠️ [" + BOT_NAME + "] Session " + targetNumber + " fermée.\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");  
                    const statusCode = lastDisconnect?.error?.output?.statusCode;  
                    const shouldReconnect = statusCode !== DisconnectReason.loggedOut;  

                    if (shouldReconnect) {  
                        console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🔄 [" + BOT_NAME + "] Tentative de reconnexion\n│ pour " + targetNumber + "...\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");  
                        // schedule immediate reconnect without blocking  
                        setImmediate(() => startSession(targetNumber, handler, false));  
                    } else {  
                        console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🚫 [" + BOT_NAME + "] Déconnexion définitive détectée\n│ pour " + targetNumber + ". Suppression en cours.\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");  
                        removeSession(targetNumber);  
                    }  
                } else if (connection === 'open') {  
                    console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ✅ [" + BOT_NAME + "] Session ouverte : " + targetNumber + "\n│ Connecté avec distinction.\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");  
                }  
            } catch (err) {  
                console.error("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 💥 [" + BOT_NAME + "] Erreur connection.update (" + targetNumber + "):\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯", err?.message || err);  
            }  
        });  

        // If not registered yet, attempt to request pairing code once (no automatic timeout)  
        try {  
            if (!state.creds.registered && typeof sock.requestPairingCode === 'function') {  
                const code = await sock.requestPairingCode(targetNumber, 'KURONAMD');  
                console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🔑 [" + BOT_NAME + "] Code d'appariement pour " + targetNumber + ": " + code + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");  
                console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 📱 [" + BOT_NAME + "] Entrez ce code dans votre\n│ WhatsApp pour finaliser la connexion.\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");  
                // Note: we do NOT auto-remove the session on timeout — operator controls pairing lifecycle.  
            }  
        } catch (err) {  
            // non-fatal: log and continue  
            console.warn("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ⚠️ [" + BOT_NAME + "] Impossible de générer le code\n│ pour " + targetNumber + ":\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯", err?.message || err);  
        }  

        // messages -> delegate to provided handler (safe)  
        sock.ev.on('messages.upsert', async (upsert) => {  
            try {  
                await handler(upsert, sock);  
            } catch (err) {  
                console.error("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 💥 [" + BOT_NAME + "] Erreur dans handler messages (" + targetNumber + "):\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯", err?.message || err);  
            }  
        });  

        // group participant updates -> welcome (safe)  
        sock.ev.on('group-participants.update', async (update) => {  
            try {  
                await group.welcome(update, sock);  
            } catch (err) {  
                console.error("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 💥 [" + BOT_NAME + "] Erreur welcome (" + targetNumber + "):\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯", err?.message || err);  
            }  
        });  

        // register session  
        sessions.set(targetNumber, sock);  
        saveSessionNumber(targetNumber);  

        // create default user config if requested  
        const cfg = getConfig();  
        if (initConfig) {  
            cfg.users[targetNumber] = {  
                antilink: false,  
                autoreact: false,  
                like: false,  
                online: false,  
                prefix: '.',  
                record: false,  
                response: true,  
                sudoList: [],  
                tagAudioPath: 'tag.mp3',  
                type: false,  
                welcome: false  
            };  
            configManager.save();  
        }  

        // set root primary session  
        cfg.users.root.primary = targetNumber;  
        configManager.save();  

        console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ✨ [" + BOT_NAME + "] Session " + targetNumber + " prête.\n│ Signé : " + BOT_SIGNATURE + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");  

        return sock;

    } catch (err) {
        console.error("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 💥 [" + BOT_NAME + "] Échec création session " + targetNumber + ":\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯", err?.message || err);
        throw err;
    }
}

export default startSession;
