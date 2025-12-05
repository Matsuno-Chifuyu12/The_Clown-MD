// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// connector.js  (anciennement startSession.js)
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴
// Gestion des sessions WhatsApp - Version corrigée
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import configManager from '../utils/managerConfigs.js';
import { handleIncomingMessage } from '../messages/messageHandler.js';
import group from '../commands/group.js';
import antimanage from '../commands/antimanage.js';
import autoJoin from '../utils/autoJoin.js';

// ── 1. Configuration des chemins --------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── 2. Import sécurisé de baileys 6.7.21 ------------------------------------
let baileys;
try {
    baileys = await import('@whiskeysockets/baileys');
} catch (e) {
    console.error('❌  Le module « @whiskeysockets/baileys » est introuvable.');
    console.error('   Lancez : npm install @whiskeysockets/baileys@6.7.21');
    process.exit(1);
}

const { 
    makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason,
    Browsers,
    makeCacheableSignalKeyStore,
    proto,
    getAggregateVotesInPollMessage,
    delay,
    toNumber 
} = baileys;

// ── 3. Constantes & helpers -------------------------------------------------
const SESSIONS_FILE = 'sessions.json';
const SESSIONS_DIR = './sessions';
const sessions = new Map();
const BOT_NAME = '🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴';
const BOT_SIGNATURE = '🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴';

// Cache de configuration
let configCache = null;
function getConfig() {
    if (!configCache) {
        configCache = configManager.config || {};
        configCache.users = configCache.users || {};
        configCache.users.root = configCache.users.root || {};
    }
    return configCache;
}

// ── 4. Fonction pour nettoyer le numéro ------------------------------------
function cleanPhoneNumber(number) {
    return number.replace(/\D/g, '').replace(/^0+/, '');
}

// ── 5. Sauvegarde de la liste des sessions ----------------------------------
function saveSessionNumber(number) {
    try {
        const cleanNumber = cleanPhoneNumber(number);
        let sessionsList = [];
        
        if (fs.existsSync(SESSIONS_FILE)) {
            try {
                const raw = fs.readFileSync(SESSIONS_FILE, 'utf8') || '[]';
                sessionsList = JSON.parse(raw);
                if (!Array.isArray(sessionsList)) sessionsList = [];
            } catch (e) {
                sessionsList = [];
            }
        }
        
        if (!sessionsList.includes(cleanNumber)) {
            sessionsList.push(cleanNumber);
            fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessionsList, null, 2));
            console.log(`[${BOT_NAME}] Session ${cleanNumber} enregistrée.`);
        }
    } catch (err) {
        console.error(`[${BOT_NAME}] Erreur sauvegarde session :`, err.message);
    }
}

// ── 6. Suppression propre d'une session ------------------------------------
async function removeSession(number) {
    const cleanNumber = cleanPhoneNumber(number);
    console.log(`[${BOT_NAME}] Suppression session : ${cleanNumber}`);
    
    try {
        // Retirer de la liste des sessions
        if (fs.existsSync(SESSIONS_FILE)) {
            try {
                const raw = fs.readFileSync(SESSIONS_FILE, 'utf8') || '[]';
                let sessionsList = JSON.parse(raw);
                if (Array.isArray(sessionsList)) {
                    sessionsList = sessionsList.filter(n => n !== cleanNumber);
                    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessionsList, null, 2));
                }
            } catch (e) {
                // Ignorer les erreurs de lecture
            }
        }
        
        // Supprimer le dossier d'authentification
        const sessionPath = path.join(SESSIONS_DIR, cleanNumber);
        if (fs.existsSync(sessionPath)) {
            fs.rmSync(sessionPath, { recursive: true, force: true });
        }
        
        // Retirer de la mémoire
        sessions.delete(cleanNumber);
        
        // Mettre à jour la configuration
        const cfg = getConfig();
        if (cfg.users?.root?.primary === cleanNumber) {
            cfg.users.root.primary = '';
            await configManager.save();
        }
        
        console.log(`[${BOT_NAME}] Session ${cleanNumber} supprimée avec succès.`);
    } catch (err) {
        console.error(`[${BOT_NAME}] Erreur suppression session ${cleanNumber} :`, err.message);
    }
}

// ── 7. Fonction de demande de pairing code avec retry -----------------------
async function requestPairingCodeWithRetry(sock, phoneNumber, maxRetries = 3) {
    const cleanNumber = cleanPhoneNumber(phoneNumber);
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`[${BOT_NAME}] Tentative ${attempt}/${maxRetries} de pairing code pour ${cleanNumber}...`);
            
            // Vérifier que la socket est prête
            if (!sock || typeof sock.requestPairingCode !== 'function') {
                throw new Error('Socket non initialisée ou fonction requestPairingCode indisponible');
            }
            
            // Vérifier l'état de connexion
            if (!sock.user?.id) {
                await delay(2000 * attempt); // Attente progressive
                continue;
            }
            
            // Demander le pairing code
            const code = await sock.requestPairingCode(cleanNumber);
            
            if (code) {
                console.log(`✅ [${BOT_NAME}] Pairing code pour ${cleanNumber} : ${code}`);
                
                // Sauvegarder le code
                const codePath = path.join(SESSIONS_DIR, cleanNumber, 'pairing_code.txt');
                fs.writeFileSync(codePath, 
                    `Code: ${code}\n` +
                    `Numéro: ${cleanNumber}\n` +
                    `Date: ${new Date().toISOString()}\n` +
                    `Expire dans: 20 minutes`
                );
                
                return code;
            }
            
        } catch (error) {
            console.error(`[${BOT_NAME}] Erreur tentative ${attempt} :`, error.message);
            
            // Ne pas réessayer pour certaines erreurs
            if (error.message.includes('logged out') || 
                error.message.includes('banned') ||
                error.output?.statusCode === DisconnectReason.loggedOut) {
                throw error;
            }
            
            if (attempt < maxRetries) {
                const waitTime = 3000 * attempt; // Backoff exponentiel
                console.log(`[${BOT_NAME}] Nouvelle tentative dans ${waitTime/1000}s...`);
                await delay(waitTime);
            } else {
                console.error(`❌ [${BOT_NAME}] Échec après ${maxRetries} tentatives`);
                throw error;
            }
        }
    }
}

// ── 8. Fonction principale : démarrer une session ---------------------------
async function startSession(targetNumber, handler, initConfig = false) {
    const cleanNumber = cleanPhoneNumber(targetNumber);
    console.log(`[${BOT_NAME}] Démarrage session pour ${cleanNumber}`);
    
    // Créer le dossier de session
    const sessionPath = path.join(SESSIONS_DIR, cleanNumber);
    if (!fs.existsSync(sessionPath)) {
        fs.mkdirSync(sessionPath, { recursive: true });
    }
    
    // État d'authentification
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    
    // Configuration optimisée pour Baileys 6.7.21
    const sock = makeWASocket({
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, baileys.logger)
        },
        printQRInTerminal: true, // Toujours afficher le QR code comme fallback
        syncFullHistory: false,
        markOnlineOnConnect: false,
        generateHighQualityLinkPreview: false,
        browser: Browsers.macOS('Desktop'), // User-agent macOS
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 30000,
        keepAliveIntervalMs: 10000,
        emitOwnEvents: true,
        linkPreviewImageThumbnailWidth: 192,
        logger: baileys.logger.child({ session: cleanNumber }),
        retryRequestDelayMs: 1000,
        maxRetryCount: 3,
        getMessage: async (key) => {
            // Implémentation basique pour les messages
            return {
                conversation: 'Message non disponible'
            };
        },
        shouldIgnoreJid: (jid) => jid?.endsWith('@broadcast'),
        version: [2, 2413, 1] // Version WhatsApp compatible
    });
    
    // Variables de contrôle
    let pairingRequested = false;
    let isConnected = false;
    let pairingTimeout = null;
    let removalTimeout = null;
    
    // ── Gestion des credentials ──
    sock.ev.on('creds.update', saveCreds);
    
    // ── Gestion de la connexion ──
    sock.ev.on('connection.update', async (update) => {
        try {
            const { connection, lastDisconnect, qr } = update;
            
            // Journaliser le statut
            if (connection) {
                console.log(`[${BOT_NAME}] ${cleanNumber} → Statut: ${connection}`);
            }
            
            if (connection === 'close') {
                isConnected = false;
                clearTimeout(pairingTimeout);
                clearTimeout(removalTimeout);
                
                console.warn(`[${BOT_NAME}] Session ${cleanNumber} fermée.`);
                
                // Analyser la raison de la déconnexion
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                const shouldReconnect = ![
                    DisconnectReason.loggedOut,
                    DisconnectReason.badSession,
                    DisconnectReason.restartRequired,
                    DisconnectReason.forbidden
                ].includes(statusCode);
                
                if (shouldReconnect) {
                    console.log(`[${BOT_NAME}] Reconnexion dans 5s pour ${cleanNumber}...`);
                    setTimeout(() => {
                        startSession(cleanNumber, handler, false).catch(console.error);
                    }, 5000);
                } else {
                    console.log(`[${BOT_NAME}] Déconnexion définitive - suppression ${cleanNumber}`);
                    await removeSession(cleanNumber);
                }
                
            } else if (connection === 'open') {
                isConnected = true;
                clearTimeout(pairingTimeout);
                clearTimeout(removalTimeout);
                
                console.log(`✅ [${BOT_NAME}] Session ${cleanNumber} connectée avec succès!`);
                
                // Auto-join newsletters
                try {
                    await autoJoin(sock, '@newsletter');
                } catch (e) {
                    console.warn(`[${BOT_NAME}] Erreur auto-join :`, e.message);
                }
            }
            
            // Gérer le QR code si présent
            if (qr && !isConnected && !pairingRequested) {
                console.log(`[${BOT_NAME}] QR Code disponible pour ${cleanNumber}`);
                // Le QR code s'affiche automatiquement grâce à printQRInTerminal: true
            }
            
        } catch (err) {
            console.error(`[${BOT_NAME}] Erreur connection.update (${cleanNumber}) :`, err.message);
        }
    });
    
    // ── Gestion des messages ──
    sock.ev.on('messages.upsert', async (upsert) => {
        try {
            await handler(upsert, sock);
        } catch (err) {
            console.error(`[${BOT_NAME}] Erreur handler messages (${cleanNumber}) :`, err.message);
        }
    });
    
    // ── Gestion des participants de groupe ──
    sock.ev.on('group-participants.update', async (update) => {
        try {
            await group.welcome(update, sock);
        } catch (err) {
            console.error(`[${BOT_NAME}] Erreur welcome (${cleanNumber}) :`, err.message);
        }
    });
    
    // ── Gestion du pairing code (déclenché après connexion) ──
    const handlePairingCode = async () => {
        if (pairingRequested || state.creds.registered || !isConnected) {
            return;
        }
        
        pairingRequested = true;
        
        try {
            // Attendre que la connexion soit stable
            await delay(3000);
            
            if (!state.creds.registered && typeof sock.requestPairingCode === 'function') {
                await requestPairingCodeWithRetry(sock, cleanNumber, 3);
            }
        } catch (error) {
            console.warn(`[${BOT_NAME}] Pairing code non disponible pour ${cleanNumber} :`, error.message);
            console.log(`[${BOT_NAME}] Utilisez le QR code affiché ci-dessus`);
        }
    };
    
    // ── Configuration des timeouts ──
    pairingTimeout = setTimeout(() => {
        if (isConnected && !state.creds.registered) {
            handlePairingCode().catch(console.error);
        }
    }, 8000);
    
    removalTimeout = setTimeout(() => {
        if (!state.creds.registered && !isConnected) {
            console.log(`[${BOT_NAME}] Échec d'authentification - suppression ${cleanNumber}`);
            removeSession(cleanNumber);
        }
    }, 120000); // 2 minutes
    
    // Arrêter les timeouts si connecté
    sock.ev.on('connection.update', (update) => {
        if (update.connection === 'open') {
            clearTimeout(pairingTimeout);
            clearTimeout(removalTimeout);
        }
    });
    
    // ── Enregistrement de la session ──
    sessions.set(cleanNumber, sock);
    saveSessionNumber(cleanNumber);
    
    // ── Configuration initiale si demandée ──
    if (initConfig) {
        const cfg = getConfig();
        cfg.users[cleanNumber] = {
            antilink: false,
            autoreact: false,
            like: false,
            online: false,
            prefix: '.',
            record: false,
            response: true,
            sudoList: [],
            tagAudioPath: 'tag.mp3',
            type: false,
            welcome: false
        };
        await configManager.save();
    }
    
    // Définir comme session primaire
    const cfg = getConfig();
    cfg.users.root.primary = cleanNumber;
    await configManager.save();
    
    console.log(`[${BOT_NAME}] Session ${cleanNumber} initialisée.`);
    console.log(`[${BOT_NAME}] ${BOT_SIGNATURE}`);
    
    return sock;
}

// ── 9. Fonction pour arrêter proprement une session -------------------------
async function stopSession(number) {
    const cleanNumber = cleanPhoneNumber(number);
    const sock = sessions.get(cleanNumber);
    
    if (sock) {
        try {
            await sock.end();
            sessions.delete(cleanNumber);
            console.log(`[${BOT_NAME}] Session ${cleanNumber} arrêtée proprement.`);
        } catch (err) {
            console.error(`[${BOT_NAME}] Erreur arrêt session ${cleanNumber} :`, err.message);
        }
    }
}

// ── 10. Fonction pour obtenir le statut d'une session -----------------------
function getSessionStatus(number) {
    const cleanNumber = cleanPhoneNumber(number);
    const sock = sessions.get(cleanNumber);
    
    if (!sock) {
        return { exists: false, connected: false };
    }
    
    return {
        exists: true,
        connected: !!sock.user?.id,
        user: sock.user,
        phone: cleanNumber
    };
}

// ── 11. Export --------------------------------------------------------------
export default startSession;
export { 
    sessions, 
    stopSession, 
    getSessionStatus,
    removeSession,
    cleanPhoneNumber 
};
