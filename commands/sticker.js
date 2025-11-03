// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// sticker.js  
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
//  The Ultimate WhatsApp Experience
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { Sticker, StickerTypes } from 'wa-sticker-formatter';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';

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
export async function sticker(message, client) {
  const remoteJid = message.key.remoteJid;
  const username  = message.pushName || 'Utilisateur';

  let tempInput  = null;
  let tempOutput = null;

  try {
    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted) {
      return client.sendMessage(remoteJid, {
        text: '❌ Répondez à une image ou vidéo pour la convertir en sticker !\n\nUtilisation : .sticker (en réponse à une image/vidéo)'
      });
    }

    const isVideo = !!quoted.videoMessage;
    const isImage = !!quoted.imageMessage;
    if (!isVideo && !isImage) {
      return client.sendMessage(remoteJid, {
        text: '❌ Le message cité doit être une image ou une vidéo !\n\nUtilisation : .sticker (en réponse à une image/vidéo)'
      });
    }

    // Message de traitement
    await client.sendMessage(remoteJid, {
      text: '🔄 Traitement en cours… Création de votre sticker 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 🎴'
    });

    // Téléchargement
    const mediaBuffer = await downloadMediaMessage(
      { key: message.key, message: quoted },
      'buffer',
      {}
    );
    if (!mediaBuffer) {
      return client.sendMessage(remoteJid, { text: '❌ Échec du téléchargement du média !' });
    }

    // Chemins temporaires
    const tempDir  = path.join(process.cwd(), 'assets', 'temp');
    const timestamp = Date.now();
    tempInput  = path.join(tempDir, isVideo ? `temp_video_${timestamp}.mp4` : `temp_image_${timestamp}.jpg`);
    tempOutput = path.join(tempDir, `temp_sticker_${timestamp}.webp`);

    await fs.mkdir(tempDir, { recursive: true });
    await fs.writeFile(tempInput, mediaBuffer);

    // Traitement
    if (isVideo) {
      console.log('⚙️ Traitement vidéo 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 🎴...');
      await processVideo(tempInput, tempOutput);
    } else {
      console.log('⚙️ Traitement image 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 🎴...');
      await sharp(tempInput)
        .resize(512, 512, {
          fit: 'inside',
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos3
        })
        .webp({ quality: 85, effort: 3 })
        .toFile(tempOutput);
    }

    // Création sticker KURONA
    const sticker = new Sticker(tempOutput, {
      pack: '🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴',
      author: `Par ${username}`,
      type: isVideo ? StickerTypes.FULL : StickerTypes.DEFAULT,
      quality: 90,
      animated: isVideo
    });

    const stickerMsg = await sticker.toMessage();
    await client.sendMessage(remoteJid, stickerMsg, { quoted: message });

    console.log(`✅ Sticker créé | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴 | ${username}`);
  } catch (error) {
    console.error('❌ Erreur sticker.js :', error);
    await client.sendMessage(remoteJid, {
      text: '⚠️ Erreur lors de la conversion en sticker. Veuillez réessayer.\n\nSi le problème persiste, contactez 🎴 𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴'
    });
  } finally {
    await cleanupFiles(tempInput, tempOutput);
  }
}

// ── 3. Traitement vidéo optimisé ----------------------------------------
async function processVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        '-vf',
        'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=yuv420p',
        '-c:v', 'libwebp',
        '-q:v', '60',
        '-preset', 'picture',
        '-loop', '0',
        '-an',
        '-vsync', '0',
        '-compression_level', '6',
        '-threads', '4'
      ])
      .on('start', (cmd) => console.log('🚀 ffmpeg start :', cmd))
      .on('progress', (p) => {
        if (p.percent) console.log(`📊 Progression : ${Math.round(p.percent)}%`);
      })
      .on('end', () => {
        console.log('✅ Conversion vidéo terminée');
        resolve();
      })
      .on('error', (err) => {
        console.error('❌ Erreur ffmpeg :', err);
        reject(err);
      })
      .save(outputPath);
  });
}

// ── 4. Nettoyage asynchrone ---------------------------------------------
async function cleanupFiles(...files) {
  for (const f of files) {
    if (f) {
      try {
        await fs.access(f);
        await fs.unlink(f);
        console.log(`🧹 Fichier temporaire supprimé : ${f}`);
      } catch {
        // ignoré – fichier déjà absent
      }
    }
  }
}

// ── 5. Export unique ----------------------------------------------------
export default sticker;
