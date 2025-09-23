// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Commande : Récupération photo de profil
// Creator : 🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Récupère la photo de profil d'un utilisateur
 * @param {Object} message - Objet du message WhatsApp
 * @param {Object} client - Instance du client WhatsApp
 */
export async function getpp(message, client) {
    const remoteJid = message.key.remoteJid;
    const quoted = message.message?.extendedTextMessage?.contextInfo;
    let targetJid;

    try {
        // --------- 1) Mention prioritaire ---------
        const mentions = quoted?.mentionedJid;
        if (mentions && mentions.length) {
            targetJid = mentions[0];
        }
        // --------- 2) Réponse à un message ---------
        else if (quoted?.participant) {
            targetJid = quoted.participant;
        }
        // --------- 3) Numéro passé en argument ---------
        else {
            const args = (message.message?.conversation || message.message?.extendedTextMessage?.text || "")
                .trim()
                .split(/\s+/);

            if (args[1]) {
                const num = args[1].replace(/[^0-9]/g, "");
                if (num.length < 7) {
                    await client.sendMessage(remoteJid, {
                        text: `🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴\n\n⚠️ Format numérique invalide.\nVeuillez fournir un numéro valide.`
                    });
                    return;
                }
                targetJid = `${num}@s.whatsapp.net`;
            }
        }

        // --------- 4) Fallback sur l'expéditeur ---------
        if (!targetJid) {
            targetJid = message.key.fromMe
                ? client.user.id
                : message.key.participant || remoteJid;
        }

        // Récupération de la photo de profil
        const url = await client.profilePictureUrl(targetJid, "image");
        const username = targetJid.split("@")[0];

        await client.sendMessage(remoteJid, {
            image: { url },
            caption: `🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴\n\n📸 Portrait de *@${username}*\nVoici le portrait demandé, j'espère qu'il conviendra à vos attentes.`
        }, { quoted: message });

        console.log(`✅ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Photo de profil envoyée ➝ ${username}`);

    } catch (error) {
        console.error(`🔥 [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴 | ERREUR] ➝ ${error.message}`);
        const username = targetJid ? targetJid.split("@")[0] : "l'utilisateur";
        await client.sendMessage(remoteJid, {
            text: `❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Impossible de récupérer la photo de profil de *@${username}* actuellement.`
        }, { quoted: message });
    }
}

export default getpp;
