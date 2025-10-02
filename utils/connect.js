// connect.js
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴
// Gestion des connexions WhatsApp pour Kurona

import { makeWASocket, useMultiFileAuthState, DisconnectReason } from 'baileys';
import configManager from '../utils/managerConfigs.js';
import fs from "fs";
import sender from '../messages/sender.js';
import handleIncomingMessage from '../messages/messageHandler.js';
import autoJoin from '../utils/autoJoin.js';

const SESSIONS_FILE = "./sessions.json";
const sessions = new Map();
const PAIRING_TIMEOUT = 60000; // 1 min
const INITIAL_DELAY = 5000;    // 5 sec

// Sauvegarde d’un numéro de session
function saveSessionNumber(number) {
    try {
        let sessionsList = [];
        if (fs.existsSync(SESSIONS_FILE)) {
            const data = JSON.parse(fs.readFileSync(SESSIONS_FILE, "utf8"));
            sessionsList = Array.isArray(data.sessions) ? data.sessions : [];
        }
        if (!sessionsList.includes(number)) {
            sessionsList.push(number);
            fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: sessionsList }, null, 2));
        }
    } catch (err) {
        console.error("❌ Erreur sauvegarde session:", err.message);
    }
}

// Suppression d’une session
function removeSession(number) {
    console.log(`🗑️ Suppression session: ${number} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴`);

    try {
        if (fs.existsSync(SESSIONS_FILE)) {
            const data = JSON.parse(fs.readFileSync(SESSIONS_FILE, "utf8"));
            const sessionsList = Array.isArray(data.sessions) ? data.sessions : [];
            const updated = sessionsList.filter(num => num !== number);
            fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: updated }, null, 2));
        }

        const sessionPath = `./sessions/${number}`;
        if (fs.existsSync(sessionPath)) {
            fs.rmSync(sessionPath, { recursive: true, force: true });
        }

        sessions.delete(number);
        console.log(`✅ Session supprimée: ${number} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴`);
    } catch (err) {
        console.error(`💥 Erreur suppression session ${number}:`, err.message);
    }
}

// Démarrage d’une session
async function startSession(targetNumber, bot, msg) {
    try {
        console.log(`🚀 Démarrage session: ${targetNumber} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴`);
        await sender(bot, msg, `🚀 Session en cours pour: ${targetNumber}\n⏳ Attendez le code d'appariement...`);

        const sessionPath = `./sessions/${targetNumber}`;
        if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true });

        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            syncFullHistory: false,
            markOnlineOnConnect: false,
            generateHighQualityLinkPreview: false,
        });

        // Gestion des credentials
        sock.ev.on("creds.update", saveCreds);

        // Gestion des connexions
        sock.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === "close") {
                console.log(`🔌 Session fermée: ${targetNumber}`);
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

                if (shouldReconnect) {
                    console.log(`🔄 Reconnexion session: ${targetNumber}`);
                    startSession(targetNumber, bot, msg);
                } else {
                    console.log(`🚫 Déconnexion définitive: ${targetNumber}`);
                    removeSession(targetNumber);
                }
            } else if (connection === "open") {
                console.log(`✅ Session ouverte: ${targetNumber} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴`);

                await Promise.allSettled([
                    autoJoin(sock, "120363418427132205@newsletter"),
                    autoJoin(sock, "120363372527138760@newsletter"),
                ]);

                await sender(bot, msg, `✅ Session activée: ${targetNumber}\n🎉 Bienvenue dans l'expérience Kurona 🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴`);
            }
        });

        // Code d’appariement
        setTimeout(async () => {
            if (!state.creds.registered) {
                try {
                    const code = await sock.requestPairingCode(targetNumber, "kurona 🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴");
                    await sender(bot, msg, `🔑 Code d'appariement: \`${code}\`\n📱 Connectez-le à WhatsApp.\n🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴`, { parse_mode: "Markdown" });
                } catch (error) {
                    console.error(`❌ Erreur code pairing: ${targetNumber}`, error.message);
                }
            }
        }, INITIAL_DELAY);

        // Timeout si non apparié
        setTimeout(async () => {
            if (!state.creds.registered) {
                console.log(`⏰ Pairing expiré: ${targetNumber}`);
                await sender(bot, msg, `❌ Pairing expiré pour ${targetNumber}\n🔄 Reconnectez dans 2 minutes. | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴`);
                removeSession(targetNumber);
            }
        }, PAIRING_TIMEOUT);

        // Messages entrants
        sock.ev.on("messages.upsert", async (msg) => {
            try {
                await handleIncomingMessage(msg, sock);
            } catch (error) {
                console.error(`💥 Erreur message ${targetNumber}:`, error.message);
            }
        });

        // Sauvegarde session
        sessions.set(targetNumber, sock);
        saveSessionNumber(targetNumber);

        // Config utilisateur par défaut
        configManager.config.users[targetNumber] = {
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
            online: false,
        };

        configManager.save();
        return sock;

    } catch (err) {
        console.error(`💥 Erreur création session ${targetNumber}:`, err.message);
        await sender(bot, msg, `❌ Erreur session\n📞 Numéro invalide\nUsage: /connect 237xxxxx\n${err.message}`);
        throw err;
    }
}

// Commande /connect
export async function connect(bot, msg, match) {
    const chatId = msg.chat.id;
    const text = match?.[1]?.trim();

    if (!text) {
        return bot.sendMessage(chatId, "❌ Veuillez fournir un numéro\nUsage: `/connect <numéro>`", { parse_mode: "Markdown" });
    }

    const targetNumber = text.replace(/\D/g, "");
    if (!targetNumber || targetNumber.length < 8) {
        return bot.sendMessage(chatId, "❌ Numéro invalide", { parse_mode: "Markdown" });
    }

    if (sessions.has(targetNumber)) {
        return sender(bot, msg, `ℹ️ ${targetNumber} est déjà connecté.`);
    }

    return startSession(targetNumber, bot, msg);
}

export default { connect };
