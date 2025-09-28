// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 AntiBot Kurona — Détection intelligente & expulsion automatique des bots
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let antibot = false,
    
import {proto} from 'bailey';
import fs from 'fs';

// ----------------------
// Nom et signature du bot
// ----------------------
const BOT_NAME = '🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴';
const BOT_SIG = '🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴';

// ----------------------
// Commandes bots connues
// ----------------------
const botCommandsSet = new Set([
"owner","sudo","promote","promoteall","demote","demoteall","kick","kickall","add","approveall","link","resetlink",
"setname","setdesc","mute","unmute","tagadmin","tagall","listadmins","totalmembers","menu","bugmenu","speed","ping",
"alive","runtime","say","reverse","ai","gpt","gpt2","llama","metaai","mistral","ppcouple","allvar","updates","help",
"doc","about","imagen","imagine","dalle","photoai","gemini","sticker","tosticker","remini","wallpaper","glitchtext",
"neon","gradienttext","typography","galaxystyle","!aud","bass","blown","deep","earrape","robot","volaudio","!gif",
"!vid","!tostk","!setpp","getpp","apk","download","facebook","gdrive","gitclone","image","instagram","itunes",
"mediafire","song","song2","play","play2","savestatus","telesticker","tiktok","tiktokaudio","twitter","video",
"videodoc","ytmp3","ytmp3doc","xvideos","truth","dare","truthordare","dice","joke","memes","quotes","fact","trivia",
"xxqc","motivation","rate","coin","love","weather","vv","block","unblock","unblockall","delete","deljunk","disk",
"dlvo","join","leave","autoread","deploy","pair","jid","listbadword","listblocked","listsudo","modestatus","setbio",
"setprofilepic","react","readreceipts","restart","tostatus","toviewonce","setstickercmd","delstickercmd",
"analyze","blackbox","deepseek","deepseekr1","doppleai","programming","translate2","summarize","story","recipe","teach",
"tomp3","toptt","1917style","advancedglow","blackpinklogo","blackpinkstyle","cartoonstyle","deletingtext","dragonball",
"effectclouds","flag3dtext","flagtext","freecreate","galaxywallpaper","glowingtext","graffiti","incandescent","lighteffects",
"logomaker","luxurygold","makingneon","matrix","multicoloredneon","neonglitch","papercutstyle","pixelglitch","royaltext",
"sand","summerbeach","topography","userid","vcf","botstatus","gcaddprivacy","groupid","hostip","lastseen","listignorelist",
"isadmin","groupinfo","antimedia","warn","!ping","!date","!contact","!loc","!info","!img","!gif","!vid","!aud","!stk","!vu","!store",
]);

// ----------------------
// Patterns avancés de détection
// ----------------------
const BOT_PATTERNS = [
    /^[.!\/]\w+/,        // Préfixes classiques
    /^\s+\w+/,           // Espaces avant commande
    /^\p{Emoji}/u,       // Commence par un emoji
];

// ----------------------
// Classe AntiBot Kurona
// ----------------------
export class AntiBotSystem {
    constructor() {
        this.suspiciousUsers = new Map();
        this.MAX_SUSPICIONS = 3;
        this.SUSPICION_TTL = 3000; // 1 minute
    }

    // 🎯 Détection rapide d’un bot
    detectBot(message) {
        const text = this.extractMessageText(message);
        if (!text) return false;

        return this.hasBotPrefix(text) ||
               this.isBotCommand(text) ||
               this.hasBotPattern(text);
    }

    // ⚡ Extraction optimisée du texte
    extractMessageText(message) {
        return message?.message?.conversation ||
               message?.message?.extendedTextMessage?.text ||
               '';
    }

    // 🚨 Détection préfixes bots
    hasBotPrefix(text) {
        return text.startsWith('.') || text.startsWith('!') || text.startsWith('/');
    }

    // 🔧 Détection commandes bots
    isBotCommand(text) {
        const firstWord = text.trim().split(/\s+/)[0].toLowerCase();
        const cleanCommand = firstWord.replace(/^[.!\/]/, '');
        return BOT_COMMANDS.has(cleanCommand);
    }

    // 🕵🏾‍♂️ Détection patterns avancés
    hasBotPattern(text) {
        return BOT_PATTERNS.some(pattern => pattern.test(text));
    }

    // 🛡️ Gestion des utilisateurs suspects
    async handleSuspiciousUser(remoteJid, participant, message, client) {
        const userId = participant.split('@')[0];
        const currentSuspicions = this.suspiciousUsers.get(participant) || 0;
        const newSuspicions = currentSuspicions + 1;

        this.suspiciousUsers.set(participant, newSuspicions);

        // 🗑️ Suppression immédiate du message
        await client.sendMessage(remoteJid, { delete: message.key });

        console.log(`[ANTIBOT — ${BOT_SIG}] Suspicion bot #${newSuspicions} | ${userId}`);

        // ⚠️ Envoi avertissement
        if (newSuspicions <= this.MAX_SUSPICIONS) {
            await this.sendWarning(remoteJid, participant, newSuspicions, client);
        }

        // 🔨 Expulsion si dépassement du seuil
        if (newSuspicions >= this.MAX_SUSPICIONS) {
            await this.banBotUser(remoteJid, participant, client);
            this.suspiciousUsers.delete(participant);
        }

        // 🧹 Nettoyage automatique
        setTimeout(() => this.suspiciousUsers.delete(participant), this.SUSPICION_TTL);
    }

    // 📢 Messages d’avertissement
    async sendWarning(remoteJid, participant, level, client) {
        const warnings = {
            1: `${BOT_NAME}\n⚠️ Comportement automate détecté\n"Votre activité ressemble à un bot. Veuillez cesser immédiatement."`,
            2: `${BOT_NAME}\n🚨 Suspicion bot confirmée\n"Dernier avertissement avant sanction."`,
            3: `${BOT_NAME}\n💥 Limite atteinte\n"Expulsion imminente."`
        };

        await client.sendMessage(remoteJid, {
            text: warnings[level] || warnings[3],
            mentions: [participant]
        });
    }

    // 🔨 Expulsion protocolaire
    async banBotUser(remoteJid, participant, client) {
        try {
            await client.groupParticipantsUpdate(remoteJid, [participant], "remove");
            
            await client.sendMessage(remoteJid, {
                text: `${BOT_NAME}\n🚫 Bot expulsé\n"L'automate a été banni pour préservation de l'écosystème."`,
                mentions: [participant]
            });

            console.log(`[ANTIBOT] Bot expulsé | ${participant.split('@')[0]}`);
            
        } catch (error) {
            console.error(`[ANTIBOT] Erreur expulsion bot:`, error.message);
        }
    } 

    // 🧹 Nettoyage périodique des suspicions
    cleanup() {
        const now = Date.now();
        for (const [user, timestamp] of this.suspiciousUsers.entries()) {
            if (now - timestamp > this.SUSPICION_TTL) {
                this.suspiciousUsers.delete(user);
            }
        }
    }
}

// 🚀 Instance globale du système AntiBot
export const antibot = new AntiBotSystem();

// 🧹 Nettoyage auto toutes les 5 minutes
setInterval(() => antibot.cleanup(), 300000);

// ----------------------
// Détection rapide standalone
// ----------------------
export function isLikelyBot(text) {
    if (!text || typeof text !== 'string') return false;

    const trimmed = text.trim().toLowerCase();
    const firstWord = trimmed.split(/\s+/)[0];

    // Vérification simple rapide
    return BOT_COMMANDS.has(firstWord) || trimmed.startsWith('.') || trimmed.startsWith('!') || trimmed.startsWith('/') || /^\p{Emoji}/u.test(trimmed[0]);
}

// ----------------------
// Gestion anti-bot asynchrone
// ----------------------
export async function handleAntiBot({ text, sender, groupId, isGroupAdmin, kickUserFromGroup }) {
    try {
        if (!text) return;

        const likelyBot = isLikelyBot(text);

        // Skip si admin
        if (likelyBot && !isGroupAdmin(sender)) {
            console.log(`[ANTIBOT] Bot détecté : ${sender} → ${text}`);

            if (!handleAntiBot._lastAction) handleAntiBot._lastAction = 0;
            const now = Date.now();
            if (now - handleAntiBot._lastAction > 1500) {
                handleAntiBot._lastAction = now;

                if (typeof kickUserFromGroup === 'function') {
                    await kickUserFromGroup(groupId, sender);
                    console.log(`[ANTIBOT] ${sender} expulsé du groupe ${groupId}`);
                }
            }
        }
    } catch (err) {
        console.error(`[ANTIBOT] Erreur détection bot:`, err?.message || err);
    }
}

export default antibot;
