// sessionCount.js
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴
// Compteur de sessions actives
// Développé par kurona 🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴

import fs from 'fs';

/**
 * Compte le nombre de sessions actives
 * @param {string} sessionFile - Chemin du fichier JSON des sessions
 * @returns {number} - Nombre de sessions actives
 */
export default function sessionCount(sessionFile = './sessions.json') {
    try {
        if (!fs.existsSync(sessionFile)) {
            console.log('⚠️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Aucun fichier de sessions trouvé.');
            return 0;
        }

        const data = fs.readFileSync(sessionFile, 'utf-8');
        const sessionObj = JSON.parse(data);

        const activeCount = Array.isArray(sessionObj.sessions) ? sessionObj.sessions.length : 0;

        console.log(`✅ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Sessions actives détectées : ${activeCount}`);
        return activeCount;

    } catch (error) {
        console.error(`❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Erreur lecture fichier sessions :`, error.message);
        return 0;
    }
}
