// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// checkmember.js
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// Vérifie si un utilisateur est membre du channel et du groupe Kurona
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Cache pour les vérifications d'adhésion
const membershipCache = new Map();
const CACHE_TTL = 30000; // 30 secondes
const VALID_STATUSES = new Set(['member', 'administrator', 'creator']);

// Noms des channels et groupes à vérifier
const CHANNEL_USERNAME = '@kurona_tech_channel';
const GROUP_USERNAME = '@kurona_tech';

export async function isUserInChannel(bot, userId) {
    const cacheKey = `${userId}`;
    const cached = membershipCache.get(cacheKey);

    // Retourner le résultat en cache si valide
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        return cached.result;
    }

    try {
        // Vérifications parallèles pour rapidité
        const [channelMember, groupMember] = await Promise.all([
            bot.getChatMember(CHANNEL_USERNAME, userId),
            bot.getChatMember(GROUP_USERNAME, userId)
        ]);

        const inChannel = VALID_STATUSES.has(channelMember.status);
        const inGroup = VALID_STATUSES.has(groupMember.status);
        const result = inChannel && inGroup;

        // Mise en cache du résultat
        membershipCache.set(cacheKey, { result, timestamp: Date.now() });

        console.log(`✅ User ${userId} membership check: Channel=${inChannel}, Group=${inGroup}`);

        return result;

    } catch (error) {
        console.error(`❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴] Erreur vérification adhésion de ${userId}:`, error.message);
        return false;
    }
}

export default isUserInChannel;
