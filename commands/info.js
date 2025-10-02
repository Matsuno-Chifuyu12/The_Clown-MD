// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
//  The Ultimate WhatsApp Experience
// commands/info.js
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import configManager from "../utils/managerConfigs.js";

export async function info(message, client) {
    try {
        const remoteJid = message.key.remoteJid;
        const user = message.pushName || "Inconnu";
        const number = client.user.id.split(":")[0];

        const today = new Date();
        const daysOfWeek = [
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ];
        const currentDay = daysOfWeek[today.getDay()];
        const date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

        const prefix = configManager?.config?.users[number]?.prefix || ".";
        
        // En-tête du menu avec design encadré
        const menuHeader = `
> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │    🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴    
> │   𝐓𝐡𝐞 𝐔𝐥𝐭𝐢𝐦𝐚𝐭𝐞 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐄𝐱𝐩𝐞𝐫𝐢𝐞𝐧𝐜𝐞                   
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯

> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │  🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝐼𝛮𝑭𝛩🎴
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> │  ❃ 𝗢𝘄𝗻𝗲𝗿 : 🎴 𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
> │  ❃ 𝗠𝗼𝗱𝗲 : Public
> │  ❃ 𝗨𝘀𝗲𝗿 : ${user}
> │  ❃ 𝗣𝗿𝗲𝗳𝗶𝘅 : [ . ]
> │  ❃ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : v1.0.0
> │  ❃ 𝗗𝗮𝘁𝗲 : ${date}
> │  ❃ 𝗣𝗹𝘂𝗴𝗶𝗻 : 54
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │           𝐂 𝐎 𝐌 𝐌 𝐀 𝐍 𝐃 𝐒          
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
        `.trim();

        // Pied de page
        const menuFooter = `
> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │  🎴 ℬ𝓎  𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
        `.trim();

        // Images pour chaque catégorie
        const categoryImages = {
            "✨𝐌𝐄𝐍𝐔✨": "./assets/images/menu.png",
            "🧰𝐔𝐓𝐈𝐋𝐒🧰": "./assets/images/utils.png",
            "👤𝐀𝐔𝐓𝐎𝐍𝐎𝐌𝐄👤": "./assets/images/autonome.png",
            "📥𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑📥": "./assets/images/downloader.png",
            "👑𝐆𝐑𝐎𝐔𝐏-𝐌𝐀𝐍𝐀𝐆𝐄👑": "./assets/images/group.png",
            "🎴𝐀𝐍𝐓𝐈 - 𝐌𝐀𝐍𝐀𝐆𝐄🎴": "./assets/images/anti.png",
            "💾𝐌𝐄𝐃𝐈𝐀💾": "./assets/images/media.png",
            "📢𝐓𝐀𝐆📢": "./assets/images/tag.png"
        };

        // Sections stylisées avec cadres (triées par ordre alphabétique)
        const sections = [
            {
                title: "> ╭┅┅┅┅ ✨𝐌𝐄𝐍𝐔✨ ┅┅┅┅╮",
                rows: [
                    { title: "┃⟶menu" },
                    { title: "┃⟶premium" },
                    { title: "╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯" }
                ]
            },
            {
                title: "> ╭┅┅ 🧰𝐔𝐓𝐈𝐋𝐒🧰 ┅┅╮",
                rows: [
                    { title: "> ┃➙delsudo" },
                    { title: "> ┃➙device" },
                    { title: "> ┃➙fancy" },
                    { title: "> ┃➙getid" },
                    { title: "> ┃➙getsudo" },
                    { title: "> ┃➙owner" },
                    { title: "> ┃➙ping" },
                    { title: "> ┃➙sudo" },
                    { title: "> ┃➙udapte" },
                    { title: "> ┃➙url" },
                    { title: "> ╰┅┅┅┅┅┅┅·┅┅┅┅┅┅╯" }
                ]
            },
            {
                title: "> ╭┅┅┅ 🧠𝐈𝐀 – 𝐂𝐎𝐑𝐓𝐄𝐗🧠 ┅┅┅┅╮",
                rows: [
                    { title: "> ┃⇒kurona " },
                    { title: "> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯" }
                ]
            },
            {
                title: "> ╭┅┅┅ 👤𝐀𝐔𝐓𝐎𝐍𝐎𝐌𝐄👤 ┅┅┅╮",
                rows: [
                    { title: "> ┃➳autoreact" },
                    { title: "> ┃➳autorecord" },
                    { title: "> ┃➳autotype" },
                    { title: "> ┃➳getconfig" },
                    { title: "> ┃➳like" },
                    { title: "> ┃➳online" },
                    { title: "> ┃➳setprefix" },
                    { title: "> ╰┅┅┅┅┅┅┅┅┅·┅┅┅┅┅┅┅┅┅┅╯" }
                ]
            },
            {
                title: "> ╭┅┅┅ 📥𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑📥 ┅┅┅╮",
                rows: [
                    { title: "> ┃⇒facebook" },
                    { title: "> ┃⇒instagram" },
                    { title: "> ┃⇒pinterest" },
                    { title: "> ┃⇒play" },
                    { title: "> ┃⇒snapchat" },
                    { title: "> ┃⇒tiktok" },
                    { title: "> ┃⇒video" },
                    { title: "> ╰┅┅┅┅┅┅┅┅┅┅·┅┅┅┅┅┅┅┅┅┅┅╯" }
                ]
            },
            {
                title: "> ╭┅┅┅┅ 👑𝐆𝐑𝐎𝐔𝐏-𝐌𝐀𝐍𝐀𝐆𝐄👑 ┅┅┅┅╮",
                rows: [
                    { title: "> ┃➺bye" },
                    { title: "> ┃➺demote" },
                    { title: "> ┃➺demoteall" },
                    { title: "> ┃➺invite" },
                    { title: "> ┃➺kick" },
                    { title: "> ┃➺kickall" },
                    { title: "> ┃➺mute" },
                    { title: "> ┃➺promote" },
                    { title: "> ┃➺promoteall" },
                    { title: "> ┃➺unmute" },
                    { title: "> ┃➺welcome" },
                    { title: "> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅·┅┅┅┅┅┅┅┅┅┅┅╯" }
                ]
            },
            {
                title: "> ╭┅┅┅┅ 🎴𝐀𝐍𝐓𝐈 - 𝐌𝐀𝐍𝐀𝐆𝐄🎴 ┅┅┅┅╮",
                rows: [
                    { title: "> ┃➜antibot" },
                    { title: "> ┃➜antidemote" },
                    { title: "> ┃➜antidevice" },
                    { title: "> ┃➜antilink" },
                    { title: "> ┃➜antimedia" },
                    { title: "> ┃➜antimention" },
                    { title: "> ┃➜antipromote" },
                    { title: "> ┃➜antispam" },
                    { title: "> ┃➜antitag" },
                    { title: "> ╰┅┅┅┅┅┅┅┅┅┅┅┅·┅┅┅┅┅┅┅┅┅┅┅╯" }
                ]
            },
            {
                title: "> ╭┅┅┅ 💾𝐌𝐄𝐃𝐈𝐀💾 ┅┅┅╮",
                rows: [
                    { title: "> ┃⮕photo" },
                    { title: "> ┃⮕save" },
                    { title: "> ┃⮕sticker" },
                    { title: "> ┃⮕take" },
                    { title: "> ┃⮕toaudio" },
                    { title: "> ┃⮕vv" },
                    { title: "> ╰┅┅┅┅┅┅┅·┅┅┅┅┅┅┅┅╯" }
                ]
            },
            {
                title: "> ╭┅┅┅ 📢𝐓𝐀𝐆📢  ┅┅┅╮",
                rows: [
                    { title: "> ┃➳respons" },
                    { title: "> ┃➳settag" },
                    { title: "> ┃➳tag" },
                    { title: "> ┃➳tagadmin" },
                    { title: "> ┃➳tagall" },
                    { title: "> ╰┅┅┅┅┅┅┅·┅┅┅┅┅┅┅╯" }
                ]
            }
        ];

        // Envoi de l'image d'en-tête
        await client.sendMessage(remoteJid, {
            image: { url: "./assets/images/logo.png" },
            caption: menuHeader,
            quoted: message
        });

        // Envoi de chaque catégorie avec sa propre image
        for (const section of sections) {
            // Extraire le nom de la catégorie sans les symboles
            const categoryName = section.title.replace(/╭┅┅?┅? ?([^┅]+) ?┅┅?┅?╮/g, '$1').trim();
            const imagePath = categoryImages[categoryName] || "./assets/images/default.png";
            
            await client.sendMessage(remoteJid, {
                image: { url: imagePath },
                caption: section.title,
                quoted: message
            });

            // Envoi des commandes de la catégorie
            const commandsText = section.rows.map(row => row.title).join('\n');
            await client.sendMessage(remoteJid, {
                text: commandsText
            });
        }

        // Envoi du pied de page
        await client.sendMessage(remoteJid, { text: menuFooter });

        // Envoi d'un audio de présentation
        await client.sendMessage(remoteJid, {
            audio: { url: "./assets/audio/menu.mp3" },
            mimetype: "audio/mp4",
            ptt: true,
            quoted: message
        });
    } catch (e) {
        console.error("[INFO CMD ERROR]", e);
        await client.sendMessage(message.key.remoteJid, {
            text: "❌ Une erreur est survenue lors de l'exécution de la commande info.",
            quoted: message
        });
    }
}

export default info;
