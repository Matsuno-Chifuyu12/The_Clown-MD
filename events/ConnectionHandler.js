// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// WhatsApp Connection Update Handler
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const { DisconnectReason } = require('bailey');

function handleConnectionUpdate(update, reconnect) {
    const { connection, lastDisconnect, pairingCode } = update;

    // Raison potentielle de déconnexion
    const statusCode = lastDisconnect?.error?.output?.statusCode;

    switch (connection) {
        case 'close':
            // Vérifier si une reconnexion est nécessaire
            if (statusCode !== DisconnectReason.loggedOut) {
                console.log(`🔌 Déconnexion détectée | Code: ${statusCode || 'inconnu'}`);
                console.log('🔄 Reconnexion en cours...');
                reconnect();
            } else {
                console.log('❌ Déconnexion permanente | Session terminée, réauthentification requise.');
            }
            break;

        case 'open':
            console.log('✅ Connexion établie | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴');
            break;

        default:
            // Gestion du pairing code si disponible
            if (pairingCode) {
                console.log(`📲 Pairing Code généré : ${pairingCode}`);
            }
            break;
    }
}

module.exports = handleConnectionUpdate;
