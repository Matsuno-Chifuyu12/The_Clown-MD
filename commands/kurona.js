// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Commande : kurona.js (Assistant IA)
// Creator : 🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import axios from "axios";

// Cache local pour accélérer les réponses répétées
const responseCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Commande kurona → IA 
 */
export async function kurona(message, client) {
    const remoteJid = message.key?.remoteJid;
    const body =
        message.message?.extendedTextMessage?.text ||
        message.message?.conversation ||
        "";

    try {
        // Extraction de la requête après .kurona
        const args = body.trim().split(/\s+/);
        const query = args.slice(1).join(" ").trim();

        if (!query) {
            await client.sendMessage(remoteJid, {
                text: `🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴\n\n❌ Requête incomplète.\n"Veuillez poser une question après la commande."\n\nExemple : .kurona Quelle est la capitale du Cameroun ?`,
                quoted: message
            });
            return;
        }

        const cacheKey = query.toLowerCase();
        const cached = responseCache.get(cacheKey);

        // Vérification du cache
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            await sendAIResponse(client, remoteJid, query, cached.response, message, true);
            return;
        }

        // Message d’attente stylisé
        await client.sendMessage(remoteJid, {
            text: `🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴\n\n> ⏳ Traitement en cours...\n"Je consulte mes archives numériques."`,
            quoted: message
        });

        // Requête API
        const apiUrl = `https://apis.davidcyriltech.my.id/ai/chatbot?query=${encodeURIComponent(query)}`;
        const { data } = await axios.get(apiUrl, {
            timeout: 15000,
            headers: {
                "User-Agent": "🎴𝛫𝑈𝑅𝛩𝛮𝛥—𝛭𝑫🎴/1.0.0"
            }
        });

        if (!data?.success || !data?.result) {
            throw new Error("Réponse API invalide ou vide.");
        }

        // Mise en cache
        responseCache.set(cacheKey, {
            response: data.result,
            timestamp: Date.now()
        });

        if (responseCache.size > 100) cleanupCache();

        await sendAIResponse(client, remoteJid, query, data.result, message);

    } catch (err) {
        console.error("❌ [kurona ERROR] :", err.message);

        await client.sendMessage(remoteJid, {
            text: `🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴\n\n💥 Une erreur est survenue.\n"Je n'ai pas pu consulter mes archives."\n\n> Détails : ${err.message}`,
            quoted: message
        });
    }
}

/**
 * Envoi formaté de la réponse IA
 */
async function sendAIResponse(client, remoteJid, query, response, originalMessage, fromCache = false) {
    const indicator = fromCache ? "♻️ Réponse issue du cache" : "🆕 Réponse générée";

    await client.sendMessage(remoteJid, {
        text: 
`╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
|      🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴    
|    𝐓𝐡𝐞 𝐔𝐥𝐭𝐢𝐦𝐚𝐭𝐞 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐄𝐱𝐩𝐞𝐫𝐢𝐞𝐧𝐜𝐞                   
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
❓ Question : *${query}*

🤖 Réponse : ${response}

|${indicator}
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│  🎴 ℬ𝓎  𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`,
        quoted: originalMessage
    });

    console.log(`🧠 [kurona LOG] Réponse ${fromCache ? "cache" : "API"} envoyée pour "${query}"`);
}

/**
 * Nettoyage automatique du cache
 */
function cleanupCache() {
    const now = Date.now();
    for (const [key, entry] of responseCache.entries()) {
        if (now - entry.timestamp > CACHE_TTL) {
            responseCache.delete(key);
        }
    }
    console.log("🧹 [kurona CLEANUP] Cache purgé.");
}

export default kurona;
