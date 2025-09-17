// sender.js
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴
// Utilitaire d’envoi de messages
// Développé par kurona 🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴

/**
 * Envoi de message optimisé avec gestion des erreurs
 * @param {object} bot - Instance du bot Telegram
 * @param {object} msg - Message utilisateur
 * @param {string} text - Contenu du message
 */
export async function sender(bot, msg, text) {
    try {
        if (!bot || !msg?.chat?.id || !text) {
            console.error("❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴] Paramètres invalides pour l’envoi du message.");
            return;
        }

        await bot.sendMessage(msg.chat.id, String(text), { parse_mode: "Markdown" });
        console.log(`✅ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴] Message envoyé avec succès à l’ID ${msg.chat.id}`);
    } catch (error) {
        console.error("⚠️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴] Échec lors de l’envoi du message :", error.message);
    }
}

export default sender;
