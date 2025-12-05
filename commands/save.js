// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ //
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝐼𝛮𝑭𝛩🎴  –  version corrigée & complète
// save.js – Gestion des médias ViewOnce et sauvegarde intelligente
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ //

import { normalizeMessageContent } from '../messages/normalizeContent.js';
import fs from 'fs';
import path from 'path';

// ── 1. Import sécurisé de baileys ---------------------------------------
let pkg;
try {
  pkg = await import('@whiskeysockets/baileys');
} catch (e) {
  console.error('❌  Le module « baileys » est introuvable. Lancez « npm install ».');
  process.exit(1);
}
const { downloadMediaMessage } = pkg;

// ── 2. Commande principale ----------------------------------------------
export async function save(message, client) {
  try {
    const remoteJid = message.key.remoteJid;
    const botJid    = client.user.id.split(':')[0] + '@s.whatsapp.net';
    const context   = message.message?.extendedTextMessage?.contextInfo;
    const quotedMsg = context?.quotedMessage;
    const quotedId  = context?.stanzaId;
    const quotedJid = context?.participant || remoteJid;

    if (!quotedMsg) {
      return await client.sendMessage(remoteJid, {
        text: '_Aucun message cité détecté pour sauvegarde._'
      });
    }

    // Détection ViewOnce
    const isViewOnce =
      quotedMsg?.imageMessage?.viewOnce ||
      quotedMsg?.videoMessage?.viewOnce ||
      quotedMsg?.audioMessage?.viewOnce;

    // Forward classique si pas ViewOnce
    if (!isViewOnce) {
      const forwardData = {
        key: { remoteJid: quotedJid, fromMe: false, id: quotedId },
        message: quotedMsg
      };
      return await client.sendMessage(botJid, { forward: forwardData });
    }

    // Normalisation + désactivation ViewOnce
    const content = normalizeMessageContent(quotedMsg);
    const disableViewOnce = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      for (const k in obj) {
        if (k === 'viewOnce') obj[k] = false;
        else if (typeof obj[k] === 'object') disableViewOnce(obj[k]);
      }
    };
    disableViewOnce(content);

    let type = '', tempPath = '', sendOpt = {};
    if (content?.imageMessage) {
      type = 'image';
      tempPath = path.join('./assets/temp', `vo_image_${Date.now()}.jpg`);
      sendOpt = { image: { url: tempPath } };
    } else if (content?.videoMessage) {
      type = 'video';
      tempPath = path.join('./assets/temp', `vo_video_${Date.now()}.mp4`);
      sendOpt = { video: { url: tempPath } };
    } else if (content?.audioMessage) {
      type = 'audio';
      tempPath = path.join('./assets/temp', `vo_audio_${Date.now()}.mp3`);
      sendOpt = { audio: { url: tempPath } };
    } else {
      return await client.sendMessage(remoteJid, {
        text: '_Aucun média compatible ViewOnce trouvé._'
      });
    }

    // Téléchargement + sauvegarde temporaire
    const buffer = await downloadMediaMessage({ message: content }, 'buffer', {});
    if (!buffer) throw new Error('Échec du téléchargement du média ViewOnce.');
    await fs.promises.mkdir(path.dirname(tempPath), { recursive: true });
    await fs.promises.writeFile(tempPath, buffer);

    // Envoi au bot
    await client.sendMessage(botJid, sendOpt);
    // Nettoyage
    await fs.promises.unlink(tempPath);
  } catch (err) {
    console.error('🎴 Save.js Error:', err);
    await client.sendMessage(message.key.remoteJid, {
      text: '_Une erreur est survenue lors du traitement du message ViewOnce._'
    });
  }
}

// ── 3. Export unique ----------------------------------------------------
export default save;
