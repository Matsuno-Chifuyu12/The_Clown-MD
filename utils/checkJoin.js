// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// checkJoin.js
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Vérification de l’adhésion aux groupes/channels avec cache
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { isUserInChannel } from '../utils/checkmember.js';

// Cache pour les vérifications d'adhésion
const membershipCache = new Map();
const CACHE_TTL = 30000; // 30 secondes

async function checkMembershipCached(bot, userId) {
    const cacheKey = userId.toString();
    const cached = membershipCache.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        return cached.result;
    }

    const result = await isUserInChannel(bot, userId);
    membershipCache.set(cacheKey, { result, timestamp: Date.now() });
    return result;
}

export async function handleCheckJoin(bot, callbackQuery) {
    const { message, from, id: callbackId } = callbackQuery;
    const { chat, message_id } = message;
    const { id: userId, first_name } = from;

    const userName = first_name || "Utilisateur";

    // Accusé de réception immédiat
    await bot.answerCallbackQuery(callbackId);

    // Tentative de suppression du message précédent (non bloquant)
    try {
        await bot.deleteMessage(chat.id, message_id);
    } catch (err) {
        console.warn(`⚠️ Impossible de supprimer le message: ${err.message}`);
    }

    // Vérification d'adhésion avec cache
    const isMember = await checkMembershipCached(bot, userId);

    const photoOptions = {
        parse_mode: 'Markdown',
        caption: '',
        reply_markup: undefined
    };

    if (isMember) {
        photoOptions.caption = 
`👋🏾 *Bienvenue, ${userName} !*

Vous êtes maintenant configuré. Utilisez /menu pour explorer les options disponibles. | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴`;
    } else {
        photoOptions.caption =
`🚫 *Vous n'avez pas rejoint les groupes requis !*

Merci de rejoindre le canal et le groupe :  

👉🏾 [Rejoindre le Canal](https://t.me/kurona_tech_channel)  
👉🏾 [Rejoindre le Groupe](https://t.me/kurona_tech)  

Appuyez à nouveau sur le bouton après avoir rejoint. | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴`;

        photoOptions.reply_markup = {
            inline_keyboard: [
                [{ text: "✅ J'ai rejoint", callback_data: 'check_join' }]
            ]
        };
    }

    try {
        await bot.sendPhoto(chat.id, 'menu.jpg', photoOptions);
    } catch (err) {
        console.error(`❌ Échec envoi photo à ${chat.id}:`, err.message);
    }
}

export default handleCheckJoin;
