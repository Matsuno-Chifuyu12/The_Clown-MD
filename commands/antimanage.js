//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// The Ultimate WhatsApp Experience
// Commande : antiManage.js
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 Variables de contrôle
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let antipromote = false;
let antidemote = false;
let antitag = false;
let antigetid = false;
let antimention = false;
let antilink = false;

// Liste des administrateurs autorisés (à définir selon votre logique)
const allowedAdmins = []; // Ajoutez les numéros autorisés

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 Toggles avec retour "majordome"
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function politeReply(state, feature) {
  return `🔹 Monsieur/Mademoiselle, la fonction *${feature}* est désormais ${state ? "activée ✅" : "désactivée ❌"}.  
Faites-moi confiance, je m'en occuperai avec la plus grande discrétion.`;
}

export function toggleAntipromote(message, client) {
  antipromote = !antipromote;
  client.sendMessage(message.key.remoteJid, { text: politeReply(antipromote, "Anti-Promote") });
}

export function toggleAntidemote(message, client) {
  antidemote = !antidemote;
  client.sendMessage(message.key.remoteJid, { text: politeReply(antidemote, "Anti-Demote") });
}

export function toggleAntitag(message, client) {
  antitag = !antitag;
  client.sendMessage(message.key.remoteJid, { text: politeReply(antitag, "Anti-Tag") });
}

export function toggleAntigetid(message, client) {
  antigetid = !antigetid;
  client.sendMessage(message.key.remoteJid, { text: politeReply(antigetid, "Anti-GetID") });
}

export function toggleAntimention(message, client) {
  antimention = !antimention;
  client.sendMessage(message.key.remoteJid, { text: politeReply(antimention, "Anti-Mention") });
}

export function toggleAntilink(message, client) {
  antilink = !antilink;
  client.sendMessage(message.key.remoteJid, { text: politeReply(antilink, "Anti-Link") });
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 Gestion des messages
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function handleGroupUpdate(update, client) {
  try {
    const remoteJid = update.id;
    const affected = update.participants; // personnes promues/démotes
    const actor = update.actor; // admin qui agit
    if (!affected || !actor) return;

    // Anti-Promote
    if (antipromote && update.action === "promote") {
      for (const user of affected) {
        if (!allowedAdmins.includes(actor)) {
          // Rétrograde la personne promue
          await client.groupParticipantsUpdate(remoteJid, [user], "demote");
          // Expulse l'admin qui a promu
          await client.groupParticipantsUpdate(remoteJid, [actor], "remove");
          await client.sendMessage(remoteJid, {
            text: `👑 Monsieur @${actor.split("@")[0]} a osé promouvoir @${user.split("@")[0]}.  
Comme convenu, je rétrograde l'un et expulse l'autre.`,
            mentions: [actor, user]
          });
        }
      }
    }

    // Anti-Demote
    if (antidemote && update.action === "demote") {
      for (const user of affected) {
        if (!allowedAdmins.includes(actor)) {
          // Remet la personne démote admin
          await client.groupParticipantsUpdate(remoteJid, [user], "promote");
          // Expulse l'admin qui a tenté de démoter
          await client.groupParticipantsUpdate(remoteJid, [actor], "remove");
          await client.sendMessage(remoteJid, {
            text: `⬇️ Monsieur @${actor.split("@")[0]} a tenté de rétrograder @${user.split("@")[0]}.  
L'ordre est rétabli et le fauteur est expulsé.`,
            mentions: [actor, user]
          });
        }
      }
    }
  } catch (e) {
    console.error("Erreur handleGroupUpdate:", e);
  }
}

export async function handleAntiManage(message, client) {
  try {
    const remoteJid = message.key.remoteJid;
    const participant = message.key.participant || message.key.remoteJid;
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || "";

    // Anti-Tag
    if (antitag && text.includes("@")) {
      await client.sendMessage(remoteJid, { text: `🔔 Très cher @${participant.split("@")[0]}, les *tags* sont proscrits par ordre supérieur.`, mentions: [participant] });
      await client.sendMessage(remoteJid, { delete: message.key });
    }

    // Anti-GetID
    if (antigetid && text.toLowerCase().includes("id")) {
      await client.sendMessage(remoteJid, { text: `🆔 Je crains que la requête d'identifiant ne soit pas autorisée, @${participant.split("@")[0]}.`, mentions: [participant] });
      await client.sendMessage(remoteJid, { delete: message.key });
    }

    // Anti-Mention
    if (antimention) {
      const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      if (mentions.includes(remoteJid)) {
        try {
          await client.sendMessage(remoteJid, {
            text: `⚠️ @${participant.split("@")[0]} a mentionné le groupe, suppression de la mention.`,
            mentions: [participant]
          });
          await client.sendMessage(remoteJid, { delete: message.key });
        } catch (e) {
          console.error("Erreur antimention:", e);
        }
      }
    }

    // Anti-Link
    if (antilink) {
      const linkRegex = /(https?:\/\/[^\s]+)/gi;
      if (linkRegex.test(text)) {
        try {
          await client.sendMessage(remoteJid, { delete: message.key });
          await client.groupParticipantsUpdate(remoteJid, [participant], "remove");
          await client.sendMessage(remoteJid, {
            text: `🚫 @${participant.split("@")[0]} expulsé pour avoir envoyé un lien.`,
            mentions: [participant]
          });
        } catch (e) {
          console.error("Erreur Antilink:", e);
        }
      }
    }
  } catch (error) {
    console.error("Erreur handleAntiManage:", error);
  }
} // ✅ ACCOLADE FERMANTE AJOUTÉE

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 Export
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default {
  toggleAntipromote,
  toggleAntidemote, 
  toggleAntitag, 
  toggleAntigetid, 
  toggleAntimention,
  toggleAntilink,
  handleGroupUpdate,
  handleAntiManage
};
