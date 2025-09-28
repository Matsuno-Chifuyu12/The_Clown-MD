// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Telegram Bot 
// Style : Majordome Sébastien Michaelis
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import { TELEGRAM_BOT_TOKEN } from '../config.js';
import { messageHandler } from '../events/handler.js';
import reconnect from '../events/reconnection.js';

export let bot = null;

export async function startBot() {
    try {
        let lastUpdateId = 0;

        // ⚜ Pré-initialisation : récupération du dernier update (sécurité)
        try {
            const { data } = await axios.get(
                `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`
            );
            if (data.ok && data.result.length > 0) {
                lastUpdateId = data.result[data.result.length - 1].update_id + 1;
            }
        } catch {
            console.warn("⚠️ Impossible d'obtenir les updates. Initialisation à zéro.");
        }

        // ⚜ Initialisation bot hyper-performante
        bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {
            polling: {
                autoStart: true,            // lancement immédiat
                interval: 100,              // cycle rapide et fluide
                params: { offset: lastUpdateId }
            },
            request: {
                // ❌ suppression des timeouts (connexion persistante)
                timeout: 0,
                agentOptions: { keepAlive: true, maxSockets: Infinity }
            }
        });

        // ⚜ Gestion reconnexion et handler principal
        reconnect(bot);
        messageHandler(bot);

        console.log("🎩 Le bot 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴 est désormais opérationnel, maître.");

        // ⚜ Arrêt propre si interruption système
        process.on('SIGINT', () => {
            console.log("🛑 [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Je cesse toute activité, avec élégance.");
            bot.stopPolling();
            process.exit(0);
        });

    } catch (error) {
        console.error("💥 [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Incident lors du démarrage :", error.message);

        // ⚜ Relance immédiate et illimitée
        console.log("🔄 [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Tentative de redémarrage inlassable...");
        startBot();
    }
}
