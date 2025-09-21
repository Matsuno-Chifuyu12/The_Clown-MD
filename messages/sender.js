// sender.js
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴
// Utilitaire d’envoi de messages
// Développé par kurona 🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴

/**
 * Envoi de message avec gestion des erreurs
 * @param {object} bot - Instance du bot Telegram
 * @param {object} msg - Message utilisateur
 * @param {string} text - Contenu du message
 */
export async function sender(bot, msg, text) {
    try {
        if (!bot || !msg?.chat?.id || !text) {
            console.error("❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Paramètres invalides pour l'envoi du message.");
            return;
        }

        await bot.sendMessage(msg.chat.id, String(text), { parse_mode: "Markdown" });
        console.log(`✅ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Message envoyé avec succès à l'ID ${msg.chat.id}`);
    } catch (error) {
        console.error("⚠️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Échec lors de l'envoi du message :", error.message);
    }
}

/**
 * Fonction pour gérer les messages provenant des chaînes WhatsApp avec @newsletter
 * @param {object} client - Instance du client WhatsApp
 * @param {object} message - Message reçu de la chaîne
 */
export async function handleNewsletterMessage(client, message) {
    try {
        if (!message || !message.key || !message.key.remoteJid) {
            console.error("❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Message de chaîne invalide");
            return;
        }

        const remoteJid = message.key.remoteJid;
        
        // Vérifier si le message provient d'une chaîne (newsletter)
        if (remoteJid.includes('@newsletter')) {
            console.log(`📢 [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Message reçu d'une chaîne WhatsApp: ${remoteJid}`);
            
            // Extraire le contenu du message de la chaîne
            const messageContent = extractNewsletterContent(message);
            
            if (messageContent) {
                // Traiter le contenu de la chaîne
                await processNewsletterContent(client, message, messageContent);
            }
        }
    } catch (error) {
        console.error("⚠️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Erreur lors du traitement du message de chaîne :", error.message);
    }
}

/**
 * Extraire le contenu d'un message de newsletter
 * @param {object} message - Message de la chaîne
 * @returns {string} Contenu extrait
 */
function extractNewsletterContent(message) {
    try {
        if (message.message?.conversation) {
            return message.message.conversation;
        }
        if (message.message?.extendedTextMessage?.text) {
            return message.message.extendedTextMessage.text;
        }
        if (message.message?.imageMessage?.caption) {
            return message.message.imageMessage.caption;
        }
        if (message.message?.videoMessage?.caption) {
            return message.message.videoMessage.caption;
        }
        if (message.message?.documentMessage?.caption) {
            return message.message.documentMessage.caption;
        }
        
        console.log("ℹ️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Type de message de chaîne non supporté");
        return null;
    } catch (error) {
        console.error("❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Erreur lors de l'extraction du contenu :", error.message);
        return null;
    }
}

/**
 * Traiter le contenu d'une newsletter
 * @param {object} client - Instance du client WhatsApp
 * @param {object} message - Message original
 * @param {string} content - Contenu à traiter
 */
async function processNewsletterContent(client, message, content) {
    try {
        const remoteJid = message.key.remoteJid;
        
        // Loguer le contenu de la chaîne
        console.log(`📝 [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Contenu de la chaîne ${remoteJid}: ${content.substring(0, 100)}...`);
        
        // Logique de traitement spécifique
        // Répondre à la chaîne (si autorisé)
        // await client.sendMessage(remoteJid, { 
        //     text: "✅ Message de chaîne reçu et traité par 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴" 
        // });
        
    } catch (error) {
        console.error("❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Erreur lors du traitement de la newsletter :", error.message);
    }
}

/**
 * Fonction utilitaire pour envoyer des messages à des chaînes WhatsApp
 * @param {object} client - Instance du client WhatsApp
 * @param {string} newsletterJid - JID de la chaîne (@newsletter)
 * @param {string} content - Contenu du message
 * @param {object} options - Options supplémentaires
 */
export async function sendToNewsletter(client, newsletterJid, content, options = {}) {
    try {
        if (!client || !newsletterJid || !content) {
            throw new Error("Paramètres invalides pour l'envoi à la chaîne");
        }
        
        if (!newsletterJid.includes('@newsletter')) {
            throw new Error("Le JID doit être une chaîne WhatsApp (@newsletter)");
        }
        
        const messageOptions = {
            ...options,
            caption: options.caption || undefined
        };
        
        await client.sendMessage(newsletterJid, { text: content }, messageOptions);
        console.log(`✅ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Message envoyé à la chaîne: ${newsletterJid}`);
        
    } catch (error) {
        console.error("❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Erreur lors de l'envoi à la chaîne :", error.message);
        throw error;
    }
}

export default sender;
