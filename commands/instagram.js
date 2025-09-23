//──────────────────────────────//
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Commande Instagram
//──────────────────────────────//

import axios from 'axios';

export async function instagram(message, client) {
  const remoteJid = message.key.remoteJid;
  const messageBody = (
    message.message?.extendedTextMessage?.text ||
    message.message?.conversation ||
    ''
  ).trim();

  const url = extractInstagramUrl(messageBody);

  if (!url) {
    return await client.sendMessage(remoteJid, {
      text: `❌ Veuillez fournir un lien Instagram valide.\nEx: https://www.instagram.com/p/ABC123/`,
      quoted: message
    });
  }

  try {
    await client.sendMessage(remoteJid, {
      text: `
> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │     📸 𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐫 📸
> │        _🎯 𝐏𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠..._    
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> ${url}`,
      quoted: message
    });

    console.log(`⏳ Fetching Instagram media from: ${url}`);

    const apiUrl = `https://apis.davidcyriltech.my.id/download/instagram?url=${encodeURIComponent(url)}`;
    const { data } = await axios.get(apiUrl, { timeout: 20000 });

    if (!data.success || !data.results) {
      throw new Error('Impossible de récupérer le média depuis l\'API.');
    }

    const { results } = data;

    // Gérer les posts multiples (carousel)
    if (results.length > 1) {
      for (let i = 0; i < results.length; i++) {
        const media = results[i];
        if (media.type === 'video') {
          await client.sendMessage(remoteJid, {
            video: { url: media.url },
            mimetype: 'video/mp4',
            caption: i === 0 ? `📸 Instagram Carousel (${i+1}/${results.length})` : ''
          });
        } else {
          await client.sendMessage(remoteJid, {
            image: { url: media.url },
            caption: i === 0 ? `📸 Instagram Carousel (${i+1}/${results.length})` : ''
          });
        }
        // Petit délai entre les envois
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } else {
      // Post simple
      const media = results[0];
      if (media.type === 'video') {
        await client.sendMessage(remoteJid, {
          video: { url: media.url },
          mimetype: 'video/mp4',
          caption: `
> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │     🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴 
> │    _𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐕𝐢𝐝𝐞𝐨 𝐑𝐞𝐚𝐝𝐲_
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> Instagram video downloaded!`
        });
      } else {
        await client.sendMessage(remoteJid, {
          image: { url: media.url },
          caption: `
> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │     🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴 
> │    _𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 𝐈𝐦𝐚𝐠𝐞 𝐑𝐞𝐚𝐝𝐲_
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> Instagram image downloaded!`
        });
      }
    }

    console.log('✅ Instagram media sent successfully.');

  } catch (err) {
    console.error('❌ Error in Instagram command:', err);
    await client.sendMessage(remoteJid, {
      text: `❌ Échec du téléchargement Instagram:\n> ${err.message}`,
      quoted: message
    });
  }
}

function extractInstagramUrl(text) {
  if (!text) return null;
  
  const instagramRegex = /(https?:\/\/)?(www\.)?instagram\.com\/(p|reel|stories)\/[^\s]+/i;
  const match = text.match(instagramRegex);
  
  return match ? match[0] : null;
}

export default instagram;
