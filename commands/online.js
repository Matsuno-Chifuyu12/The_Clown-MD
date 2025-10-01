// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Commande : Gestion de la présence en ligne
// Creator : 🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Met à jour la présence du bot (online/available)
 * @param {Object} message - Message reçu
 * @param {Object} client - Instance du client WhatsApp
 * @param {Boolean} state - true = activer présence en ligne
 */
export async function presence(message, client, state) {
    if (!state) return; // Si l'état n'est pas défini, on ne fait rien

    const remoteJid = message.key?.remoteJid;

    try {
        // Mise à jour de la présence en ligne
        await client.sendPresenceUpdate('available', remoteJid);

        console.log(`✅ [🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴] Présence en ligne activée pour ${remoteJid}`);
    } catch (error) {
        console.error(`❌ [🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴] Erreur mise à jour présence : ${error.message}`);
    }
}

export default presence;
