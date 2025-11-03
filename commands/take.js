// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// take.js  –  version corrigée & complète
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
//  The Ultimate WhatsApp Experience
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { Sticker, StickerTypes } from 'wa-sticker-formatter';
import fs from 'fs';
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

// ── 2. Commande principale ----------------------------------------------
export async function take(message, client) {
  const remoteJid = message.key.remoteJid;

  try {
    const messageBody =
      message.message?.extendedTextMessage?.text ||
      message.message?.conversation ||
      '';
    const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    // Extraction pack / author
    const args = messageBody.slice(1).trim().split(/\s+/).slice(1);
    let author = message.pushName || '🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴';
    let pack   = author;
    if (args.length) {
      pack = args.join(' ');
      author = pack;
    }

    // Vérification sticker cité
    if (!quotedMessage?.stickerMessage) {
      return client.sendMessage(remoteJid, {
        text: '❌ Réponds à un sticker pour le modifier !'
      });
    }

    // Téléchargement
    const stickerBuffer = await downloadMediaMessage(
      { message: quotedMessage },
      'buffer',
      {}
    );
    if (!stickerBuffer) {
      return client.sendMessage(remoteJid, {
        text: '❌ Impossible de télécharger le sticker !'
      });
    }

    // Fichier temporaire
    const tempDir  = path.join('./temp');
    const tempPath = path.join(tempDir, `sticker_${Date.now()}.webp`);
    await fs.promises.mkdir(tempDir, { recursive: true });
    await fs.promises.writeFile(tempPath, stickerBuffer);

    // Détection animation
    const isAnimated = quotedMessage.stickerMessage.isAnimated || false;

    // Création sticker personnalisé
    const sticker = new Sticker(tempPath, {
      pack,
      author,
      type: isAnimated ? StickerTypes.FULL : StickerTypes.DEFAULT,
      quality: 95,
      animated: isAnimated,
      background: '#FFFFFF'
    });

    const stickerMsg = await sticker.toMessage();

    // Envoi
    await client.sendMessage(remoteJid, stickerMsg);

    // Nettoyage
    await fs.promises.unlink(tempPath);

    console.log(
      `✅ Sticker modifié | Pack: "${pack}" | Author: "${author}" | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴`
    );
  } catch (error) {
    console.error('❌ Erreur take.js :', error);
    await client.sendMessage(remoteJid, {
      text: '⚠️ Une erreur est survenue lors de la modification du sticker.'
    });
  }
}

// ── 3. Export unique ----------------------------------------------------
export default take;
