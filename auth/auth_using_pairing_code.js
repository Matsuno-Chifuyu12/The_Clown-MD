// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// WhatsApp Bot Connection Module (Pairing Code Optimisé)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { makeWASocket, useMultiFileAuthState, DisconnectReason } from "baileys";

let connectionInstance = null;
let isConnecting = false;

async function connectToWhatsApp(handleMessage) {
    // ✅ Empêcher les connexions multiples
    if (connectionInstance) return connectionInstance;
    if (isConnecting) {
        return new Promise(resolve => {
            const waitForConnection = () => {
                if (connectionInstance && !isConnecting) {
                    resolve(connectionInstance);
                } else {
                    setTimeout(waitForConnection, 100);
                }
            };
            waitForConnection();
        });
    }

    isConnecting = true;

    try {
        // 📂 Authentification multi-fichiers (sessions persistantes)
        const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");

        // ⚡ Création de la socket WhatsApp
        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: false, // ❌ pas de QR code
            syncFullHistory: false,
            markOnlineOnConnect: false,
            generateHighQualityLinkPreview: false,
            shouldIgnoreJid: jid => jid.endsWith("@broadcast"),
            transactionOpts: {
                maxCommitRetries: 2,
                delayBetweenTries: 1000
            }
        });

        // 📲 Pairing code (remplace le QR code)
        if (!sock.authState.creds.registered) {
            const phoneNumber = process.env.WA_NUMBER || ""; // numéro ex: 237690xxxxxx
            if (!phoneNumber) {
                throw new Error("❌ Aucun numéro configuré. Défini WA_NUMBER dans tes variables d'environnement.");
            }
            const code = await sock.requestPairingCode(phoneNumber);
            console.log(`🔑 Pairing code pour ${phoneNumber}: ${code}`);
        }

        // 🔌 Gestion des connexions
        sock.ev.on("connection.update", (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === "close") {
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

                console.log(`🔌 Connexion fermée | Code: ${statusCode || "inconnu"}`);

                if (shouldReconnect) {
                    console.log("🔄 Tentative de reconnexion...");
                    setTimeout(() => connectToWhatsApp(handleMessage), 2000);
                } else {
                    console.log("❌ Déconnecté définitivement (logged out)");
                    connectionInstance = null;
                }
            } else if (connection === "open") {
                console.log("✅ WhatsApp connecté avec succès | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴");
            }
        });

        // 📩 Gestion des nouveaux messages
        sock.ev.on("messages.upsert", async (msg) => {
            try {
                await handleMessage(msg, sock);
            } catch (err) {
                console.error("❌ Erreur traitement message:", err.message);
            }
        });

        // 💾 Sauvegarde optimisée des credentials
        sock.ev.on("creds.update", () => {
            setTimeout(saveCreds, 1000);
        });

        connectionInstance = sock;
        isConnecting = false;

        return sock;

    } catch (error) {
        isConnecting = false;
        console.error("💥 Erreur critique de connexion:", error.message);

        // 🔄 Tentative de reconnexion après erreur
        setTimeout(() => {
            connectionInstance = null;
            connectToWhatsApp(handleMessage);
        }, 5000);

        throw error;
    }
}

export default connectToWhatsApp;
