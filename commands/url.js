// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Module : Media → URL (Catbox API)
// Style : Majordome Démoniaque (Sebastian Michaelis)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import axios from "axios";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import pkg from "bailey";
import { v4 as uuidv4 } from "uuid";

const { downloadMediaMessage } = pkg;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎩 Fonction principale
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function url(message, client) {
    const remoteJid = message.key.remoteJid;
    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    try {
        // ─────────── Vérification de base
        if (!quoted) {
            await client.sendMessage(remoteJid, {
                text: "📜 Permettez-moi de vous corriger : veuillez citer une image, une vidéo, un audio ou un document.",
            });
            return;
        }

        // ─────────── Détection du type MIME
        const mimeType =
            quoted.imageMessage?.mimetype ||
            quoted.videoMessage?.mimetype ||
            quoted.audioMessage?.mimetype ||
            quoted.documentMessage?.mimetype;

        if (!mimeType) {
            await client.sendMessage(remoteJid, {
                text: "⚠️ Ce format est… disons, indigne de traitement par 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴.",
            });
            return;
        }

        // ─────────── Téléchargement du média
        const mediaBuffer = await downloadMediaMessage(
            { message: quoted },
            "buffer",
            {},
            { reuploadRequest: client.reuploadRequest }
        );

        // ─────────── Sauvegarde temporaire
        const ext = mimeType.split("/")[1] || "bin";
        const fileName = `${uuidv4()}.${ext}`;
        const filePath = path.join("./temp", fileName);

        // Crée le dossier ./temp si inexistant
        if (!fs.existsSync("./temp")) fs.mkdirSync("./temp");
        fs.writeFileSync(filePath, mediaBuffer);

        // ─────────── Upload vers Catbox
        const form = new FormData();
        form.append("reqtype", "fileupload");
        form.append("fileToUpload", fs.createReadStream(filePath));

        const { data: uploadedUrl } = await axios.post(
            "https://catbox.moe/user/api.php",
            form,
            { headers: form.getHeaders(), timeout: 15000 }
        );

        // ─────────── Nettoyage
        fs.unlinkSync(filePath);

        // ─────────── Réponse au groupe
        await client.sendMessage(remoteJid, {
            text: `🎩 Votre fichier a été élégamment transformé en URL :\n\n🔗 ${uploadedUrl}\n\n— Avec toute la dévotion de votre serviteur, 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴`,
            quoted: message,
        });

        // ─────────── Log stylisé
        console.log(
            `✔️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 | MediaToUrl]
             ↳ Auteur   : ${remoteJid}
             ↳ Fichier  : ${fileName}
             ↳ Résultat : ${uploadedUrl}`
        );

    } catch (err) {
        // ─────────── Gestion élégante des erreurs
        console.error(
            `❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 | MediaToUrl]
             ↳ Incident détecté : ${err.message}`
        );

        await client.sendMessage(remoteJid, {
            text: "❌ Pardonnez-moi… une irrégularité technique m’empêche d’exécuter votre requête.",
            quoted: message,
        });
    }
}

export default url;
