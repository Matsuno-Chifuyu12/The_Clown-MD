// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Commande : Suppression de messages
// Creator : 🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import sender from "../commands/sender.js";

/**
 * Supprime un message (global ou local selon permissions)
 * @param {Object} message - Message WhatsApp reçu
 * @param {Object} client - Instance du client
 */
async function dlt(message, client) {
    try {
        const quotedMessageInfo = message.message?.extendedTextMessage?.contextInfo;
        const remoteJid = message.key?.remoteJid;

        // Vérification si un message est bien ciblé
        if (!quotedMessageInfo?.quotedMessage) {
            await sender(message, client,
                `🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴\n\n❌ Aucun message ciblé\n"Veuillez répondre à un message afin que je puisse procéder à sa suppression."`
            );
            return;
        }

        const quotedMessageKey = quotedMessageInfo.stanzaId;
        const quotedSender = quotedMessageInfo.participant;
        const isFromBot = quotedSender === client.user.id;

        if (!quotedMessageKey || !remoteJid) {
            await sender(message, client,
                `🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴\n\n❌ Message introuvable\n"Je n'ai pas pu localiser le message à supprimer."`
            );
            return;
        }

        console.log(`🗑 Tentative de suppression du message ID: ${quotedMessageKey} | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴`);

        // 1️⃣ Suppression globale (pour tout le monde)
        try {
            await client.sendMessage(remoteJid, {
                delete: {
                    id: quotedMessageKey,
                    remoteJid,
                    fromMe: isFromBot
                }
            });
            console.log(`✅ Message supprimé pour tout le monde | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴`);
            return;
        } catch (error) {
            console.warn(`⚠️ Suppression globale échouée, tentative locale... | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴`);
        }

        // 2️⃣ Suppression locale uniquement (côté bot)
        try {
            await client.chatModify(
                { clear: { messages: [{ id: quotedMessageKey, fromMe: isFromBot }] } },
                remoteJid
            );
            console.log(`✅ Message supprimé localement | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴`);
        } catch (error) {
            console.error(`❌ Échec suppression locale:`, error.message);
            await sender(message, client,
                `🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴\n\n❌ Suppression impossible\n"Je regrette, mais la suppression du message a échoué."`
            );
        }

    } catch (error) {
        console.error(`💥 Erreur critique dans dlt.js:`, error.message);
        await sender(message, client,
            `🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴\n\n💥 Erreur critique\n"Une erreur inattendue s'est produite lors de la tentative de suppression."`
        );
    }
}

export default dlt;
