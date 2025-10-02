// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Commande : Révélation des Médias Éphémères
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { normalizeMessageContent } from '../messages/normalizeContent.js';
import pkg from 'baileys';
const { downloadMediaMessage } = pkg;
import fs from 'fs';
import path from 'path';

// Cache des médias traités pour performance
const mediaCache = new Map();
const CACHE_TTL = 300000; // 5 minutes

export async function viewonce(message, client) {
    const remoteJid = message.key.remoteJid;
    
    try {
        // Vérification protocolaire du message cité
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quotedMessage) {
            await client.sendMessage(remoteJid, {
                text: `🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴\n\n❌ Aucun message ciblé\n"Veuillez répondre à un média éphémère pour que je puisse procéder à sa révélation, Monsieur/Madame."`,
                quoted: message
            });
            return;
        }

        // Détection élégante du média éphémère
        const mediaType = detectViewOnceMedia(quotedMessage);
        
        if (!mediaType) {
            await client.sendMessage(remoteJid, {
                text: `🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴\n\n🔍 Média non éphémère\n"Le message sélectionné ne semble pas être un média à visualisation unique.\n\nJe ne peux révéler que les médias éphémères."`,
                quoted: message
            });
            return;
        }

        console.log(`👁️ Révélation média ${mediaType} demandée | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴`);

        // Vérification du cache pour optimisation
        const cacheKey = `${message.key.id}_${mediaType}`;
        const cachedMedia = mediaCache.get(cacheKey);
        
        if (cachedMedia && (Date.now() - cachedMedia.timestamp) < CACHE_TTL) {
            await sendCachedMedia(client, remoteJid, cachedMedia, mediaType, message);
            return;
        }

        // Révélation protocolaire du média
        await revealViewOnceMedia(quotedMessage, client, remoteJid, mediaType, message, cacheKey);

    } catch (error) {
        console.error('💥 Erreur révélation média éphémère:', error.message);
        
        await client.sendMessage(remoteJid, {
            text: `🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴\n\n❌ Révélation échouée\n"Je m'excuse, mais la révélation du média éphémère a rencontré une difficulté.\n\nDétail: ${error.message}"`,
            quoted: message
        });
    }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 Fonctions 
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function detectViewOnceMedia(quotedMessage) {
    if (quotedMessage?.imageMessage?.viewOnce) return 'image';
    if (quotedMessage?.videoMessage?.viewOnce) return 'video';
    if (quotedMessage?.audioMessage?.viewOnce) return 'audio';
    return null;
}

async function revealViewOnceMedia(quotedMessage, client, remoteJid, mediaType, originalMessage, cacheKey) {
    // Notification de traitement
    await client.sendMessage(remoteJid, {
        text: `> 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴\n\n⚡ Révélation en cours...\n"Je procède à la révélation de ce média ${mediaType} avec la plus grande discrétion."`,
        quoted: originalMessage
    });

    // Normalisation et modification du média
    const content = normalizeMessageContent(quotedMessage);
    disableViewOnceProtection(content);

    // Téléchargement du média
    const mediaBuffer = await downloadMediaMessage(
        { message: content },
        'buffer',
        {}
    );

    if (!mediaBuffer) {
        throw new Error('Échec du téléchargement du média');
    }

    // Sauvegarde temporaire 
    const fileExtension = getFileExtension(mediaType);
    const tempFilePath = path.resolve(`./temp_revealed_${Date.now()}.${fileExtension}`);
    
    fs.writeFileSync(tempFilePath, mediaBuffer);

    // Envoi protocolaire du média révélé
    const mediaConfig = getMediaConfig(mediaType, tempFilePath);
    await client.sendMessage(remoteJid, {
        ...mediaConfig,
        caption: `🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴\n\n🔓 Média éphémère révélé\n"Voici le contenu qui était destiné à rester éphémère.\n\nType: ${mediaType.toUpperCase()} | Révélé avec élégance."`
    }, { quoted: originalMessage });

    // Mise en cache 
    mediaCache.set(cacheKey, {
        buffer: mediaBuffer,
        type: mediaType,
        timestamp: Date.now()
    });

    // Nettoyage 
    fs.unlinkSync(tempFilePath);

    console.log(`✅ Média ${mediaType} révélé avec succès | 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴`);
}

async function sendCachedMedia(client, remoteJid, cachedMedia, mediaType, originalMessage) {
    const tempFilePath = path.resolve(`./temp_cached_${Date.now()}.${getFileExtension(mediaType)}`);
    
    fs.writeFileSync(tempFilePath, cachedMedia.buffer);

    const mediaConfig = getMediaConfig(mediaType, tempFilePath);
    await client.sendMessage(remoteJid, {
        ...mediaConfig,
        caption: `🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴\n\n💫 Média depuis les archives\n"Ce média avait déjà été révélé précédemment.\n\nServi depuis le cache pour plus de célérité."`
    }, { quoted: originalMessage });

    fs.unlinkSync(tempFilePath);
    
    console.log(`♻️ Média ${mediaType} servi depuis le cache | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴`);
}

function disableViewOnceProtection(content) {
    const disableRecursive = (obj) => {
        if (typeof obj !== 'object' || obj === null) return;
        
        Object.keys(obj).forEach(key => {
            if (key === 'viewOnce' && typeof obj[key] === 'boolean') {
                obj[key] = false;
            } else if (typeof obj[key] === 'object') {
                disableRecursive(obj[key]);
            }
        });
    };
    
    disableRecursive(content);
}

function getFileExtension(mediaType) {
    const extensions = {
        'image': 'jpeg',
        'video': 'mp4',
        'audio': 'mp3'
    };
    return extensions[mediaType] || 'bin';
}

function getMediaConfig(mediaType, filePath) {
    const configs = {
        'image': { image: { url: filePath } },
        'video': { video: { url: filePath } },
        'audio': { audio: { url: filePath }, mimetype: 'audio/mp4' }
    };
    return configs[mediaType] || {};
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 Nettoyage périodique du cache
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function cleanupMediaCache() {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [key, value] of mediaCache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
            mediaCache.delete(key);
            cleanedCount++;
        }
    }
    
    if (cleanedCount > 0) {
        console.log(`🧹 ${cleanedCount} médias nettoyés du cache | 𝓜𝓪𝓳𝓸𝓻𝓭𝓸𝓶𝓮 𝓢é𝓫𝓪𝓼𝓽𝓲𝓮𝓷 🎴`);
    }
}

// Nettoyage toutes les 10 minutes
setInterval(cleanupMediaCache, 600000);

export default viewonce;
