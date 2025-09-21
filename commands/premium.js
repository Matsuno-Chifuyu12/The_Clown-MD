// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// premium-manager
// 🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function modifyprem(message, client, list, action) {
    try {
        const remoteJid = message.key?.remoteJid;
        if (!remoteJid) throw new Error("⚠️ JID invalide — impossible d’identifier la source.");

        // Extraction commande + arguments
        const messageBody =
            message.message?.extendedTextMessage?.text ||
            message.message?.conversation ||
            "";
        const commandAndArgs = messageBody.slice(1).trim();
        const args = commandAndArgs.split(/\s+/).slice(1);

        let participant;

        // Cas 1 : reply
        if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
            participant =
                message.message?.extendedTextMessage?.contextInfo?.participant ||
                message.key.participant;
        }
        // Cas 2 : numéro en argument
        else if (args.length > 0) {
            const jidMatch = args[0].match(/\d+/);
            if (!jidMatch) throw new Error("⚠️ Format du participant invalide.");
            participant = `${jidMatch[0]}@s.whatsapp.net`;
        }
        // Cas 3 : aucun participant
        else {
            throw new Error("⚠️ Aucun participant spécifié.");
        }

        // Gestion Premium
        if (action === "add") {
            if (!list.includes(participant)) {
                list.push(participant);
                console.log(`✅ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Ajout Premium ➝ ${participant}`);
            } else {
                console.log(`ℹ️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Déjà Premium ➝ ${participant}`);
            }
        } else if (action === "remove") {
            const index = list.indexOf(participant);
            if (index !== -1) {
                list.splice(index, 1);
                console.log(`❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Retrait Premium ➝ ${participant}`);
            } else {
                console.log(`ℹ️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Non trouvé dans Premium ➝ ${participant}`);
            }
        }
    } catch (error) {
        console.error(`🔥 [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴 | ERREUR] ➝ ${error.message}`);
    }
}

// Ajout Premium
export async function addprem(message, client, list) {
    await modifyprem(message, client, list, "add");
}

// Suppression Premium
export async function delprem(message, client, list) {
    await modifyprem(message, client, list, "remove");
}

export default { addprem, delprem };
