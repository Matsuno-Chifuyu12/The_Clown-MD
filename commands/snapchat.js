//──────────────────────────────//
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Commande Snapchat
//──────────────────────────────//

import axios from 'axios';

export async function snapchat(message, client) {
  const remoteJid = message.key.remoteJid;
  const messageBody = (
    message.message?.extendedTextMessage?.text ||
    message.message?.conversation ||
    ''
  ).trim();

  const url = extractSnapchatUrl(messageBody);

  if (!url) {
    return await client.sendMessage(remoteJid, {
      text: `❌ Veuillez fournir un lien Snapchat Spotlight valide.\nEx: https://www.snapchat.com/spotlight/123456789`,
      quoted: message
    });
  }

  try {
    await client.sendMessage(remoteJid, {
      text: `
> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │     👻 𝐒𝐧𝐚𝐩𝐜𝐡𝐚𝐭 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐫 👻
> │        _🎯 𝐏𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠..._    
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> ${url}`,
      quoted: message
    });

    console.log(`⏳ Fetching Snapchat video from: ${url}`);

    const apiUrl = `https://apis.davidcyriltech.my.id/download/snapchat?url=${encodeURIComponent(url)}`;
    const { data } = await axios.get(apiUrl, { timeout: 20000 });

    if (!data.success || !data.results?.video) {
      throw new Error('Impossible de récupérer la vidéo depuis l\'API.');
    }

    const { video, thumbnail } = data.results;

    await client.sendMessage(remoteJid, {
      video: { url: video },
      mimetype: 'video/mp4',
      caption: `
> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │     🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴 
> │    _𝐒𝐧𝐚𝐩𝐜𝐡𝐚𝐭 𝐕𝐢𝐝𝐞𝐨 𝐑𝐞𝐚𝐝𝐲_
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> Snapchat Spotlight video!`,
      quoted: message
    });

    console.log('✅ Snapchat video sent successfully.');

  } catch (err) {
    console.error('❌ Error in Snapchat command:', err);
    await client.sendMessage(remoteJid, {
      text: `❌ Échec du téléchargement Snapchat:\n> ${err.message}`,
      quoted: message
    });
  }
}

function extractSnapchatUrl(text) {
  if (!text) return null;
  
  const snapchatRegex = /(https?:\/\/)?(www\.)?snapchat\.com\/[^\s]+/i;
  const match = text.match(snapchatRegex);
  
  return match ? match[0] : null;
}

export default snapchat;
