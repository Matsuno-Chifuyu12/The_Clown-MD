//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴
// The Ultimate WhatsApp Experience
// Commande : sudo.js
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "config", "sudo.json");

// Charger la liste des sudo depuis un fichier
function loadSudoList() {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(dbPath));
}

// Sauvegarder la liste
function saveSudoList(list) {
    fs.writeFileSync(dbPath, JSON.stringify(list, null, 2));
}

// Fonction interne
async function modifySudoList(message, client, action) {
    try {
        const remoteJid = message.key?.remoteJid;
        if (!remoteJid) throw new Error("JID invalide.");

        const msgBody = message.message?.extendedTextMessage?.text 
            || message.message?.conversation 
            || "";

        const args = msgBody.trim().split(/\s+/).slice(1);

        let participant;

        // Cas : reply
        if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
            participant = message.message.extendedTextMessage.contextInfo.participant.split("@")[0];
        }
        // Cas : argument direct
        else if (args.length > 0) {
            const jidMatch = args[0].match(/\d+/);
            if (!jidMatch) throw new Error("Format de numéro invalide.");
            participant = jidMatch[0];
        } else {
            throw new Error("Aucun numéro fourni.");
        }

        let list = loadSudoList();

        if (action === "add") {
            if (!list.includes(participant)) {
                list.push(participant);
                saveSudoList(list);
                await client.sendMessage(remoteJid, { text: `✅ _${participant} ajouté à la liste sudo_` });
            } else {
                await client.sendMessage(remoteJid, { text: `⚠️ _${participant} est déjà sudo_` });
            }
        } else if (action === "remove") {
            const index = list.indexOf(participant);
            if (index !== -1) {
                list.splice(index, 1);
                saveSudoList(list);
                await client.sendMessage(remoteJid, { text: `🚫 _${participant} retiré de la liste sudo_` });
            } else {
                await client.sendMessage(remoteJid, { text: `⚠️ _${participant} n'était pas sudo_` });
            }
        }

    } catch (error) {
        console.error("Erreur sudo.js:", error);
        await client.sendMessage(message.key?.remoteJid, { text: `❌ Erreur: ${error.message}` });
    }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Commandes exportées
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function sudo(message, client) {
    await modifySudoList(message, client, "add");
}

export async function delsudo(message, client) {
    await modifySudoList(message, client, "remove");
}

export async function getsudo(message, client) {
    const remoteJid = message.key.remoteJid;
    const list = loadSudoList();

    let msg = `╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n`;
    msg += `┃          🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴\n`;
    msg += `╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯\n`;
    msg += `┃📜 Liste des sudo users\n`;
    msg += `╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯\n`;

    if (list.length === 0) {
        msg += `_❌ Aucun sudo défini._`;
    } else {
        list.forEach((num, i) => {
            msg += `${i + 1}. ${num}\n`;
        });
    }

    await client.sendMessage(remoteJid, { text: msg });
}

export default { sudo, delsudo, getsudo };
