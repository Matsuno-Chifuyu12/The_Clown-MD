//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴  
// Système Anti-Médias - Version optimisée  
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  

const BOT_NAME = "🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴";  
const AUTHOR = "🎴𝐃𝛯𝐕  ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴";  

class AntiMediaSystem {  
    constructor(client, options = {}) {  
        this.client = client;  
        this.warnLimit = options.warnLimit || 3;  
        this.exemptAdmins = options.exemptAdmins !== false;  
        this.enabled = options.enabled !== false;  
        this.warnings = new Map();  
        this.adminCache = new Map();  
        this.startCleanupCycle();  
    }  

    toggleSystem(message) {  
        this.enabled = !this.enabled;  
        const statusText = this.enabled ?   
            "🎴 *Système Anti-Médias ACTIVÉ* ✅\n\n*La diffusion de médias est désormais réglementée dans ce salon.*" :  
            "🔓 **Système Anti-Médias DÉSACTIVÉ* ❌\n\n*Les restrictions médias ont été levées.*";  

        this.client.sendMessage(message.key.remoteJid, {  
            text: `🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴\n\n${statusText}\n\n_${AUTHOR}_`  
        });  
    }  

    async handleMessage(upsert) {  
        if (!this.enabled) return;  
        const messages = this.normalizeMessages(upsert);  
        await Promise.allSettled(messages.map(msg => this.processSingleMessage(msg)));  
    }  

    normalizeMessages(upsert) {  
        if (!upsert) return [];  
        if (Array.isArray(upsert.messages)) return upsert.messages.filter(m => m?.key);  
        if (upsert.messages) return [upsert.messages].filter(m => m?.key);  
        if (upsert.key) return [upsert];  
        return [];  
    }  

    async processSingleMessage(msg) {  
        if (!this.isValidTarget(msg)) return;  
        const { remoteJid, participant } = msg.key;  
        const userId = participant.split('@')[0];  

        if (this.exemptAdmins && await this.isUserAdmin(remoteJid, participant)) return;  
        await this.deleteMediaMessage(msg, remoteJid);  
        await this.handleWarning(remoteJid, participant, userId);  
    }  

    isValidTarget(msg) {  
        if (!msg?.key) return false;  
        if (msg.key.fromMe) return false;  
        if (!this.isGroup(msg.key.remoteJid)) return false;  
        if (!this.containsMedia(msg)) return false;  
        return true;  
    }  

    isGroup(remoteJid) {  
        return String(remoteJid).includes('@g.us');  
    }  

    containsMedia(msg) {  
        const m = msg.message;  
        return !!(m?.imageMessage || m?.videoMessage || m?.documentMessage || m?.audioMessage || m?.stickerMessage);  
    }  

    async isUserAdmin(remoteJid, participant) {  
        const cacheKey = `${remoteJid}:${participant}`;  
        if (this.adminCache.has(cacheKey)) return this.adminCache.get(cacheKey);  

        try {  
            const metadata = await this.client.groupMetadata(remoteJid);  
            const user = metadata.participants.find(p => p.id === participant);  
            const isAdmin = !!(user?.admin === 'admin' || user?.admin === 'superadmin');  
            this.adminCache.set(cacheKey, isAdmin);  
            setTimeout(() => this.adminCache.delete(cacheKey), 300000);  
            return isAdmin;  
        } catch {  
            return false;  
        }  
    }  

    async deleteMediaMessage(msg, remoteJid) {  
        try {  
            await this.client.sendMessage(remoteJid, { delete: msg.key });  
        } catch {}  
    }  

    async handleWarning(remoteJid, participant, userId) {  
        const warningCount = this.addWarning(remoteJid, participant);  
        await this.sendWarningMessage(remoteJid, participant, userId, warningCount);  
        if (warningCount >= this.warnLimit) {  
            await this.banUser(remoteJid, participant, userId);  
            this.clearWarnings(remoteJid, participant);  
        }  
    }  

    addWarning(remoteJid, participant) {  
        if (!this.warnings.has(remoteJid)) {  
            this.warnings.set(remoteJid, new Map());  
        }  
        const chatWarnings = this.warnings.get(remoteJid);  
        const current = chatWarnings.get(participant) || { count: 0, timestamp: Date.now() };  
        const newWarning = { count: current.count + 1, timestamp: Date.now() };  
        chatWarnings.set(participant, newWarning);  
        return newWarning.count;  
    }  

    clearWarnings(remoteJid, participant) {  
        const chatWarnings = this.warnings.get(remoteJid);  
        if (chatWarnings) {  
            chatWarnings.delete(participant);  
            if (chatWarnings.size === 0) this.warnings.delete(remoteJid);  
        }  
    }  

    async sendWarningMessage(remoteJid, participant, userId, warningCount) {  
        const messages = {  
            1: `🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴\n\n⚠️ *Premier avertissement*\n\n"Monsieur @${userId}, la diffusion de médias est réglementée dans ce salon.\n\nIl vous reste ${this.warnLimit - warningCount} avertissement(s). Veuillez respecter les règles."\n\n_${AUTHOR}_`,  
            2: `🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴\n\n🚨 *Second avertissement*\n\n"Monsieur @${userId}, votre comportement persiste.\n\nDernier avertissement avant sanction définitive. Soyez prudent."\n\n_${AUTHOR}_`,  
            3: `🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴\n\n💥 *Limite atteinte*\n\n"Monsieur @${userId}, vous avez épuisé tous vos avertissements.\n\nSanction imminente."\n\n_${AUTHOR}_`  
        };  

        const messageText = messages[warningCount] || messages[3];  
        await this.client.sendMessage(remoteJid, { text: messageText, mentions: [participant] });  
    }  

    async banUser(remoteJid, participant, userId) {  
        try {  
            await this.client.groupParticipantsUpdate(remoteJid, [participant], "remove");  
            await this.client.sendMessage(remoteJid, {  
                text: `🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴\n\n🚫 *Utilisateur banni*\n\n"Par ordre, Monsieur @${userId} est expulsé du groupe pour non-respect répété des consignes.\n\nL'ordre est rétabli."\n\n_${AUTHOR}_`,  
                mentions: [participant]  
            });  
        } catch {}  
    }  

    startCleanupCycle() {  
        this.cleanupInterval = setInterval(() => {  
            this.cleanupExpiredWarnings();  
            this.adminCache.clear();  
        }, 60 * 60 * 1000);  
    }  

    cleanupExpiredWarnings() {  
        const now = Date.now();  
        const WARNING_TTL = 24 * 60 * 60 * 1000;  
        for (const [chatId, chatWarnings] of this.warnings) {  
            for (const [participant, warning] of chatWarnings) {  
                if (now - warning.timestamp > WARNING_TTL) {  
                    chatWarnings.delete(participant);  
                }  
            }  
            if (chatWarnings.size === 0) this.warnings.delete(chatId);  
        }  
    }  
}  

export function createAntiMediaGuard(client, options = {}) {  
    const system = new AntiMediaSystem(client, options);  
    return system.handleMessage.bind(system);  
}  

export default { createAntiMediaGuard, AntiMediaSystem };
