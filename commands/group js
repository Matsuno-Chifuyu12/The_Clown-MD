//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// WhatsApp Group Management
// Commande : groupManage.js
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 Promote / Demote
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function promote(message, client) {
  const remoteJid = message.key.remoteJid;
  const participant = message.message?.extendedTextMessage?.contextInfo?.participant;
  
  if (!participant) {
    return await client.sendMessage(remoteJid, { 
      text: "❌ *Mon Seigneur*, veuillez mentionner l'âme que vous souhaitez élever au rang d'administrateur." 
    });
  }

  try {
    await client.groupParticipantsUpdate(remoteJid, [participant], "promote");
    await client.sendMessage(remoteJid, { 
      text: `👑 *Excellence*, @${participant.split("@")[0]} a été promu administrateur. Qu'il serve avec loyauté et sagesse.`,
      mentions: [participant] 
    });
  } catch (e) {
    console.error("Erreur promote:", e);
    await client.sendMessage(remoteJid, { 
      text: "❌ *Pardonnez-moi*, Mon Seigneur. Une obstruction empêche cette promotion." 
    });
  }
}

export async function demote(message, client) {
  const remoteJid = message.key.remoteJid;
  const participant = message.message?.extendedTextMessage?.contextInfo?.participant;
  
  if (!participant) {
    return await client.sendMessage(remoteJid, { 
      text: "❌ *Mon Seigneur*, veuillez désigner l'administrateur à rétrograder." 
    });
  }

  try {
    await client.groupParticipantsUpdate(remoteJid, [participant], "demote");
    await client.sendMessage(remoteJid, { 
      text: `⬇️ *Sentence exécutée*, @${participant.split("@")[0]} a été destitué de ses fonctions. Que cela serve d'enseignement.`,
      mentions: [participant] 
    });
  } catch (e) {
    console.error("Erreur demote:", e);
    await client.sendMessage(remoteJid, { 
      text: "❌ *Impossible d'exécuter*, Mon Seigneur. L'autorité me fait défaut." 
    });
  }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 Promote/Demote ALL
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function promoteall(message, client) {
  const remoteJid = message.key.remoteJid;
  
  try {
    const group = await client.groupMetadata(remoteJid);
    const targets = group.participants.filter(p => p.admin !== "admin").map(p => p.id);

    if (targets.length === 0) {
      return await client.sendMessage(remoteJid, { 
        text: "ℹ️ *Mon Seigneur*, tous les membres sont déjà administrateurs. L'ordre est établi." 
      });
    }

    await client.groupParticipantsUpdate(remoteJid, targets, "promote");
    await client.sendMessage(remoteJid, { 
      text: `👑 *Proclamation*, ${targets.length} âmes ont été élevées au rang d'administrateur. Le pouvoir est partagé.` 
    });
  } catch (e) {
    console.error("Erreur promoteall:", e);
    await client.sendMessage(remoteJid, { 
      text: "❌ *Pardonnez mon échec*, Mon Seigneur. La promotion collective a échoué." 
    });
  }
}

export async function demoteall(message, client) {
  const remoteJid = message.key.remoteJid;
  
  try {
    const group = await client.groupMetadata(remoteJid);
    const targets = group.participants.filter(p => p.admin === "admin" && !p.id.includes(client.user.id)).map(p => p.id);

    if (targets.length === 0) {
      return await client.sendMessage(remoteJid, { 
        text: "ℹ️ *Mon Seigneur*, aucun administrateur à rétrograder. Je reste le seul garant de l'ordre." 
      });
    }

    await client.groupParticipantsUpdate(remoteJid, targets, "demote");
    await client.sendMessage(remoteJid, { 
      text: `⬇️ *Restauration*, ${targets.length} administrateurs ont été destitués. L'équilibre est rétabli.` 
    });
  } catch (e) {
    console.error("Erreur demoteall:", e);
    await client.sendMessage(remoteJid, { 
      text: "❌ *Impossible*, Mon Seigneur. La rétrogradation collective rencontre une résistance." 
    });
  }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 Kick / Kick All
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function kick(message, client) {
  const remoteJid = message.key.remoteJid;
  const participant = message.message?.extendedTextMessage?.contextInfo?.participant;
  
  if (!participant) {
    return await client.sendMessage(remoteJid, { 
      text: "❌ *Mon Seigneur*, veuillez désigner l'âme à bannir de ce sanctuaire." 
    });
  }

  try {
    await client.groupParticipantsUpdate(remoteJid, [participant], "remove");
    await client.sendMessage(remoteJid, { 
      text: `🚫 *Bannissement exécuté*, @${participant.split("@")[0]} a été exilé. Que la pureté soit préservée.`,
      mentions: [participant] 
    });
  } catch (e) {
    console.error("Erreur kick:", e);
    await client.sendMessage(remoteJid, { 
      text: "❌ *Le bannissement échoue*, Mon Seigneur. L'individu résiste à mon autorité." 
    });
  }
}

export async function kickall(message, client) {
  const remoteJid = message.key.remoteJid;
  
  try {
    const group = await client.groupMetadata(remoteJid);
    const targets = group.participants.filter(p => p.admin !== "admin").map(p => p.id);

    if (targets.length === 0) {
      return await client.sendMessage(remoteJid, { 
        text: "ℹ️ *Mon Seigneur*, seuls les administrateurs demeurent. La purification est déjà accomplie." 
      });
    }

    for (const target of targets) {
      await client.groupParticipantsUpdate(remoteJid, [target], "remove");
    }

    await client.sendMessage(remoteJid, { 
      text: `🚫 *Grande Purification*, ${targets.length} âmes ont été bannies. L'élite seule demeure.` 
    });
  } catch (e) {
    console.error("Erreur kickall:", e);
    await client.sendMessage(remoteJid, { 
      text: "❌ *La purification est incomplète*, Mon Seigneur. Certains résistent à mon autorité." 
    });
  }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 Invite
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function invite(message, client) {
  const remoteJid = message.key.remoteJid;
  
  try {
    const code = await client.groupInviteCode(remoteJid);
    await client.sendMessage(remoteJid, { 
      text: `╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│ 🔗 *Par votre volonté mon maître*,
│ voici le lien d'invitation :
│ 
│ https://chat.whatsapp.com/${code}
│ 
│ Qu'il soit partagé avec discernement.
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯` 
});
  } catch (e) {
    console.error("Erreur invite:", e);
    await client.sendMessage(remoteJid, { 
      text: "❌ *Le lien refuse de se manifester*, Mon Seigneur. L'accès m'est interdit." 
    });
  }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 Welcome
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function welcome(update, client) {
  try {
    for (const participant of update.participants) {
      const name = participant.split("@")[0];
      const remoteJid = update.id;
      
      let groupName = "Sanctuaire Mystique";
      let description = "Ce sanctuaire attend sa destinée.";
      
      try {
        const metadata = await client.groupMetadata(remoteJid);
        groupName = metadata.subject || "Sanctuaire Mystique";
        description = metadata.desc || "Aucune sagesse n'a été inscrite pour ce lieu.";
      } catch (error) {
        console.error("Erreur récupération métadonnées:", error);
      }

      if (update.action === "add") {
        const welcomeMessage = `
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│    🎴 𝛫𝑈𝑅𝛩𝛮𝛥 𝑊𝛯𝐿𝐶𝛩𝛭𝛯 🥳🎴
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
│  Salutation, @${name}...!
│  *Bienvenue dans :*
│  *${groupName}*
│  
│  📜 *Sagesse du lieu* :
│  ${description}
│
│  Que votre présence soit bénie
│  et vos actions empreintes de noblesse.
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
`;
        await client.sendMessage(remoteJid, { text: welcomeMessage, mentions: [participant] });
      }

      if (update.action === "remove") {
        const goodbyeMessage = `
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│    🎴 𝛫𝑈𝑅𝛩𝛮𝛥 𝑮𝛩𝛩𝑫𝑩𝒀𝛯 😔🎴
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
│  *Portez-vous bien*, @${name}...
│  
│  Votre chapitre avec nous ici s'achève.
│  *Adieu, et bon courage pour la suite.*
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
`;
        await client.sendMessage(remoteJid, { text: goodbyeMessage, mentions: [participant] });
      }
    }
  } catch (e) {
    console.error("Erreur welcome:", e);
  }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 Mute / Unmute
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function mute(message, client) {
  const remoteJid = message.key.remoteJid;
  
  try {
    await client.groupSettingUpdate(remoteJid, "announcement");
    await client.sendMessage(remoteJid, { 
      text: "🔇 *Silence imposé*, les discussions sont suspendues." 
    });
  } catch (e) {
    console.error("Erreur mute:", e);
    await client.sendMessage(remoteJid, { 
      text: "❌ *Le silence m'échappe*, le tumulte persiste." 
    });
  }
}

export async function unmute(message, client) {
  const remoteJid = message.key.remoteJid;
  
  try {
    await client.groupSettingUpdate(remoteJid, "not_announcement");
    await client.sendMessage(remoteJid, { 
      text: "🔊 *Le silence est rompu*, la parole est libérée. Que les discussions reprennent avec sagesse." 
    });
  } catch (e) {
    console.error("Erreur unmute:", e);
    await client.sendMessage(remoteJid, { 
      text: "❌ *Mon Seigneur, le silence persiste contre ma volonté." 
    });
  }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 Export
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default {
  promote, demote, promoteall, demoteall,
  kick, kickall, invite,
  welcome, mute, unmute
};
