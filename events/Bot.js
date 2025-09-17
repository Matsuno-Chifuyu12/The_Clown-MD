// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// Telegram Bot Starter (Optimized)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import { TELEGRAM_BOT_TOKEN } from '../config.js';
import { messageHandler } from '../events/handler.js';
import reconnect from '../events/reconnection.js';

export let bot = null;

export async function startBot() {
    try {
        // 🔎 Récupération du dernier update pour démarrage propre
        let lastUpdateId = 0;
        try {
            const { data } = await axios.get(
                `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`,
                { timeout: 5000 }
            );
            if (data.ok && data.result.length > 0) {
                lastUpdateId = data.result[data.result.length - 1].update_id + 1;
            }
        } catch {
            console.warn('⚠️ Impossible de récupérer les updates, démarrage à partir de zéro');
        }

        // 🤖 Initialisation du bot
        bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {
            polling: {
                autoStart: false, // on démarre manuellement
                interval: 300,    // toutes les 300ms
                params: { offset: lastUpdateId }
            },
            request: {
                timeout: 10000,
                agentOptions: { keepAlive: true, maxSockets: 25 }
            }
        });

        // 🚀 Lancer le polling
        bot.startPolling();

        // 🔄 Gestion reconnexion & events
        reconnect();
        messageHandler(bot);

        console.log('🚀 🤖 Telegram bot opérationnel | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴');

        // 🛑 Nettoyage à la fermeture
        process.on('SIGINT', () => {
            bot.stopPolling();
            console.log('🛑 Bot arrêté proprement');
            process.exit(0);
        });

    } catch (error) {
        console.error('💥 Échec démarrage bot Telegram:', error.message);

        // 🔄 Tentative de redémarrage automatique
        setTimeout(() => {
            console.log('🔄 Redémarrage automatique...');
            startBot();
        }, 5000);
    }
}
