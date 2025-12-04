// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// WhatsApp Bot Session Starter
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import readline from 'readline';
import configManager from '../utils/managerConfigs.js';
import startSession from '../utils/connector.js';

// ── 1. Sécurise l’import de baileys ------------------------------------------
let pkg;
try {
  pkg = await import('@whiskeysockets/baileys');
} catch (err) {
  console.error('❌  Erreur critique : le module « baileys » est introuvable.');
  console.error('    → Lancez « npm install » puis relancez le conteneur.');
  process.exit(1);
}
const { makeWASocket, useMultiFileAuthState, DisconnectReason } = pkg;

// ── 2. Cache config global ---------------------------------------------------
let configCache = null;
async function getConfig() {
  if (!configCache) configCache = configManager.config;
  return configCache;
}

// ── 3. Prompt simple pour saisir un numéro ----------------------------------
function promptUserNumber() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('📲  Entrez votre numéro WhatsApp (avec indicatif, ex: 2376xxxx) : ', (num) => {
      rl.close();
      resolve(num.trim());
    });
  });
}

// ── 4. Connexion principale --------------------------------------------------
async function connectToWhatsApp(handleMessage) {
  const banner = [
    '╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮',
    '│',
    '│   ██████╗  █████╗ ███╗   ███╗███████╗██████╗',
    '│  ██╔════╝ ██╔══██╗████╗ ████║██╔════╝██╔══██╗',
    '│  ██║  ███╗███████║██╔████╔██║█████╗  ██████╔╝',
    '│  ██║   ██║██╔══██║██║╚██╔╝██║██╔══╝  ██╔══██╗',
    '│  ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗██║  ██║',
    '│   ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝',
    '│',
    '│          🎴 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗞𝗨𝗥𝗢𝗡𝗔-𝗠𝗗 🎴',
    '│      💠 𝗧𝗛𝗘 𝗨𝗟𝗧𝗜𝗠𝗔𝗧𝗘 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗘𝗫𝗣𝗘𝗥𝗜𝗘𝗡𝗖𝗘 💠',
    '╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯'
  ].join('\n');

  console.log(banner);

  try {
    const config   = await getConfig();
    const primary  = config?.users?.root?.primary;

    if (!primary) {
      const number = await promptUserNumber();
      await startSession(number, handleMessage, true);
    } else {
      await startSession(primary, handleMessage, false);
    }
  } catch (error) {
    console.error('❌  Erreur de configuration :', error.message);
    process.exit(1);
  }
}

export default connectToWhatsApp;
