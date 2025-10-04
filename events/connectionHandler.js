// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// WhatsApp Connection Update Handler
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const { DisconnectReason } = require('baileys');

function handleConnectionUpdate(update, reconnect) {
    const { connection, lastDisconnect, pairingCode } = update;

    // Raison potentielle de déconnexion
    const statusCode = lastDisconnect?.error?.output?.statusCode;

    switch (connection) {
        case 'close':
            // Vérifier si une reconnexion est nécessaire
            if (statusCode !== DisconnectReason.loggedOut) {
                console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🔌 Déconnexion détectée, Code: " + (statusCode || 'inconnu') + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
                console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🔄 Reconnexion en cours...\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
                reconnect();
            } else {
                console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ Déconnexion permanente. Session terminée,\n│ réauthentification requise.\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
            }
            break;

        case 'open':
            console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴 ✅ Connexion établie\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
            break;

        default:
            // Gestion du pairing code si disponible
            if (pairingCode) {
                console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 📲 Pairing Code généré : " + pairingCode + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
            }
            break;
    }
}

module.exports = handleConnectionUpdate;
