// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// device.js  –  version corrigée & complète
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Commande : Device Identification
// Dev : kurona🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── 1. Import sécurisé de baileys ---------------------------------------
let pkg;
try {
  pkg = await import('@whiskeysockets/baileys');
} catch (e) {
  console.error('❌  Le module « baileys » est introuvable. Lancez « npm install ».');
  process.exit(1);
}
const { getDevice } = pkg;

// ── 2. Commande principale ----------------------------------------------
async function device(message, client) {
  const remoteJid = message.key?.remoteJid;

  try {
    const quotedInfo = message.message?.extendedTextMessage?.contextInfo;

    if (!quotedInfo?.stanzaId) {
      return client.sendMessage(remoteJid, {
        text: `╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴
│ 
│ ❌ Aucun message ciblé.
│ « Veuillez répondre à un message afin
│ que je puisse identifier le système utilisé. »
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`
      }, { quoted: message });
    }

    const quotedMessageId = quotedInfo.stanzaId;
    const deviceType      = getDevice(quotedMessageId) || 'Inconnu';

    await client.sendMessage(remoteJid, {
      text: `╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴
│ 
│ 🛰 **Analyse complète effectuée**
│ 
│ « L’expéditeur utilise actuellement
│ un système : *${deviceType}*.
│ 
│ ✅ Vérification terminée avec succès. »
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`
    }, { quoted: message });

    console.log(`╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│ 🔍 [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Système détecté → ${deviceType} | Message ID: ${quotedMessageId}
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`);

  } catch (error) {
    console.error(`╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│ ❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] Erreur device.js:
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`, error.message);

    await client.sendMessage(remoteJid, {
      text: `╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴
│ 
│ ❌ Erreur critique
│ « L’identification du système a échoué.
│ 
│ > ${error.message} »
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`
    }, { quoted: message });
  }
}

// ── 3. Export unique ----------------------------------------------------
export default device;
