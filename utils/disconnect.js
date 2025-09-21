// disconnect.js
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴
// Gestion de la déconnexion des sessions WhatsApp
// Kurona 🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴

import configManager from '../utils/manageConfigs.js';
import fs from "fs";
import sender from '../utils/sender.js';

const SESSIONS_FILE = "./sessions.json";
const sessions = {};

function removeSession(number, bot, msg) {
    const chatId = msg.chat.id;

    try {
        // Mise à jour du fichier de sessions
        if (fs.existsSync(SESSIONS_FILE)) {
            const data = JSON.parse(fs.readFileSync(SESSIONS_FILE, "utf8"));
            const sessionsList = Array.isArray(data.sessions) ? data.sessions : [];
            const updated = sessionsList.filter(num => num !== number);

            fs.writeFileSync(
                SESSIONS_FILE,
                JSON.stringify({ sessions: updated }, null, 2)
            );
        }

        // Suppression du dossier de session
        const sessionPath = `./sessions/${number}`;
        if (fs.existsSync(sessionPath)) {
            fs.rmSync(sessionPath, { recursive: true, force: true });
        }

        // Nettoyage mémoire
        delete sessions[number];

        console.log(`✅ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Session supprimée: ${number}`);

        return bot.sendMessage(
            chatId,
            `✅ Session *${number}* supprimée avec succès.\n\n🎉 Merci d'avoir utilisé nos services.\n✨ À très bientôt avec 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴`,
            { parse_mode: "Markdown" }
        );

    } catch (err) {
        console.error(`❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Erreur suppression session ${number}:`, err.message);

        return bot.sendMessage(
            chatId,
            `❌ Erreur lors de la suppression de la session *${number}*\n${err.message} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴`,
            { parse_mode: "Markdown" }
        );
    }
}

export async function disconnect(bot, msg, match) {
    const chatId = msg.chat.id;
    const text = match?.[1]?.trim();

    if (!text) {
        return bot.sendMessage(
            chatId,
            "❌ Veuillez fournir un numéro.\nUsage : `/disconnect <numéro>` | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴",
            { parse_mode: "Markdown" }
        );
    }

    const targetNumber = text.replace(/\D/g, "");

    if (!targetNumber || targetNumber.length < 8) {
        return bot.sendMessage(
            chatId,
            "❌ Numéro invalide | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴",
            { parse_mode: "Markdown" }
        );
    }

    console.log(`🔌 [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Déconnexion demandée pour: ${targetNumber}`);

    return removeSession(targetNumber, bot, msg);
}

export default disconnect;
