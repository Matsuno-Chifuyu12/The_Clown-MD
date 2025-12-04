// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// waConnect.js  
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴
// Connexion WhatsApp (Pairing Code) 
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── 1. Import sécurisé de baileys ---------------------------------------
let pkg;
try {
  pkg = await import('@whiskeysockets/baileys');
} catch (e) {
  console.error('❌  Le module « baileys » est introuvable. Lancez « npm install ».');
  process.exit(1);
}
const { makeWASocket, useMultiFileAuthState, DisconnectReason } = pkg;

// ── 2. Variables d’état --------------------------------------------------
let connectionInstance = null;
let isConnecting       = false;

// ── 3. Helper : attente simple ------------------------------------------
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── 4. Fonction principale -----------------------------------------------
export default async function connectToWhatsApp(handleMessage) {
  // Singleton actif
  if (connectionInstance) return connectionInstance;

  // Attendre fin connexion en cours
  while (isConnecting) await sleep(100);
  if (connectionInstance) return connectionInstance;

  isConnecting = true;

  try {
    // Auth persistente
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    // Création socket
    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      syncFullHistory: false,
      markOnlineOnConnect: false,
      generateHighQualityLinkPreview: false,
      shouldIgnoreJid: jid => jid.endsWith('@broadcast'),
      transactionOpts: { maxCommitRetries: 2, delayBetweenTries: 1000 }
    });

    // Pairing code
    if (!sock.authState.creds.registered) {
      const phoneNumber = process.env.WA_NUMBER || '';
      if (!phoneNumber) {
        throw new Error('❌  Aucun numéro configuré. Définissez WA_NUMBER dans vos variables d’environnement.');
      }
      const code = await sock.requestPairingCode(phoneNumber);
      console.log(`🔑  Pairing code pour ${phoneNumber} : ${code}`);
    }

    // Gestion connexion
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        console.log(`🔌  Connexion fermée | Code : ${statusCode || 'inconnu'}`);

        if (shouldReconnect) {
          console.log('🔄  Tentative de reconnexion…');
          await sleep(2000);
          connectionInstance = null;
          connectToWhatsApp(handleMessage);
        } else {
          console.log('❌  Déconnecté définitivement (logged out)');
          connectionInstance = null;
        }
      } else if (connection === 'open') {
        console.log('✅  WhatsApp connecté avec succès | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴');
      }
    });

    // Messages entrants
    sock.ev.on('messages.upsert', async (msg) => {
      try {
        await handleMessage(msg, sock);
      } catch (err) {
        console.error('❌  Erreur traitement message :', err.message);
      }
    });

    // Sauvegarde credentials (débounced)
    let saveTimeout;
    sock.ev.on('creds.update', () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(saveCreds, 1000);
    });

    connectionInstance = sock;
    isConnecting       = false;
    return sock;

  } catch (error) {
    isConnecting = false;
    console.error('💥  Erreur critique de connexion :', error.message);
    await sleep(5000);
    connectionInstance = null;
    return connectToWhatsApp(handleMessage);
  }
}
