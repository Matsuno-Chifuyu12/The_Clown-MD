// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// WhatsApp Bot Session Starter (Optimized)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { makeWASocket, useMultiFileAuthState, DisconnectReason } from 'baileys';
import configManager from '../utils/managerConfigs.js';
import readline from 'readline';
import startSession from '../utils/connector.js';

// Cache config global
let configCache = null;
async function getConfig() {
    if (!configCache) configCache = configManager.config;
    return configCache;
}

// Prompt pour demander un numéro
function promptUserNumber() {
    return new Promise((resolve) => {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl.question('', (number) => {
            rl.close();
            resolve(number.trim());
        });
    });
}

// Connexion WhatsApp
async function connectToWhatsApp(handleMessage) {
    const banner = [
        "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮",
        "│                                                        │",
        "│   ██████╗  █████╗ ███╗   ███╗███████╗██████╗    │",
        "│  ██╔════╝ ██╔══██╗████╗ ████║██╔════╝██╔══██╗  │",
        "│  ██║  ███╗███████║██╔████╔██║█████╗  ██████╔╝  │",
        "│  ██║   ██║██╔══██║██║╚██╔╝██║██╔══╝  ██╔══██╗  │",
        "│  ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗██║  ██║  │",
        "│   ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝   │",
        "│                                                       │",
        "│          🎴 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗞𝗨𝗥𝗢𝗡𝗔-𝗠𝗗 🎴               │",
        "│      💠 𝗧𝗛𝗘 𝗨𝗟𝗧𝗜𝗠𝗔𝗧𝗘 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗘𝗫𝗣𝗘𝗥𝗜𝗘𝗡𝗖𝗘 💠.       │",
        "╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
    ];

    const asciiArt = banner.join('\n').trim();  // ✅ CORRECTION ICI

    console.log(asciiArt);
    console.log("📲 Enter your WhatsApp number (with country code, e.g., 237xxxx): ");

    try {
        const config = await getConfig();
        const primary = config?.users?.root?.primary;

        if (!primary) {
            const number = await promptUserNumber();
            await startSession(number, handleMessage, true);
        } else {
            await startSession(primary, handleMessage, false);
        }
    } catch (error) {
        console.error('❌ Configuration error:', error.message);
        process.exit(1);
    }
}

export default connectToWhatsApp;
