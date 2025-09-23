//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴 | playVideo.js
// Commande : playvideo — Recherche & envoie vidéo complète
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import axiosRetry from 'axios-retry';

// Réessayer automatiquement en cas d'échec
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export async function playVideo(messageObj, client) {
    const chatId = messageObj.key.remoteJid;

    const messageText = (
        messageObj.message?.extendedTextMessage?.text ||
        messageObj.message?.conversation?.trim() ||
        ''
    ).toLowerCase();

    try {
        const query = extractQuery(messageText);
        if (!query) {
            return await client.sendMessage(chatId, { text: '❌ Veuillez fournir un titre de vidéo.' });
        }

        const processId = uuidv4();
        console.log(`🎯 🎴𝛫𝑈𝑅𝛩𝛮𝛥 𝛲𝑳𝛥𝒀𝑉𝐼𝐷𝐸𝛩🎥🎴 | ${processId}] Recherche: ${query}`);
        await client.sendMessage(chatId, { text: `>_*Recherche en cours pour : ${query}*_\n> ID: ${processId}`, quoted: messageObj });

        const apiUrl = `https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(query)}`;
        const { data } = await axios.get(apiUrl);

        if (!data?.status || !data?.result || !data.result.video_url) {
            throw new Error('Vidéo introuvable ou URL manquante.');
        }

        const video = data.result;

        console.log(`🎴𝛫𝑈𝑅𝛩𝛮𝛥 𝛲𝑳𝛥𝒀𝑉𝐼𝐷𝐸𝛩🎥🎴 | ${processId}] Préparation de la vidéo`);

        // Envoi de la vidéo complète avec légende
        await client.sendMessage(chatId, {
            video: { url: video.video_url },
            caption: 
`> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │        🎴𝛫𝑈𝑅𝛩𝛮𝛥 𝛲𝑳𝛥𝒀𝛯𝑹🎵🎴 
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> │  ♧𝐓𝐢𝐭𝐫𝐞 : *${video.title || 'Inconnu'}*
> │  ♤𝐃𝐮𝐫é𝐞 : ${video.duration || 'N/A'}
> │  ♡𝐕𝐮𝐞𝐬 : ${video.views || 'N/A'}
> │  ♢𝐋𝐢𝐞𝐧 : ${video.video_url || 'Non disponible'}
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> 🎴 ℬ𝓎  𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴`,
            quoted: messageObj
        });

        // Ensuite envoi de l'audio séparé
        await client.sendMessage(chatId, {
            audio: { url: video.audio_url },
            mimetype: 'audio/mp4',
            ptt: false,
            quoted: messageObj
        });
            

        console.log(`✅🎴𝛫𝑈𝑅𝛩𝛮𝛥 𝛲𝑳𝛥𝒀𝑉𝐼𝐷𝐸𝛩🎥🎴 | ${processId}] Envoi terminé`);

    } catch (error) {
        console.error(`❌ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 𝛲𝑳𝛥𝒀𝑉𝐼𝐷𝐸𝛩🎥🎴| ERROR]:`, error);
        await client.sendMessage(chatId, { text: `❌ Impossible de lire la vidéo : ${error.message}` });
    }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Extraction de l'argument de la commande
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function extractQuery(text) {
    const parts = text.trim().split(/\s+/);
    return parts.length > 1 ? parts.slice(1).join(' ') : null;
}

export default playVideo;
