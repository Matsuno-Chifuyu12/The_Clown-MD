// isValidCode.js
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴
// Vérification et validation sécurisée des codes premium
// Développé par kurona 🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴

import { OWNER_ID } from "../config.js";

/**
 * Vérifie si un code premium est valide
 * @param {string} code - Code encodé en base64 au format "id|expiry"
 * @returns {boolean} - true si valide, sinon false
 */
export default function isValidCode(code) {
    try {
        const decoded = Buffer.from(code, "base64").toString();
        const [id, expiry] = decoded.split("|");

        if (OWNER_ID !== id) {
            console.log(`❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] ID invalide détecté: ${id}`);
            return false;
        }

        if (Date.now() > Number(expiry)) {
            console.log(`⚠️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Code expiré pour l’ID: ${id}`);
            return false;
        }

        console.log(`✅ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Code valide pour l’ID: ${id}`);
        return true;

    } catch (error) {
        console.error(`❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Erreur lors du décodage du code:`, error.message);
        return false;
    }
}
