// redirect.js
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴
// Gestion des redirections
// Développé par kurona 🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴

import { REDIRECT_BOT } from '../config.js';

/**
 * Redirection des utilisateurs en cas de bot saturé
 * @param {object} bot - Instance du bot Telegram
 * @param {object} msg - Message utilisateur
 */
export async function redirect(bot, msg) {
    try {
        if (!bot || !msg?.chat?.id) {
            console.error("❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴] Paramètres invalides pour la redirection.");
            return;
        }

        if (!REDIRECT_BOT || REDIRECT_BOT === 'None') {
            await bot.sendMessage(
                msg.chat.id,
                `⚠️ *Service saturé* ⚠️\n\nTous nos bots 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 sont actuellement occupés.\nMerci de réessayer plus tard ou rejoins notre groupe officiel pour obtenir l'accès premium (2$ / 1000 Fcfa).\n\n— signé kurona 🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴`,
                { parse_mode: "Markdown" }
            );
            console.log("⚠️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴] Aucun bot de redirection disponible.");
        } else {
            await bot.sendMessage(
                msg.chat.id,
                `🚀 Ce bot est actuellement *complet*.\nRedirection vers un autre bot disponible :\n👉 ${REDIRECT_BOT}\n\n— signé kurona 🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴`,
                { parse_mode: "Markdown" }
            );
            console.log(`✅ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴] Redirection effectuée vers ${REDIRECT_BOT}`);
        }
    } catch (error) {
        console.error("❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴] Erreur lors de la redirection :", error.message);
    }
}

export default redirect;
