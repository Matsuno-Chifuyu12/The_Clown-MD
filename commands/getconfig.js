// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Commande : Consultation de la configuration
// Dev: kurona🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import configManager from '../utils/managerConfigs.js';

/**
 * Formate proprement les paramètres pour affichage élégant
 * @param {Object} settings - Configuration de l'utilisateur
 * @returns {String} - Texte formaté
 */
function formatSettings(settings) {
    return Object.entries(settings)
        .map(([key, value]) => {
            // Formatage des valeurs
            if (typeof value === 'boolean') value = value ? "✅ Activé" : "❌ Désactivé";
            if (Array.isArray(value)) value = value.length ? value.join(", ") : "Aucun";
            if (value === "" || value === null || value === undefined) value = "Aucun";

            const translatedKey = keyTranslations[key] || `⚙️ ${key}`;
            return `• ${translatedKey}: ${value}`;
        })
        .join('\n');
}

/**
 * Affiche les configurations de l'utilisateur
 * @param {Object} message - Message reçu
 * @param {Object} client - Instance du client WhatsApp
 * @param {String} num - Numéro de l'utilisateur
 */
export async function getconf(message, client, num) {
    const remoteJid = message.key.remoteJid;

    try {
        const conf = configManager.config?.users[num];

        if (!conf) {
            return await client.sendMessage(remoteJid, {
                text: `🎴 kurona🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴\n\n📭 Aucune configuration trouvée.\n"Je m'excuse, mais aucune configuration n'est associée à cet utilisateur."`
            });
        }

        const formatted = formatSettings(conf);

        const msg = `
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│🎩 kurona vous informe 🎩
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
${formatted}

"Voici la configuration actuelle, Monsieur/Madame. Tout semble en ordre."
`;

        await client.sendMessage(remoteJid, { text: msg });

        console.log(`✅ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Configuration consultée pour l'utilisateur ${num}`);
    } catch (error) {
        console.error(`🔥 [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴 | ERREUR] ➝ ${error.message}`);
        await client.sendMessage(remoteJid, {
            text: `❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Erreur lors de la consultation de la configuration.`
        });
    }
}

export default getconf;
