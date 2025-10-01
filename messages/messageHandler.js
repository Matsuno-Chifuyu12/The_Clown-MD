// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴
// WhatsApp Incoming Message Handler
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from 'fs';
import configManager from '../utils/managerConfigs.js';
import auto from '../commands/auto.js';
import tag from '../commands/tag.js';
import group from '../commands/group.js';
import online from '../commands/online.js';
import reactions from '../commands/reactions.js';
import like from '../commands/like.js';
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
import url from '../commands/url.js';
import sticker from '../commands/sticker.js';
import play from '../commands/play.js';
import connect from '../commands/connect.js';
import disconnect from '../commands/disconnect.js';
import sender from '../messages/sender.js';
import dlt from '../commands/dlt.js';
import save from '../commands/save.js';
import prem from '../commands/prem-menu.js';
import premiums from '../commands/premiums.js';
import media from '../commands/media.js';
import test from '../commands/test.js';
import getconf from '../commands/getconfig.js';
import fancy from '../commands/fancy.js';
import owner from '../commands/owner.js';
import kurona from '../commands/kurona.js';
import facebook from '../commands/facebook.js';
import instagram from '../commands/instagram.js';
import pinterest from '../commands/pinterest.js';
import snapchat from '../commands/snapchat.js';
import antipromote from '../commands/antipromote.js';
import antidemote from '../commands/antidemote.js';
import antitag from '../commands/antitag.js';
import antidevice from '../commands/antidevice.js';
import antimention from '../commands/antimention.js';
import antilink from '../commands/antilink.js';
import antispam from '../commands/antispam.js';
import antibot from '../commands/antibot.js';
import antimedia from '../commands/antimedia.js';
import welcome from '../commands/welcome.js';
import left from '../commands/left.js';
import mute from '../commands/mute.js';
import set from '../commands/set.js
import unmute from '../commands/unmute.js';
import invite from '../commands/invite.js';
import settag from '../commands/settag.js';
import respons from '../commands/respons.js';
import tagall from '../commands/tagall.js';
import tagadmin from '../commands/tagadmin.js';

// Cache des données statiques
export let creator = ["237683614362@s.whatsapp.net"];
export let premium = ["237683614362@s.whatsapp.net"];

// Cache pour les configurations utilisateur
const userConfigCache = new Map();
const CACHE_TTL = 30000; // 30 secondes

// Objet commands manquant pour les commandes génériques
const commands = {
    // Ajoutez des commandes génériques supplémentaires
    
};

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
    im (message.message?.buttonsResponseMessage?.selectedButtonId) {
        return message.message.buttonsResponseMessage.selectedButtonId;
    }
    if (message.message?.listResponseMessage?.title) {
        return message.message.listResponseMessage.title;
    }
    // Support pour les messages de chaînes (broadcast)
    if (message.message?.protocolMessage?.type) {
        return `protocol_${message.message.protocolMessage.type}`;
    }
    return '';
}

// Fonction pour détecter le type de conversation
function getConversationType(remoteJid) {
    if (remoteJid.endsWith('@g.us')) {
        return 'group';
    } else if (remoteJid.endsWith('@broadcast')) {
        return 'broadcast';
    } else if (remoteJid.endsWith('@newsletter')) {
        return 'channel';
    } else {
        return 'private';
    }
}

// Handler principal optimisé pour WhatsApp
export async function handleIncomingMessage(event, client) {
    const number = client.user?.id?.split(':')[0] || '';
    if (!number || !event.messages?.length) return;

    const messages = event.messages;  
    const userConfig = await getUserConfig(number);  
    const prefix = userConfig.prefix || '.';  

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
    const conversationType = getConversationType(remoteJid);
    const approvedUsers = userConfig.sudoList || [];  
    const participant = message.key.participant ? message.key.participant.split("@")[0] : '';  
    const remoteJidBase = remoteJid.split("@")[0];  

    // Vérifier si le bot peut fonctionner dans ce type de conversation
    if (!canBotOperateIn(conversationType, userConfig)) {
        console.log(`🔒 Bot non autorisé dans les conversations de type: ${conversationType}`);
        return;
    }

    // Commandes automatiques (toujours exécutées)  
    await Promise.all([  
        auto.autotype(message, client),  
        auto.autorecord(message, client),  
        tag.respond(message, client, [userConfig.lid]),  
        conversationType === 'group' && group.linkDetection(message, client, [userConfig.lid]),  
        conversationType === 'group' && group.mentiondetect(message, client, [userConfig.lid]),  
        presence(message, client, userConfig.online),  
        like(message, client, userConfig.like),  
        reactions.auto(message, client, userConfig.autoreact, userConfig.emoji)  
    ]);  

    // Vérification des commandes avec préfixe  
    if (messageBody.startsWith(prefix)) {  
        await handlePrefixedWhatsAppCommand(message, client, number, prefix, approvedUsers, participant, remoteJidBase, userConfig, conversationType);  
    }
}

// Fonction pour vérifier si le bot peut fonctionner dans le type de conversation
function canBotOperateIn(conversationType, userConfig) {
    const allowedTypes = userConfig.allowedConversations || ['private', 'group', 'broadcast', 'channel'];
    return allowedTypes.includes(conversationType);
}

// Gestionnaire de commandes avec préfixe pour WhatsApp
async function handlePrefixedWhatsAppCommand(message, client, number, prefix, approvedUsers, participant, remoteJidBase, userConfig, conversationType) {
    const messageBody = extractWhatsAppMessage(message).toLowerCase();

    const commandAndArgs = messageBody.slice(prefix.length).trim();  
    const [command, ...args] = commandAndArgs.split(/\s+/);  

    const isAuthorized = message.key.fromMe ||  
        approvedUsers.includes(participant) ||  
        approvedUsers.includes(remoteJidBase) ||  
        [userConfig.lid].includes(message.key.participant || message.key.remoteJid);  

    const isGroup = conversationType === 'group';
    const isChannel = conversationType === 'channel';
    const isBroadcast = conversationType === 'broadcast';
    const isPremium = premium.includes(number + "@s.whatsapp.net");  

    // Réaction immédiate  
    await react(message, client);  

    // Routing des commandes  
    try {  
        switch (command) {  
            // ✨ MENU ✨  
            case 'menu':  
                await info(message, client);  
                break;  
            case 'premium':  
                await prem(message, client);  
                break;  

            // 🧰 UTILS 🧰  
            case 'delsudo':  
                await sudo.delsudo(message, client);  
                break;  
            case 'device':  
                await device(message, client);  
                break;  
            case 'fancy':  
                await fancy(message, client);  
                break;  
            case 'getid':  
                const idText = `🆔 ID: ${message.key.remoteJid}\n📊 Type: ${conversationType}`;
                await channelSender(message, client, idText, 1);  
                break;  
            case 'getsudo':  
                await sudo.getsudo(message, client);  
                break;  
            case 'owner':  
                await owner(message, client);  
                break;  
            case 'ping':  
                await pingCommand(message, client);  
                break;  
            case 'sudo':  
                await sudo.addsudo(message, client);  
                break;  
            case 'udapte':  
                await update(message, client);  
                break;  
            case 'url':  
                await url(message, client);  
                break;  

            // 👤 AUTONOME 👤  
            case 'online':  
                await presence(message, client, userConfig.online);  
                break;  
            case 'autotype':  
                await auto.autotype(message, client);  
                break;  
            case 'autoreact':  
                await reactions.autoreact(message, client);  
                break;  
            case 'autorecord':  
                await auto.autorecord(message, client);  
                break;  
            case 'setprefix':  
                await set.setprefix(message, client, args[0]);  
                break;  
            case 'getconfig':  
                await getconf(message, client, number);  
                break;  
            case 'like':  
                await like(message, client, userConfig.like);  
                break;  

            // 📥 DOWNLOADER 📥  
            case 'video':  
                await video(message, client);  
                break;  
            case 'snapchat':  
                await snapchat(message, client);  
                break;  
            case 'play':  
                await play(message, client);  
                break;  
            case 'tiktok':  
                await tiktok(message, client);  
                break;  
            case 'facebook':  
                await facebook(message, client);  
                break;  
            case 'instagram':  
                await instagram(message, client);  
                break;  
            case 'pinterest':  
                await pinterest(message, client);  
                break;  

            // 👑 GROUP MANAGEMENT 👑  
            case 'promote':  
                if (isAuthorized && isGroup) {  
                    await group.promote(message, client);  
                    await channelSender(message, client, "✅ Promotion réussie | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);  
                } else {  
                    await channelSender(message, client, "❌ Commande réservée aux admins de groupe | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);  
                }  
                break;  
            case 'demote':  
                if (isAuthorized && isGroup) {  
                    await group.demote(message, client);  
                    await channelSender(message, client, "✅ Rétrogradation réussie | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);  
                } else {  
                    await channelSender(message, client, "❌ Commande réservée aux admins de groupe | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);  
                }  
                break;  
            case 'demoteall':  
                if (isAuthorized && isGroup) {  
                    await group.dall(message, client, userConfig.lid);  
                    await channelSender(message, client, "✅ Succès | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 1);  
                } else {  
                    await channelSender(message, client, "❌ Commande réservée aux admins de groupe | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);  
                }  
                break;  
            case 'promoteall':  
                if (isAuthorized && isGroup) {  
                    await group.pall(message, client, userConfig.lid);  
                    await channelSender(message, client, "✅ Succès | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 1);  
                } else {  
                    await channelSender(message, client, "❌ Commande réservée aux admins de groupe | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);  
                }  
                break;  
            case 'kick':  
                if (isAuthorized && isGroup) {  
                    await group.kick(message, client);  
                } else {  
                    await channelSender(message, client, "❌ Commande réservée aux admins de groupe | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);  
                }  
                break;  
            case 'kickall':  
                if (isAuthorized && isGroup) {  
                    await group.kickall(message, client);  
                } else {  
                    await channelSender(message, client, "❌ Commande réservée aux admins de groupe | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);  
                }  
                break;  
            case 'invite':  
                if (isAuthorized && isGroup) {  
                    await invite(message, client);  
                } else {  
                    await channelSender(message, client, "❌ Commande réservée aux admins de groupe | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);  
                }  
                break;  
            case 'welcome':  
                if (isAuthorized && isGroup) {  
                    await welcome(message, client);  
                } else {  
                    await channelSender(message, client, "❌ Commande réservée aux admins de groupe | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);  
                }  
                break;  
            case 'mute':  
                if (isAuthorized && isGroup) {  
                    await mute(message, client);  
                } else {  
                    await channelSender(message, client, "❌ Commande réservée aux admins de groupe | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);  
                }  
                break;  
            case 'unmute':  
                if (isAuthorized && isGroup) {  
                    await unmute(message, client);  
                } else {  
                    await channelSender(message, client, "❌ Commande réservée aux admins de groupe | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);  
                }  
                break;  
            case 'bye':  
                if (isAuthorized && isGroup) {  
                    await group.bye(message, client);  
                } else {  
                    await channelSender(message, client, "❌ Commande réservée aux admins de groupe | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);  
                }  
                break;  

            // 🎴 ANTI MANAGEMENT 🎴  
            case 'antipromote':  
                if (isAuthorized) {  
                    await antipromote(message, client);  
                } else {  
                    await channelSender(message, client, "❌ Commande réservée aux admins | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);  
                }  
                break;  
            case 'antidemote':  
                if (isAuthorized) {  
                    await antidemote(message, client);  
                } else {  
                    await channelSender(message, client, "❌ Commande réservée aux admins | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);  
                }  
                break;  
            case 'antitag':  
                if (isAuthorized) {  
                    await antitag(message, client);  
                } else {  
                    await channelSender(message, client, "❌ Commande réservée aux admins | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);  
                }  
                break;  
            case 'antidevice':  
                if (isAuthorized) {  
                    await antidevice(message, client);  
                }  
                break;  
            case 'antimention':  
                if (isAuthorized) {  
                    await antimention(message, client);  
                } else {  
                    await channelSender(message, client, "❌ Commande réservée aux admins | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);  
                }  
                break;  
            case 'antilink':  
                if (isAuthorized) {  
                    await antilink(message, client);  
                } else {  
                    await channelSender(message, client, "❌ Commande réservée aux admins | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);  
                }  
                break;  
            case 'antispam':  
                if (isAuthorized) {  
                    await antispam(message, client);  
                } else {  
                    await channelSender(message, client, "❌ Commande réservée aux admins | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);  
                }  
                break;  
            case 'antibot':  
                if (isAuthorized) {  
                    await antibot(message, client);  
                } else {  
                    await channelSender(message, client, "❌ Commande réservée aux admins | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);  
                }  
                break;  
            case 'antimedia':  
                if (isAuthorized) {  
                    await antimedia(message, client);  
                } else {  
                    await channelSender(message, client, "❌ Commande réservée aux admins | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);  
                }  
                break;  

            // 💾 MEDIA 💾  
            case 'sticker':  
                await sticker(message, client);  
                break;  
            case 'toaudio':  
                await media.tomp3(message, client);  
                break;  
            case 'photo':  
                await media.photo(message, client);  
                break;  
            case 'vv':  
                await viewonce(message, client);  
                break;  
            case 'take':  
                await take(message, client);  
                break;  
            case 'save':  
                await save(message, client);  
                break;  

            // 📢 TAG 📢  
            case 'tag':  
                await tag.tag(message, client);  
                break;  
            case 'tagadmin':  
                if (isGroup || isChannel || isBroadcast) {
                    await tagadmin(message, client);  
                } else {
                    await channelSender(message, client, "❌ Cette commande nécessite un groupe, une chaîne ou un broadcast | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);
                }
                break;  
            case 'tagall':  
                if (isGroup || isChannel || isBroadcast) {
                    await tagall(message, client);  
                } else {
                    await channelSender(message, client, "❌ Cette commande nécessite un groupe, une chaîne ou un broadcast | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);
                }
                break;  
            case 'settag':  
                await settag(message, client);  
                break;  
            case 'respons':  
                await respons(message, client);  
                break;  

            // 🌐 CHAÎNES & BROADCAST 🌐
            case 'channelinfo':
                if (isChannel || isBroadcast) {
                    const infoText = `╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│ 🎴 𝐼𝑁𝐹𝑂𝑅𝑀𝐴𝑇𝐼𝑂𝑁𝑆 𝐷𝐸 𝐿𝐴 𝐶𝐻𝐴𝐼𝑁𝐸🎴
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
│  ❃ 𝐼𝐷 : ${message.key.remoteJid}
│  ❃ 𝑇𝑦𝑝𝑒 : ${conversationType}
│  ❃ 𝐸𝑥𝑝𝑒𝑑𝑖𝑡𝑒𝑢𝑟 : ${message.key.participant || '𝑁/𝐴'}
│  ❃ 𝐻𝑜𝑟𝑜𝑑𝑎𝑡𝑎𝑔𝑒 : ${new Date(message.messageTimestamp * 1000).toLocaleString()}
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`;
                    await channelSender(message, client, infoText, 1);
                } else {
                    await channelSender(message, client, "❌ Cette commande est réservée aux chaînes et broadcasts | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);
                }
                break;

            // Commandes premium  
            case 'connect':  
                if (isPremium) {  
                    await connect.connect(message, client, args[0]);  
                } else {  
                    await channelSender(message, client, "❌ Commande réservée aux premium | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);  
                }  
                break;  

            case 'disconnect':  
                if (isPremium) {  
                    await disconnect(message, client);  
                } else {  
                    await channelSender(message, client, "❌ Commande réservée aux premium | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴", 2);  
                }  
                break;  

            default:  
                // Commandes génériques  
                if (commands[command]) {  
                    await commands[command](message, client, args);  
                } else {  
                    await channelSender(message, client, `❌ Commande "${command}" non reconnue | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴`, 2);  
                }  
                break;  
        }  
    } catch (err) {  
        console.error(`Error executing command "${command}":`, err);  
        await client.sendMessage(message.key.remoteJid, {   
            text: `❌ Erreur avec la commande "${command}": ${err.message} | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴`   
        });  
    }
    }
