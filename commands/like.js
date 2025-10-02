// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Commande : Réaction automatique aux statuts
// 🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Réagit automatiquement aux statuts WhatsApp avec un 💚
 * @param {Object} message - Message reçu
 * @param {Object} client - Instance du client WhatsApp
 * @param {Boolean} state - true = activer réaction automatique
 */
async function like(message, client, state) {
    if (!state) return; // Si l'option est désactivée, ne rien faire

    try {
        const remoteJid = message?.key?.remoteJid;
        const participant = message?.key?.participant;

        // Vérifications de sécurité
        if (message.key.fromMe) return;                  // Ignorer les messages du bot
        if (remoteJid !== "status@broadcast") return;    // Vérifier que c'est un statut
        if (!participant) return;                        // Vérifier la présence du participant

        // Envoyer la réaction automatique 💚
        await client.sendMessage(participant, {
            react: {
                text: '💚',
                key: message.key
            }
        });

        console.log(`✅ [🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴] Réaction 💚 envoyée au statut de ${participant}`);
    } catch (error) {
        console.error(`❌ [🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴] Impossible de réagir au statut:`, error.message);
    }
}

export default like;
