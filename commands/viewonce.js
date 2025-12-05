// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// viewonce.js  –  version corrigée & complète
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Commande : Révélation des Médias Éphémères
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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

// ── 2. Cache & constantes -----------------------------------------------
const mediaCache = new Map();          // buffer + timestamp
const CACHE_TTL  = 5 * 60 * 1000;      // 5 min

// ── 3. Commande principale ----------------------------------------------
export async function viewonce(message, client) {
  const remoteJid = message.key.remoteJid;

  try {
    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted) {
      return client.sendMessage(remoteJid, {
        text: `🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴\n\n❌ Aucun message ciblé\n« Veuillez répondre à un média éphémère pour que je puisse procéder à sa révélation, Monsieur / Madame. »`,
        quoted: message
      });
    }

    const mediaType = detectViewOnceMedia(quoted);
    if (!mediaType) {
      return client.sendMessage(remoteJid, {
        text: `🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴\n\n🔍 Média non éphémère\n« Le message sélectionné ne semble pas être un média à visualisation unique.\n\nJe ne peux révéler que les médias éphémères. »`,
        quoted: message
      });
    }

    console.log(`👁️  Révélation média ${mediaType} demandée | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴`);

    // Cache ?
    const cacheKey = `${message.key.id}_${mediaType}`;
    const cached   = mediaCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      await sendCachedMedia(client, remoteJid, cached, mediaType, message);
      return;
    }

    // Révélation
    await revealViewOnceMedia(quoted, client, remoteJid, mediaType, message, cacheKey);

  } catch (error) {
    console.error('💥 Erreur révélation média éphémère :', error.message);
    await client.sendMessage(remoteJid, {
      text: `🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴\n\n❌ Révélation échouée\n« Je m’excuse, mais la révélation du média éphémère a rencontré une difficulté.\n\nDétail : ${error.message} »`,
      quoted: message
    });
  }
}

// ── 4. Détection du type de média éphémère ------------------------------
function detectViewOnceMedia(quoted) {
  if (quoted?.imageMessage?.viewOnce)  return 'image';
  if (quoted?.videoMessage?.viewOnce)  return 'video';
  if (quoted?.audioMessage?.viewOnce)  return 'audio';
  return null;
}

// ── 5. Révélation proprement dite ---------------------------------------
async function revealViewOnceMedia(quoted, client, remoteJid, mediaType, originalMessage, cacheKey) {
  await client.sendMessage(remoteJid, {
    text: `> 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴\n\n⚡ Révélation en cours…\n« Je procède à la révélation de ce média ${mediaType} avec la plus grande discrétion. »`,
    quoted: originalMessage
  });

  // Normalisation + désactivation du flag viewOnce
  const content = normalizeMessageContent(quoted);
  disableViewOnceProtection(content);

  // Téléchargement
  const mediaBuffer = await downloadMediaMessage({ message: content }, 'buffer', {});
  if (!mediaBuffer) throw new Error('Échec du téléchargement du média');

  // Fichier temporaire
  const ext         = getFileExtension(mediaType);
  const tempPath    = path.resolve(`./temp_revealed_${Date.now()}.${ext}`);
  fs.writeFileSync(tempPath, mediaBuffer);

  // Envoi
  const mediaConfig = getMediaConfig(mediaType, tempPath);
  await client.sendMessage(remoteJid, {
    ...mediaConfig,
    caption: `🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴\n\n🔓 Média éphémère révélé\n« Voici le contenu qui était destiné à rester éphémère.\n\nType : ${mediaType.toUpperCase()} | Révélé avec élégance. »`
  }, { quoted: originalMessage });

  // Cache + nettoyage
  mediaCache.set(cacheKey, { buffer: mediaBuffer, type: mediaType, timestamp: Date.now() });
  fs.unlinkSync(tempPath);

  console.log(`✅ Média ${mediaType} révélé avec succès | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴`);
}

// ── 6. Envoi depuis le cache --------------------------------------------
async function sendCachedMedia(client, remoteJid, cached, mediaType, originalMessage) {
  const tempPath = path.resolve(`./temp_cached_${Date.now()}.${getFileExtension(mediaType)}`);
  fs.writeFileSync(tempPath, cached.buffer);

  const mediaConfig = getMediaConfig(mediaType, tempPath);
  await client.sendMessage(remoteJid, {
    ...mediaConfig,
    caption: `🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴\n\n💫 Média depuis les archives\n« Ce média avait déjà été révélé précédemment.\n\nServi depuis le cache pour plus de célérité. »`
  }, { quoted: originalMessage });

  fs.unlinkSync(tempPath);
  console.log(`♻️  Média ${mediaType} servi depuis le cache | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴`);
}

// ── 7. Désactivation récursive du flag viewOnce -------------------------
function disableViewOnceProtection(obj) {
  const recurse = (o) => {
    if (typeof o !== 'object' || o === null) return;
    for (const k of Object.keys(o)) {
      if (k === 'viewOnce' && typeof o[k] === 'boolean') o[k] = false;
      else if (typeof o[k] === 'object') recurse(o[k]);
    }
  };
  recurse(obj);
}

// ── 8. Extensions & configs ---------------------------------------------
function getFileExtension(mediaType) {
  return { image: 'jpeg', video: 'mp4', audio: 'mp3' }[mediaType] || 'bin';
}

function getMediaConfig(mediaType, filePath) {
  return {
    image: { image: { url: filePath } },
    video: { video: { url: filePath } },
    audio: { audio: { url: filePath }, mimetype: 'audio/mp4' }
  }[mediaType] || {};
}

// ── 9. Nettoyage périodique du cache -------------------------------------
function cleanupMediaCache() {
  const now = Date.now();
  let cleaned = 0;
  for (const [k, v] of mediaCache.entries()) {
    if (now - v.timestamp > CACHE_TTL) {
      mediaCache.delete(k);
      cleaned++;
    }
  }
  if (cleaned > 0) console.log(`🧹  ${cleaned} médias nettoyés du cache | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴`);
}
setInterval(cleanupMediaCache, 600_000);

// ── 10. Export unique ----------------------------------------------------
export default viewonce;
