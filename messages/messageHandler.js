// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴
// WhatsApp Incoming Message Handler
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from 'fs';
import * as commands from '../commands/index.js';
import configManager from '../utils/manageConfigs.js';
import auto from '../commands/auto.js';
import tag from '../commands/tag.js';
import group from '../commands/group.js';
import presence from '../commands/online.js';
import reactions from '../commands/reactions.js';
import statusLike from '../commands/statuslike.js';
import channelSender from '../commands/channelSender.js';
import pingCommand from '../commands/ping.js';
import info from '../commands/info.js';
import video from '../commands/video.js';
import viewonce from '../commands/viewonce.js';
import tiktok from '../commands/tiktok.js';
import react from '../commands/react.js';
import device from '../commands/device.js';
import sudo from '../commands/sudo.js';
import take from '../commands/take.js';
import update from '../update.js';
import getpp from '../commands/getpp.js';
import tourl from '../commands/tourl.js';
import sticker from '../commands/sticker.js';
import play from '../commands/play.js';
import connect from '../commands/connect.js';
import disconnect from '../commands/disconnect.js';
import sender from '../commands/sender.js';
import dlt from '../commands/dlt.js';
import save from '../commands/save.js';
import pp from '../commands/pp.js';
import prem from '../commands/prem-menu.js';
import premiums from '../commands/premiums.js';
import media from '../commands/media.js';
import set from '../commands/set.js';
import getconf from '../commands/getconfig.js';
import fancy from '../commands/fancy.js';
import owner from '../commands/owner.js';
import kurona from '../commands/kurona.js';
import img from '../commands/img.js';

// Cache des données statiques
export let creator = ["237683614362@s.whatsapp.net"];
export let premium = ["237683614362@s.whatsapp.net"];

// Cache pour les configurations utilisateur
const userConfigCache = new Map();
const CACHE_TTL = 30000; // 30 secondes

async function getUserConfig(number) {
    const cacheKey = number;
    const cached = userConfigCache.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        return cached.config;
    }

    const config = configManager.config?.users[number] || {};
    userConfigCache.set(cacheKey, { config, timestamp: Date.now() });
    return config;
}

// Fonction pour extraire le texte du message WhatsApp
function extractWhatsAppMessage(message) {
    if (message.message?.conversation) {
        return message.message.conversation;
    }
    if (message.message?.extendedTextMessage?.text) {
        return message.message.extendedTextMessage.text;
    }
    if (message.message?.imageMessage?.caption) {
        return message.message.imageMessage.caption;
    }
    if (message.message?.videoMessage?.caption) {
        return message.message.videoMessage.caption;
    }
    if (message.message?.buttonsResponseMessage?.selectedButtonId) {
        return message.message.buttonsResponseMessage.selectedButtonId;
    }
    if (message.message?.listResponseMessage?.title) {
        return message.message.listResponseMessage.title;
    }
    return '';
}

// Handler principal optimisé pour WhatsApp
export async function handleIncomingMessage(event, client) {
    const number = client.user?.id?.split(':')[0] || '';
    if (!number || !event.messages?.length) return;

    const messages = event.messages;
    const userConfig = await getUserConfig(number);
    const prefix = userConfig.prefix || '';

    // Traitement parallèle des messages
    await Promise.all(messages.map(async (message) => {
        if (!message.message || !message.key.remoteJid) return;

        try {
            await processSingleWhatsAppMessage(message, client, number, prefix, userConfig);
        } catch (error) {
            console.error('❌ Erreur traitement message WhatsApp:', error.message);
        }
    }));
}

// Traitement individuel des messages WhatsApp
async function processSingleWhatsAppMessage(message, client, number, prefix, userConfig) {
    const messageBody = extractWhatsAppMessage(message).toLowerCase();

    if (!messageBody) return;

    const remoteJid = message.key.remoteJid;
    const approvedUsers = userConfig.sudoList || [];
    const participant = message.key.participant ? message.key.participant.split("@")[0] : '';
    const remoteJidBase = remoteJid.split("@")[0];

    // Commandes automatiques (toujours exécutées)
    await Promise.all([
        auto.autotype(message, client),
        auto.autorecord(message, client),
        tag.respond(message, client, [userConfig.lid]),
        group.linkDetection(message, client, [userConfig.lid]),
        group.mentiondetect(message, client, [userConfig.lid]),
        presence(message, client, userConfig.online),
        statusLike(message, client, userConfig.like),
        reactions.auto(message, client, userConfig.autoreact, userConfig.emoji)
    ]);

    // Vérification des commandes avec préfixe
    if (messageBody.startsWith(prefix)) {
        await handlePrefixedWhatsAppCommand(message, client, number, prefix, approvedUsers, participant, remoteJidBase, userConfig);
    }
}

// Gestionnaire de commandes avec préfixe pour WhatsApp
async function handlePrefixedWhatsAppCommand(message, client, number, prefix, approvedUsers, participant, remoteJidBase, userConfig) {
    const messageBody = extractWhatsAppMessage(message).toLowerCase();

    const commandAndArgs = messageBody.slice(prefix.length).trim();
    const [command, ...args] = commandAndArgs.split(/\s+/);

    const isAuthorized = message.key.fromMe ||
        approvedUsers.includes(participant) ||
        approvedUsers.includes(remoteJidBase) ||
        [userConfig.lid].includes(message.key.participant || message.key.remoteJid);

    // Réaction immédiate
    await react(message, client);

    // Routing des commandes
    try {
        switch (command) {
            case 'connect':
                if (premium.includes(number + "@s.whatsapp.net")) {
                    await connect.connect(message, client, args[0]);
                } else {
                    await channelSender(message, client, "❌ Commande réservée aux premium | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);
                }
                break;

            case 'prem-menu':
                await prem(message, client);
                break;

            case 'disconnect':
                if (premium.includes(number + "@s.whatsapp.net")) {
                    await disconnect(message, client);
                } else {
                    await channelSender(message, client, "❌ Commande réservée aux premium | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);
                }
                break;

            case 'ping':
                await pingCommand(message, client);
                break;

            case 'update':
                await update(message, client);
                break;

            case 'tourl':
                await tourl(message, client);
                break;

            case 'getconfig':
                await getconf(message, client, number);
                break;

            case 'getpp':
                await getpp(message, client);
                break;

            case 'tiktok':
                await tiktok(message, client);
                break;

            case 'owner':
                await owner(message, client);
                break;

            case 'fancy':
                await fancy(message, client);
                break;

            case 'setpp':
                await pp(message, client);
                break;

            case 'photo':
                await media.photo(message, client);
                break;

            case 'toaudio':
                await media.tomp3(message, client);
                break;

            case 'menu':
                await info(message, client);
                break;

            case 'autoreact':
                await reactions.autoreact(message, client);
                break;

            case 'bye':
            case 'kickall':
            case 'purge':
            case 'demoteall':
            case 'promoteall':
                if (isAuthorized) {
                    await handleAdminCommand(command, message, client, userConfig.lid);
                } else {
                    await channelSender(message, client, "❌ Commande réservée | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);
                }
                break;

            case 'kick':
            case 'promote':
            case 'demote':
                await handleGroupCommand(command, message, client, isAuthorized);
                break;

            case 'vv':
                await viewonce(message, client);
                break;

            default:
                // Commandes génériques
                if (commands[command]) {
                    await commands[command](message, client, args);
                }
                break;
        }
    } catch (err) {
        console.error(`Error executing command "${command}":`, err);
        await client.sendMessage(message.key.remoteJid, { text: `❌ An error occurred: ${err.message}` });
    }
}

// Gestion des commandes admin
async function handleAdminCommand(command, message, client, lid) {
    try {
        switch (command) {
            case 'bye':
                await group.bye(message, client);
                break;
            case 'kickall':
                await group.kickall(message, client);
                break;
            case 'purge':
                await group.purge(message, client);
                break;
            case 's-kill':
                await kill(message, client);
                break;
            case 'demoteall':
                await group.dall(message, client, lid);
                await channelSender(message, client, "✅ Succès | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 1);
                break;
            case 'promoteall':
                await group.pall(message, client, lid);
                await channelSender(message, client, "✅ Succès | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 1);
                break;
        }
    } catch (error) {
        await client.sendMessage(message.key.remoteJid, {
            text: `❌ Erreur commande ${command}: ${error.message} | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴`
        });
        console.error(`Erreur commande ${command}:`, error);
    }
}

// Gestion des commandes groupe
async function handleGroupCommand(command, message, client, isAuthorized) {
    if (!isAuthorized) {
        await channelSender(message, client, "❌ Commande réservée | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);
        return;
    }

    try {
        switch (command) {
            case 'kick':
                await group.kick(message, client);
                break;
            case 'promote':
                await group.promote(message, client);
                await channelSender(message, client, "✅ Promotion réussie | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);
                break;
            case 'demote':
                await group.demote(message, client);
                await channelSender(message, client, "✅ Rétrogradation réussie | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);
                break;
        }
    } catch (error) {
        await client.sendMessage(message.key.remoteJid, {
            text: `❌ Erreur commande ${command}: ${error.message} | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴`
        });
        console.error(`Erreur commande ${command}:`, error);
    }
                                          }
