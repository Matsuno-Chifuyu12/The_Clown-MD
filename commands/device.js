// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Commande : Device Identification
// Dev : kurona🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import pkg from "bailey";
const { getDevice } = pkg;

/**
 * Identification de l'appareil utilisé par l'expéditeur
 * @param {Object} message - Message WhatsApp reçu
 * @param {Object} client - Instance du client Baileys
 */
async function device(message, client) {
    const remoteJid = message.key?.remoteJid;

    try {
        // Vérification si le message cité existe
        const quotedInfo = message.message?.extendedTextMessage?.contextInfo;

        if (!quotedInfo?.stanzaId) {
            await client.sendMessage(remoteJid, {
                text: `╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴\n│ \n│ ❌ Aucun message ciblé.\n│ "Veuillez répondre à un message afin\n│ que je puisse identifier le système utilisé."\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`
            }, { quoted: message });
            return;
        }

        // Récupération ID du message cité
        const quotedMessageId = quotedInfo.stanzaId;

        // Identification du device
        const deviceType = getDevice(quotedMessageId) || "Inconnu";

        await client.sendMessage(remoteJid, {
            text: `╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴\n│ \n│ 🛰 **Analyse complète effectuée**\n│ \n│ "L'expéditeur utilise actuellement\n│ un système : *${deviceType}*.\n│ \n│ ✅ Vérification terminée avec succès."\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`
        }, { quoted: message });

        console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🔍 [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Système détecté → " + deviceType + " | Message ID: " + quotedMessageId + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");

    } catch (error) {
        console.error("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Erreur device.js:\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯", error.message);

        await client.sendMessage(remoteJid, {
            text: `╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴\n│ \n│ ❌ Erreur critique\n│ "L'identification du système a échoué.\n│ \n│ > ${error.message}"\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`
        }, { quoted: message });
    }
}

export default device;
