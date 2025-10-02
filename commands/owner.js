//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴
// The Ultimate WhatsApp Experience
// Commande : owner.js
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ✅ CORRECTION COMPLÈTE :
import config from "../config.json" with { type: "json" };
const OWNER_NUMBER = config.bot.owner.number;
const OWNER_NAME = config.bot.owner.name;

export async function owner(message, client) {
    try {
        const remoteJid = message.key.remoteJid;

        // vCard générée automatiquement
        const vcard = 
`BEGIN:VCARD
VERSION:3.0
FN:${OWNER_NAME}
ORG: kurona Tech;
TEL;type=CELL;type=VOICE;waid=${OWNER_NUMBER}: +${OWNER_NUMBER}
END:VCARD`;

        // Envoi du contact formaté
        await client.sendMessage(remoteJid, {
            contacts: {
                displayName: OWNER_NAME,
                contacts: [{ vcard }]
            }
        });

    } catch (error) {
        console.error("Erreur owner.js:", error);
        await client.sendMessage(message.key.remoteJid, { text: "❌ Erreur lors de l'envoi du contact propriétaire." });
    }
}

export default owner;
