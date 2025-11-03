// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// tag.js  –
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴
// Commandes de mention / TAG – Ton Majordome
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createWriteStream, existsSync, mkdirSync, unlinkSync } from 'fs';
import path from 'path';

// ── 1. Import sécurisé de baileys ---------------------------------------
let pkg;
try {
  pkg = await import('baileys');
} catch (e) {
  console.error('❌  Le module « baileys » est introuvable. Lancez « npm install ».');
  process.exit(1);
}
const { downloadMediaMessage } = pkg;

import configManager from '../utils/managerConfigs.js';

const BOT_SIGNATURE = '🎩 Votre humble serviteur — 🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴 🎩';

// ── 2. Helpers ------------------------------------------------------------
async function convertToPTT(inputPath, outputPath) {
  // placeholder – copie simple
  if (existsSync(inputPath)) {
    const fs = await import('fs');
    fs.copyFileSync(inputPath, outputPath);
    return outputPath;
  }
  return inputPath;
}

// ── 3. Commandes ----------------------------------------------------------
export async function tagall(message, client) {
  const jid = message.key.remoteJid;
  if (!jid.includes('@g.us')) {
    return client.sendMessage(jid, {
      text: 'Veuillez excuser cette requête, mais les mentions sont strictement réservées aux rassemblements de ce cercle distingué.'
    });
  }

  try {
    const group = await client.groupMetadata(jid);
    const participants = group.participants.map(p => p.id);

    const mentionsText = participants
      .map((u, i) => `🎴${i + 1} @${u.split('@')[0]}`)
      .join('\n');

    const tagMessage = `
> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │    🎴HONORED CALL TO ALL🎴         │
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯

Avec tout le respect qui vous est dû, @${
      message.key.participant?.split('@')[0] || 'Votre Excellence'
    } présente l'invocation :

${mentionsText}

${BOT_SIGNATURE}`.trim();

    await client.sendMessage(jid, { text: tagMessage, mentions: participants });
  } catch (err) {
    console.error("Erreur tagall :", err);
    await client.sendMessage(jid, {
      text: "Une malencontreuse erreur a entravé l'invocation générale."
    });
  }
}

export async function tagadmin(message, client) {
  const jid = message.key.remoteJid;
  if (!jid.includes('@g.us')) {
    return client.sendMessage(jid, {
      text: "Ah, je crains que cette commande ne soit disponible qu'au sein d'un cercle privilégié…"
    });
  }

  const botNumber = client.user.id.split(':')[0] + '@s.whatsapp.net';
  try {
    const { participants } = await client.groupMetadata(jid);
    const admins = participants
      .filter(p => p.admin && p.id !== botNumber)
      .map(p => p.id);

    if (!admins.length) {
      return client.sendMessage(jid, {
        text: "Il semblerait qu'aucun membre de distinction ne soit présent à l'instant."
      });
    }

    const adminMentions = admins
      .map((u, i) => `🎴${i + 1} @${u.split('@')[0]}`)
      .join('\n');

    const text = `🎩 *Les honorables administrateurs sont priés de se manifester :*\n\n${adminMentions}`;
    await client.sendMessage(jid, { text, mentions: admins });
  } catch (err) {
    console.error("Erreur tagadmin :", err);
    await client.sendMessage(jid, {
      text: "Une malencontreuse erreur a empêché l'invocation des administrateurs."
    });
  }
}

export async function tag(message, client) {
  const jid = message.key.remoteJid;
  if (!jid.includes('@g.us')) {
    return client.sendMessage(jid, {
      text: "Cette opération est strictement réservée aux cercles distingués."
    });
  }

  try {
    const group = await client.groupMetadata(jid);
    const participants = group.participants.map(u => u.id);

    const msgBody = message.message?.conversation ||
                    message.message?.extendedTextMessage?.text ||
                    '';
    const customText = msgBody
      .slice(1)
      .trim()
      .split(/\s+/)
      .slice(1)
      .join(' ') || "Veuillez prêter attention à ce message distingué…";

    const quotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    // --- Gestion des messages cités ---------------------------------
    if (quotedMsg) {
      // Sticker
      if (quotedMsg.stickerMessage) {
        return client.sendMessage(jid, {
          sticker: quotedMsg.stickerMessage,
          mentions: participants
        });
      }
      // Image
      if (quotedMsg.imageMessage) {
        return client.sendMessage(jid, {
          image: quotedMsg.imageMessage,
          caption: quotedMsg.imageMessage.caption || "",
          mentions: participants
        });
      }
      // Video
      if (quotedMsg.videoMessage) {
        return client.sendMessage(jid, {
          video: quotedMsg.videoMessage,
          caption: quotedMsg.videoMessage.caption || "",
          mentions: participants
        });
      }
      // Audio
      if (quotedMsg.audioMessage) {
        return client.sendMessage(jid, {
          audio: quotedMsg.audioMessage,
          mentions: participants
        });
      }
      // Document
      if (quotedMsg.documentMessage) {
        return client.sendMessage(jid, {
          document: quotedMsg.documentMessage,
          caption: quotedMsg.documentMessage.caption || "",
          mentions: participants
        });
      }
      // Contact
      if (quotedMsg.contactMessage) {
        return client.sendMessage(jid, {
          contacts: { contacts: [quotedMsg.contactMessage] },
          mentions: participants
        });
      }
      // Poll
      if (quotedMsg.pollMessage) {
        return client.sendMessage(jid, {
          poll: quotedMsg.pollMessage,
          mentions: participants
        });
      }
      // Location
      if (quotedMsg.locationMessage) {
        return client.sendMessage(jid, {
          location: quotedMsg.locationMessage,
          mentions: participants
        });
      }
      // Live Location
      if (quotedMsg.liveLocationMessage) {
        return client.sendMessage(jid, {
          liveLocation: quotedMsg.liveLocationMessage,
          mentions: participants
        });
      }
      // Buttons / Template
      if (quotedMsg.buttonsMessage || quotedMsg.templateMessage) {
        const btnMsg = quotedMsg.buttonsMessage || quotedMsg.templateMessage;
        return client.sendMessage(jid, {
          text: btnMsg.contentText || btnMsg.text || "Message avec boutons",
          mentions: participants,
          ...(quotedMsg.buttonsMessage && { buttons: quotedMsg.buttonsMessage.buttons }),
          ...(quotedMsg.templateMessage && { template: quotedMsg.templateMessage })
        });
      }

      // Texte simple cité
      const qText = quotedMsg.conversation ||
                    quotedMsg.extendedTextMessage?.text ||
                    '';
      const mentionsText = participants
        .map((u, i) => `🎴${i + 1} @${u.split('@')[0]}`)
        .join('\n');
      const finalText = `${qText}\n\n${mentionsText}`;
      return client.sendMessage(jid, { text: finalText, mentions: participants });
    }

    // --- Message texte simple ---------------------------------------
    const mentionsText = participants
      .map((u, i) => `🎴${i + 1} @${u.split('@')[0]}`)
      .join('\n');
    const finalText = `${customText}\n\n${mentionsText}`;
    await client.sendMessage(jid, { text: finalText, mentions: participants });
  } catch (err) {
    console.error("Erreur tag :", err);
    await client.sendMessage(jid, {
      text: "Une erreur est survenue lors de l'invocation."
    });
  }
}

export async function settag(message, client) {
  const number = client.user.id.split(':')[0];
  const jid    = message.key.remoteJid;
  const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

  if (!quoted?.audioMessage) {
    return client.sendMessage(jid, {
      text: "Veuillez répondre avec un message audio pour définir la notification, s'il vous plaît."
    });
  }

  try {
    const stream   = await downloadMediaMessage({ message: quoted }, 'stream');
    const filePath = `${number}.mp3`;
    const ws       = createWriteStream(filePath);

    stream.pipe(ws);

    if (!configManager.config.users[number]) configManager.config.users[number] = {};
    configManager.config.users[number].tagAudioPath = filePath;
    configManager.save();

    await client.sendMessage(jid, { text: 'Votre tag audio a été élégamment enregistrée. 🎩' });
  } catch (err) {
    console.error("Erreur settag :", err);
    await client.sendMessage(jid, {
      text: "Une erreur est survenue lors de l'enregistrement du tag audio."
    });
  }
}

export async function tagoption(message, client) {
  const number   = client.user.id.split(':')[0];
  const jid      = message.key.remoteJid;
  const args = (message.message?.conversation ||
                message.message?.extendedTextMessage?.text ||
                '')
               .slice(1)
               .trim()
               .split(/\s+/)
               .slice(1);

  if (!configManager.config.users[number]) return;

  try {
    const opt = args.join(' ').toLowerCase();
    if (opt.includes('on')) {
      configManager.config.users[number].response = true;
      configManager.save();
      await client.sendMessage(jid, {
        text: 'Les notifications automatiques ont été honorablement activées. 🎩'
      });
    } else if (opt.includes('off')) {
      configManager.config.users[number].response = false;
      configManager.save();
      await client.sendMessage(jid, {
        text: 'Les notifications automatiques ont été poliment désactivées. 🎩'
      });
    } else {
      await client.sendMessage(jid, {
        text: 'Veuillez choisir une option distinguée : on / off.'
      });
    }
  } catch (err) {
    console.error("Erreur tagoption :", err);
    await client.sendMessage(jid, {
      text: 'Une erreur est survenue lors du réglage des options.'
    });
  }
}

export async function respond(message, client) {
  const number     = client.user.id.split(':')[0];
  const remoteJid  = message.key.remoteJid;
  const msgBody    = message.message?.extendedTextMessage?.text ||
                     message.message?.conversation ||
                     '';

  if (!configManager.config?.users[number]) return;

  const tagRespond = configManager.config.users[number]?.response;
  if (message.key.fromMe || !tagRespond || !msgBody.includes(`@${number}`)) return;

  console.log('✅ Tag détecté – réponse audio en cours…');

  try {
    const inputAudio = configManager.config.users[number]?.tagAudioPath || 'tag.mp3';

    if (existsSync(inputAudio)) {
      await client.sendMessage(remoteJid, {
        audio: { url: inputAudio },
        mimetype: 'audio/mpeg',
        ptt: true,
        contextInfo: {
          stanzaId: message.key.id,
          participant: message.key.participant || remoteJid,
          quotedMessage: message.message
        }
      });
      console.log('✅ Réponse audio envoyée');
    } else {
      console.log('❌ Fichier audio non trouvé :', inputAudio);
      await client.sendMessage(remoteJid, {
        text: `🎵 *Bip!* Votre mention a été honorée.\n\n${BOT_SIGNATURE}`,
        contextInfo: {
          stanzaId: message.key.id,
          participant: message.key.participant || remoteJid,
          quotedMessage: message.message
        }
      });
    }
  } catch (error) {
    console.error('❌ Erreur réponse audio :', error);
    await client.sendMessage(remoteJid, {
      text: `❌ Une erreur est survenue lors de la réponse audio.\n\n${BOT_SIGNATURE}`
    });
  }
}

// ── 7. Export unique -------------------------------------------------------
export default { tagall, tagadmin, tag, respond, settag, tagoption };
                                         
