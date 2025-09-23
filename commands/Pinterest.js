//──────────────────────────────//
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Commande Pinterest
//──────────────────────────────//

import axios from 'axios';

export async function pinterest(message, client) {
  const remoteJid = message.key.remoteJid;
  const messageBody = (
    message.message?.extendedTextMessage?.text ||
    message.message?.conversation ||
    ''
  ).trim();

  const url = extractPinterestUrl(messageBody);

  if (!url) {
    return await client.sendMessage(remoteJid, {
      text: `❌ Veuillez fournir un lien Pinterest valide.\nEx: https://www.pinterest.com/pin/123456789/`,
      quoted: message
    });
  }

  try {
    await client.sendMessage(remoteJid, {
      text: `
> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │     📌 𝐏𝐢𝐧𝐭𝐞𝐫𝐞𝐬𝐭 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐫 📌
> │        _🎯 𝐏𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠..._    
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> ${url}`,
      quoted: message
    });

    console.log(`⏳ Fetching Pinterest media from: ${url}`);

    const apiUrl = `https://apis.davidcyriltech.my.id/download/pinterest?url=${encodeURIComponent(url)}`;
    const { data } = await axios.get(apiUrl, { timeout: 20000 });

    if (!data.success || !data.results) {
      throw new Error('Impossible de récupérer le média depuis l\'API.');
    }

    const { results } = data;

    if (results.type === 'video') {
      await client.sendMessage(remoteJid, {
        video: { url: results.url },
        mimetype: 'video/mp4',
        caption: `
> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │     🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴 
> │    _𝐏𝐢𝐧𝐭𝐞𝐫𝐞𝐬𝐭 𝐕𝐢𝐝𝐞𝐨 𝐑𝐞𝐚𝐝𝐲_
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> Pinterest video downloaded!`
      });
    } else {
      await client.sendMessage(remoteJid, {
        image: { url: results.url },
        caption: `
> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │     🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴 
> │    _𝐏𝐢𝐧𝐭𝐞𝐫𝐞𝐬𝐭 𝐈𝐦𝐚𝐠𝐞 𝐑𝐞𝐚𝐝𝐲_
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> Pinterest image downloaded!`
      });
    }

    console.log('✅ Pinterest media sent successfully.');

  } catch (err) {
    console.error('❌ Error in Pinterest command:', err);
    await client.sendMessage(remoteJid, {
      text: `❌ Échec du téléchargement Pinterest:\n> ${err.message}`,
      quoted: message
    });
  }
}

function extractPinterestUrl(text) {
  if (!text) return null;
  
  const pinterestRegex = /(https?:\/\/)?(www\.)?pinterest\.com?(\.fr)?\/pin\/[^\s]+/i;
  const match = text.match(pinterestRegex);
  
  return match ? match[0] : null;
}

export default pinterest;
