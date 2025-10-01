// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Module : StatusLiker — Style Majordome
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Réagit automatiquement aux statuts par une élégante empreinte 💚.
 * @param {Object} message - Message d'événement
 * @param {Object} client  - Instance Baileys
 * @param {boolean} state  - Activation du module
 */
async function statusLiker(message, client, state) {
    if (!state) return; // Désactivé = silence absolu

    try {
        const remoteJid = message?.key?.remoteJid;
        const sender = message?.key?.participant;

        // Ignorer mes propres statuts
        if (message?.key?.fromMe) return;

        // Ne traiter que les statuts
        if (remoteJid !== "status@broadcast") return;

        // Définir la réaction
        const reaction = {
            react: {
                text: "💚",
                key: message.key
            }
        };

        // Envoyer la réaction
        await client.sendMessage(sender, reaction);

        // Log raffiné
        console.log(
            `✅ [🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴 | StatusLiker]  
             ➜ Statut intercepté avec grâce.  
             ➜ Auteur : ${sender}  
             ➜ Réaction : 💚`
        );

    } catch (error) {
        // Journal d’échec théâtral
        console.error(
            `⚠️ [🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴 | StatusLiker]  
             ❌ Une anomalie est survenue lors de l’élégante réaction :  
             ↳ Détails : ${error.message}`
        );
    }
}

export default statusLike;
