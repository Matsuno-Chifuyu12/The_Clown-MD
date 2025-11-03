// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// media.js  
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴
// The Ultimate WhatsApp Experience
// Commande : media.js
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

// ── 1. Import sécurisé de baileys ---------------------------------------
let pkg;
try {
  pkg = await import('baileys');
} catch (e) {
  console.error('❌  Le module « baileys » est introuvable. Lancez « npm install ».');
  process.exit(1);
}
const { downloadMediaMessage } = pkg;

const execAsync = promisify(exec);

// ── 2. Sticker → Photo --------------------------------------------------
export async function photo(message, client) {
  try {
    const remoteJid = message.key.remoteJid;
    const quoted    = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const target    = quoted?.stickerMessage;

    if (!target) {
      return await client.sendMessage(remoteJid, { text: '⚠️ Aucun sticker trouvé.' });
    }

    const buffer = await downloadMediaMessage(
      { key: message.key, message: quoted },
      'buffer',
      {}
    );

    const tempDir = './assets/temp';
    await fs.promises.mkdir(tempDir, { recursive: true });

    const filename = path.join(tempDir, `sticker-${Date.now()}.png`);
    await fs.promises.writeFile(filename, buffer);

    await client.sendMessage(remoteJid, {
      image: { url: filename },
      caption: '✨ Converti avec succès\n> 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴'
    });

    await fs.promises.unlink(filename);
  } catch (e) {
    console.error('Erreur photo :', e);
    await client.sendMessage(message.key.remoteJid, {
      text: '❌ Erreur lors de la conversion du sticker en image.'
    });
  }
}

// ── 3. Vidéo → MP3 ------------------------------------------------------
export async function tomp3(message, client) {
  try {
    const remoteJid = message.key.remoteJid;
    const quoted    = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const target    = quoted?.videoMessage;

    if (!target) {
      return await client.sendMessage(remoteJid, { text: '⚠️ Aucune vidéo trouvée.' });
    }

    const buffer = await downloadMediaMessage(
      { key: message.key, message: quoted },
      'buffer',
      {}
    );

    const tempDir = './assets/temp';
    await fs.promises.mkdir(tempDir, { recursive: true });

    const inputPath  = path.join(tempDir, `video-${Date.now()}.mp4`);
    const outputPath = path.join(tempDir, `audio-${Date.now()}.mp3`);

    await fs.promises.writeFile(inputPath, buffer);

    await execAsync(
      `ffmpeg -i "${inputPath}" -vn -ab 128k -ar 44100 -y "${outputPath}"`
    );

    await client.sendMessage(remoteJid, {
      audio: { url: outputPath },
      mimetype: 'audio/mp4',
      ptt: false
    });

    await fs.promises.unlink(inputPath);
    await fs.promises.unlink(outputPath);
  } catch (e) {
    console.error('Erreur tomp3 :', e);
    await client.sendMessage(message.key.remoteJid, {
      text: '❌ Erreur lors de la conversion vidéo → audio.'
    });
  }
}

// ── 4. Export unique ----------------------------------------------------
export default { photo, tomp3 };
                                      
