// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 AntiBot Kurona — version corrigée & complète
// Détection intelligente & expulsion automatique des bots
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from 'fs';

// ── 1. Import sécurisé de baileys ---------------------------------------
let proto;
try {
  const pkg = await import('baileys');
  proto = pkg.proto;
} catch (e) {
  console.error('❌  Le module « baileys » est introuvable. Lancez « npm install ».');
  process.exit(1);
}

// ── 2. Constantes -------------------------------------------------------
const BOT_NAME = '🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴';
const BOT_SIG  = '🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴';

// ── 3. Base de données des commandes bots -------------------------------
const BOT_COMMANDS = new Set([
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
  "isadmin","groupinfo","antimedia","warn","!ping","!date","!contact","!loc","!info","!img","!gif","!vid","!aud","!stk","!vu","!store"
]);

// ── 4. Patterns de détection --------------------------------------------
const BOT_PATTERNS = [
  /^[.!\/]\w+/,     // préfixes classiques
  /^\s+\w+/,        // espaces avant
  /^\p{Emoji}/u     // commence par emoji
];

// ── 5. Classe AntiBotSystem ---------------------------------------------
export class AntiBotSystem {
  constructor() {
    this.suspiciousUsers = new Map(); // user -> suspicionCount
    this.MAX_SUSPICIONS = 3;
    this.SUSPICION_TTL  = 60_000; // 1 min
  }

  // 🎯 Détection rapide
  detectBot(message) {
    const text = this.extractMessageText(message);
    if (!text) return false;
    return this.hasBotPrefix(text) || this.isBotCommand(text) || this.hasBotPattern(text);
  }

  extractMessageText(message) {
    return message?.message?.conversation ||
           message?.message?.extendedTextMessage?.text ||
           '';
  }

  hasBotPrefix(text) {
    return text.startsWith('.') || text.startsWith('!') || text.startsWith('/');
  }

  isBotCommand(text) {
    const first = text.trim().split(/\s+/)[0].toLowerCase().replace(/^[.!\/]/, '');
    return BOT_COMMANDS.has(first);
  }

  hasBotPattern(text) {
    return BOT_PATTERNS.some(p => p.test(text));
  }

  // 🛡️ Gestion des suspects
  async handleSuspiciousUser(remoteJid, participant, message, client) {
    const userId = participant;
    const current = this.suspiciousUsers.get(userId) || 0;
    const next = current + 1;

    this.suspiciousUsers.set(userId, next);

    // Suppression immédiate du message
    await client.sendMessage(remoteJid, { delete: message.key });

    console.log(`[ANTIBOT – ${BOT_SIG}] Suspicion bot #${next} | ${userId}`);

    if (next <= this.MAX_SUSPICIONS) await this.sendWarning(remoteJid, participant, next, client);
    if (next >= this.MAX_SUSPICIONS) {
      await this.banBotUser(remoteJid, participant, client);
      this.suspiciousUsers.delete(userId);
    }

    // Nettoyage auto
    setTimeout(() => this.suspiciousUsers.delete(userId), this.SUSPICION_TTL);
  }

  async sendWarning(remoteJid, participant, level, client) {
    const msgs = {
      1: `${BOT_NAME}\n⚠️ Comportement automate détecté\n« Votre activité ressemble à un bot. Veuillez cesser immédiatement. »`,
      2: `${BOT_NAME}\n🚨 Suspicion bot confirmée\n« Dernier avertissement avant sanction. »`,
      3: `${BOT_NAME}\n💥 Limite atteinte\n« Expulsion imminente. »`
    };
    await client.sendMessage(remoteJid, {
      text: msgs[level] || msgs[3],
      mentions: [participant]
    });
  }

  async banBotUser(remoteJid, participant, client) {
    try {
      await client.groupParticipantsUpdate(remoteJid, [participant], 'remove');
      await client.sendMessage(remoteJid, {
        text: `${BOT_NAME}\n🚫 Bot expulsé\n« L'automate a été banni pour préservation de l'écosystème. »`,
        mentions: [participant]
      });
      console.log(`[ANTIBOT] Bot expulsé | ${participant}`);
    } catch (e) {
      console.error(`[ANTIBOT] Erreur expulsion :`, e.message);
    }
  }

  // 🧹 Nettoyage périodique
  cleanup() {
    const now = Date.now();
    for (const [user, count] of this.suspiciousUsers.entries()) {
      // on stocke le timestamp dans la valeur :  {count, ts}
      if (typeof count === 'object' && now - count.ts > this.SUSPICION_TTL) {
        this.suspiciousUsers.delete(user);
      }
    }
  }
}

// ── 6. Instance globale & nettoyage auto --------------------------------
export const antibot = new AntiBotSystem();
setInterval(() => antibot.cleanup(), 300_000); // toutes les 5 min

// ── 7. Fonction standalone rapide ---------------------------------------
export function isLikelyBot(text) {
  if (!text || typeof text !== 'string') return false;
  const t = text.trim().toLowerCase();
  const first = t.split(/\s+/)[0].replace(/^[.!\/]/, '');
  return BOT_COMMANDS.has(first) || /^[.!\/]/.test(t) || /^\p{Emoji}/u.test(t[0]);
}

// ── 8. Handler asynchrone simplifié -------------------------------------
export async function handleAntiBot({ text, sender, groupId, isGroupAdmin, kickUserFromGroup }) {
  try {
    if (!text) return;
    if (isLikelyBot(text) && !isGroupAdmin(sender)) {
      console.log(`[ANTIBOT] Bot détecté : ${sender} → ${text}`);
      if (typeof kickUserFromGroup === 'function') {
        await kickUserFromGroup(groupId, sender);
        console.log(`[ANTIBOT] ${sender} expulsé du groupe ${groupId}`);
      }
    }
  } catch (e) {
    console.error(`[ANTIBOT] Erreur détection :`, e.message);
  }
}

export default antibot;
