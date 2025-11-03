//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴  
// Gestion des crédits (cache & fetch)  
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  

const api = "https://raw.githubusercontent.com/Matsuno-Chifuyu12/kurona-md/refs/heads/main/credits.json";

let credsCache = null;

/**
 * Récupère les crédits depuis l'API
 * Utilise le cache si déjà récupéré
 * @returns {Promise<Object|null>}
 */
export async function getCreds() {
    if (credsCache) {
        console.log("🎴 [𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫] : Crédit récupéré depuis le cache.");
        return credsCache;
    }

    try {
        const res = await fetch(api);

        if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);

        const data = await res.json();
        credsCache = data;

        console.log("🎴 [𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫] : Crédit récupéré avec succès depuis l'API.");
        return data;

    } catch (err) {
        console.error(`❌ [𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫] Erreur lors de la récupération des crédits : ${err.message}`);
        return null;
    }
}
