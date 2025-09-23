//──────────────────────────────//
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Commande Facebook
//──────────────────────────────//

import axios from 'axios';

export async function facebook(message, client) {
  const remoteJid = message.key.remoteJid;
  const messageBody = (
    message.message?.extendedTextMessage?.text ||
    message.message?.conversation ||
    ''
  ).trim();

  const url = extractFacebookUrl(messageBody);

  if (!url) {
    return await client.sendMessage(remoteJid, {
      text: `❌ Veuillez fournir un lien Facebook valide.\nEx: https://www.facebook.com/watch/?v=123456789`,
      quoted: message
    });
  }

  try {
    await client.sendMessage(remoteJid, {
      text: `
> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │     📘 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐫 📘
> │        _🎯 𝐏𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠..._    
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> ${url}`,
      quoted: message
    });

    console.log(`⏳ Fetching Facebook video from: ${url}`);

    const apiUrl = `https://apis.davidcyriltech.my.id/download/facebook?url=${encodeURIComponent(url)}`;
    const { data } = await axios.get(apiUrl, { timeout: 20000 });

    if (!data.success || !data.results?.hd) {
      throw new Error('Impossible de récupérer la vidéo depuis l\'API.');
    }

    const { hd, sd } = data.results;
    const videoUrl = hd || sd;

    await client.sendMessage(remoteJid, {
      video: { url: videoUrl },
      mimetype: 'video/mp4',
      caption: `
> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │     🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴 
> │     _𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐕𝐢𝐝𝐞𝐨 𝐑𝐞𝐚𝐝𝐲_
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> Facebook video downloaded!`,
      quoted: message
    });

    console.log('✅ Facebook video sent successfully.');

  } catch (err) {
    console.error('❌ Error in Facebook command:', err);
    await client.sendMessage(remoteJid, {
      text: `❌ Échec du téléchargement Facebook:\n> ${err.message}`,
      quoted: message
    });
  }
}

function extractFacebookUrl(text) {
  if (!text) return null;
  
  const facebookRegex = /(https?:\/\/)?(www\.|m\.)?(facebook\.com|fb\.watch)\/[^\s]+/i;
  const match = text.match(facebookRegex);
  
  return match ? match[0] : null;
}

export default facebook;
