//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴
// Commande : Mention All / Tag Groupé
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const BOT_NAME = "🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴";
const BOT_SIGNATURE = "🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴";

/**
 * mentionAll — Mentionner tous les membres du groupe
 * @param {Object} message - Message reçu
 * @param {Object} client - Instance Baileys
 */
export async function mentionAll(message, client) {
  const remoteJid = message?.key?.remoteJid;

  try {
    if (!remoteJid || !remoteJid.includes("@g.us")) {
      await client.sendMessage(remoteJid, {
        text: `${BOT_NAME} :\n\n❌ Cette commande est exclusive aux salons de groupe.`,
      });
      return;
    }

    const groupMetadata = await client.groupMetadata(remoteJid);
    const participants = groupMetadata.participants.map((p) => p.id);

    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const baseText =
      message.message?.conversation ||
      message.message?.extendedTextMessage?.text ||
      "";

    const args = baseText.trim().startsWith("/")
      ? baseText.slice(1).trim().split(/\s+/)
      : baseText.trim().split(/\s+/);

    const customText = args.slice(1).join(" ") || "\u200B";

    // Cas 1 : Message cité → renvoi du même type de média avec mentions
    if (quoted) {
      // Vérifier le type de message cité et le renvoyer accordingly
      if (quoted.stickerMessage) {
        await client.sendMessage(remoteJid, {
          sticker: quoted.stickerMessage,
          mentions: participants
        });
        return;
      }
      else if (quoted.imageMessage) {
        await client.sendMessage(remoteJid, {
          image: quoted.imageMessage,
          caption: quoted.imageMessage.caption || "",
          mentions: participants
        });
        return;
      }
      else if (quoted.videoMessage) {
        await client.sendMessage(remoteJid, {
          video: quoted.videoMessage,
          caption: quoted.videoMessage.caption || "",
          mentions: participants
        });
        return;
      }
      else if (quoted.audioMessage) {
        await client.sendMessage(remoteJid, {
          audio: quoted.audioMessage,
          mentions: participants
        });
        return;
      }
      else if (quoted.documentMessage) {
        await client.sendMessage(remoteJid, {
          document: quoted.documentMessage,
          caption: quoted.documentMessage.caption || "",
          mentions: participants
        });
        return;
      }
      else if (quoted.contactMessage) {
        await client.sendMessage(remoteJid, {
          contacts: {
            contacts: [quoted.contactMessage]
          },
          mentions: participants
        });
        return;
      }
      else if (quoted.pollMessage) {
        await client.sendMessage(remoteJid, {
          poll: quoted.pollMessage,
          mentions: participants
        });
        return;
      }
      else if (quoted.locationMessage) {
        await client.sendMessage(remoteJid, {
          location: quoted.locationMessage,
          mentions: participants
        });
        return;
      }
      else if (quoted.liveLocationMessage) {
        await client.sendMessage(remoteJid, {
          liveLocation: quoted.liveLocationMessage,
          mentions: participants
        });
        return;
      }
      else if (quoted.buttonsMessage || quoted.templateMessage) {
        // Pour les messages avec boutons
        const buttonMessage = quoted.buttonsMessage || quoted.templateMessage;
        await client.sendMessage(remoteJid, {
          text: buttonMessage.contentText || buttonMessage.text || "Message avec boutons",
          mentions: participants,
          ...(quoted.buttonsMessage && { buttons: quoted.buttonsMessage.buttons }),
          ...(quoted.templateMessage && { template: quoted.templateMessage })
        });
        return;
      }
      else {
        // Cas par défaut : message texte
        const quotedText =
          quoted.conversation ||
          quoted.extendedTextMessage?.text ||
          "_Message sans contenu_";

        await client.sendMessage(remoteJid, {
          text: `${BOT_NAME} :\n\n「 ${quotedText} 」\n\n.`,
          mentions: participants,
        });
      }
      return;
    }

    // Cas 2 : Message libre avec mentions (texte simple)
    await client.sendMessage(remoteJid, {
      text: `${BOT_NAME} :\n\n📢 Annonce groupée:\n\n${customText}\n\n(Convives, je vous invite à prêter attention à ce message.)`,
      mentions: participants,
    });

  } catch (err) {
    try {
      await client.sendMessage(remoteJid, {
        text: `${BOT_NAME} :\n\n💥 Une erreur imprévue est survenue. Veuillez agréer mes excuses les plus distinguées.\n\nSignature : ${BOT_SIGNATURE}`,
      });
    } catch {
      // Silence si envoi échoue
    }
  }
}

export default mentionAll;
