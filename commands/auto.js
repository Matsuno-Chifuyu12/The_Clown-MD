import configManager from '../utils/managerConfigs.js';

// Cache et gestion des timeouts
const userNumberCache = new Map();
const timeoutHandlers = new Map();

// Récupère le numéro de l'utilisateur depuis le client
function getUserNumber(client) {
    if (!client?.user?.id) return null;
    const clientId = client.user.id;
    if (userNumberCache.has(clientId)) return userNumberCache.get(clientId);
    const number = clientId.split(':')[0];
    userNumberCache.set(clientId, number);
    return number;
}

// Mise à jour de présence sécurisée (évite les crashs silencieux)
async function updatePresenceSafely(client, presence, remoteJid) {
    try {
        await client.sendPresenceUpdate(presence, remoteJid);
        return true;
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de présence (${presence}):`, error.message);
        return false;
    }
}

// Nettoyer un ancien timeout s’il existe
function clearExistingTimeout(remoteJid) {
    if (timeoutHandlers.has(remoteJid)) {
        clearTimeout(timeoutHandlers.get(remoteJid));
        timeoutHandlers.delete(remoteJid);
    }
}

// Fonction : auto-enregistrement (micro)
export async function autorecord(message, client) {
    if (!message?.key?.remoteJid || !client) return;

    const remoteJid = message.key.remoteJid;
    const number = getUserNumber(client);
    if (!number) return;

    const state = configManager.config?.users[number]?.record;
    if (!state) return;

    clearExistingTimeout(remoteJid);

    const success = await updatePresenceSafely(client, 'recording', remoteJid);
    if (success) {
        const timeoutId = setTimeout(async () => {
            await updatePresenceSafely(client, 'available', remoteJid);
            timeoutHandlers.delete(remoteJid);
        }, 5000);
        timeoutHandlers.set(remoteJid, timeoutId);
    }
}

// Fonction : auto-typing (écriture)
export async function autotype(message, client) {
    if (!message?.key?.remoteJid || !client) return;

    const remoteJid = message.key.remoteJid;
    const number = getUserNumber(client);
    if (!number) return;

    const state = configManager.config?.users[number]?.type;
    if (!state) return;

    clearExistingTimeout(remoteJid);

    const success = await updatePresenceSafely(client, 'composing', remoteJid);
    if (success) {
        const timeoutId = setTimeout(async () => {
            await updatePresenceSafely(client, 'available', remoteJid);
            timeoutHandlers.delete(remoteJid);
        }, 5000);
        timeoutHandlers.set(remoteJid, timeoutId);
    }
}

// Nettoyage global (appelé lors du restart ou du stop du bot)
export function cleanupPresenceTimers() {
    for (const timeoutId of timeoutHandlers.values()) clearTimeout(timeoutId);
    timeoutHandlers.clear();
    userNumberCache.clear();
}

export default { autorecord, autotype, cleanupPresenceTimers };
