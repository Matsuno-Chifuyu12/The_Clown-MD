/**
 * 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴 | Normaliseur de contenu de message
 * Kurona 🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
 */

export const normalizeMessageContent = (message) => {
    if (!message) {
        console.warn("⚠️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Message vide reçu pour normalisation.");
        return null;
    }

    // Détection et extraction du contenu d'un message 'view once'
    const content = message?.viewOnceMessageV2?.message || message;

    console.log("✅ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Message normalisé avec succès.");
    return content;
};

export default normalizeMessageContent;
