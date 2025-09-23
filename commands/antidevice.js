import fs from 'fs/promises';
import path from 'path';

const FILE = path.resolve('./antidevice.json');
const DEVICES_FILE = path.resolve('./antidevice_devices.json');

// Appareils prédéfinis avec leurs identifiants
const PREDEFINED_DEVICES = {
  'IPHONE_15': {
    id: 'iPhone15,1',
    name: 'iPhone 15 Pro Max',
    platform: 'iOS',
    version: '17.0.0',
    description: 'Dernier iPhone Pro'
  },
  'SAMSUNG_S23': {
    id: 'SM-S918B',
    name: 'Samsung Galaxy S23 Ultra',
    platform: 'Android',
    version: '14.0.0',
    description: 'Flagship Samsung'
  },
  'XIAOMI_13': {
    id: '2211133G',
    name: 'Xiaomi 13 Pro',
    platform: 'Android',
    version: '13.0.0',
    description: 'Xiaomi haut de gamme'
  },
  'GOOGLE_PIXEL': {
    id: 'GP4BC',
    name: 'Google Pixel 8 Pro',
    platform: 'Android',
    version: '14.0.0',
    description: 'Pixel dernière génération'
  },
  'WHATSAPP_WEB': {
    id: 'Web_4.0.0',
    name: 'WhatsApp Web',
    platform: 'Browser',
    version: '4.0.0',
    description: 'Version navigateur'
  },
  'DESKTOP_WIN': {
    id: 'Desktop_Win_2.0.0',
    name: 'WhatsApp Desktop Windows',
    platform: 'Windows',
    version: '2.0.0',
    description: 'Application Windows'
  }
};

class SebastianMichaelis {
  constructor() {
    this.responses = {
      activation: [
        "Très bien, Monsieur/Madame. La protection anti-device a été activée avec succès.",
        "Comme vous le souhaitez. Votre appareil sera désormais masqué.",
        "Parfait. Je me charge de dissimuler votre identité numérique."
      ],
      deactivation: [
        "La protection anti-device a été désactivée, comme vous l'avez demandé.",
        "Très bien. Votre appareil réel sera à nouveau visible.",
        "La dissimulation est terminée, Monsieur/Madame."
      ],
      device_selection: [
        "Excellente choix. L'appareil a été configuré selon vos préférences.",
        "Comme vous le souhaitez. La configuration est appliquée.",
        "Parfait. Votre nouvelle identité numérique est en place."
      ],
      error: [
        "Je m'excuse, mais une erreur s'est produite lors de l'opération.",
        "Pardonnez-moi, il semble y avoir un problème technique.",
        "Je regrette, mais l'opération n'a pu être complétée."
      ],
      status: [
        "Voici le statut actuel de votre protection, Monsieur/Madame.",
        "Comme vous le demandez, voici l'état de la configuration.",
        "Permettez-moi de vous présenter le statut actuel."
      ]
    };
  }

  getResponse(type, additionalInfo = '') {
    const responses = this.responses[type] || ["Comme vous le souhaitez."];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return `${randomResponse}${additionalInfo ? ` ${additionalInfo}` : ''}`;
  }

  formatDeviceList(devices) {
    let message = "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 📱 *Appareils disponibles :*\n│ \n";
    Object.keys(devices).forEach((key, index) => {
      const device = devices[key];
      message += `│ ${index + 1}. *${key}* - ${device.name}\n│    📋 ${device.description}\n│    ⚙️ ${device.platform} ${device.version}\n│    🆔 ${device.id}\n│ \n`;
    });
    message += "│ _Veuillez répondre avec le nom de l'appareil_\n│ _(ex: IPHONE_15)_\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯";
    return message;
  }

  formatStatus(status, deviceInfo) {
    if (status.enabled) {
      return `╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴 *Statut de la protection Anti-Device* 🛡️\n│ \n│ ✅ **Protection:** Active\n│ 📱 **Appareil simulé:** ${deviceInfo?.name || 'Inconnu'}\n│ 🆔 **Identifiant:** ${status.deviceId || 'Non défini'}\n│ 📊 **Messages protégés:** ${status.messageCount || 0}\n│ 🕒 **Activée le:** ${new Date(status.activatedAt).toLocaleString('fr-FR')}\n│ \n│ _Votre appareil réel est parfaitement dissimulé._\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`;
    } else {
      return `╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🔓 *Statut de la protection Anti-Device* 🔓\n│ \n│ ❌ **Protection:** Inactive\n│ 📱 Votre appareil réel est actuellement visible\n│ \n│ _Pour activer, utilisez !antidevice_\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`;
    }
  }
}

const sebastian = new SebastianMichaelis();

async function loadStore() {
  try {
    const raw = await fs.readFile(FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

async function loadDevicesStore() {
  try {
    const raw = await fs.readFile(DEVICES_FILE, 'utf8');
    const data = JSON.parse(raw);
    return { ...PREDEFINED_DEVICES, ...data.customDevices };
  } catch (e) {
    return PREDEFINED_DEVICES;
  }
}

async function saveStore(store) {
  await fs.writeFile(FILE, JSON.stringify(store, null, 2), 'utf8');
}

async function saveCustomDevice(deviceKey, deviceInfo) {
  try {
    let data = {};
    try {
      const raw = await fs.readFile(DEVICES_FILE, 'utf8');
      data = JSON.parse(raw);
    } catch (e) {
      data = { customDevices: {} };
    }
    
    if (!data.customDevices) data.customDevices = {};
    data.customDevices[deviceKey] = deviceInfo;
    
    await fs.writeFile(DEVICES_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ Error saving custom device:\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯", error);
    return false;
  }
}

export async function isAntiDeviceEnabled(jid) {
  const store = await loadStore();
  return store[jid] && store[jid].enabled;
}

export async function getCurrentDeviceConfig(jid) {
  const store = await loadStore();
  const userConfig = store[jid];
  
  if (!userConfig || !userConfig.enabled) {
    return null;
  }
  
  const allDevices = await loadDevicesStore();
  return allDevices[userConfig.deviceKey] || null;
}

export async function activateAntiDevice(jid, deviceKey = null) {
  const store = await loadStore();
  const allDevices = await loadDevicesStore();
  
  if (deviceKey && !allDevices[deviceKey]) {
    throw new Error(`Appareil "${deviceKey}" non trouvé.`);
  }
  
  // Si aucun appareil spécifié, demander plus tard
  const selectedDeviceKey = deviceKey || 'PENDING_SELECTION';
  
  store[jid] = {
    enabled: true,
    deviceKey: selectedDeviceKey,
    deviceId: deviceKey ? allDevices[deviceKey]?.id : null,
    activatedAt: new Date().toISOString(),
    messageCount: 0,
    lastActive: new Date().toISOString()
  };
  
  await saveStore(store);
  
  return {
    enabled: true,
    deviceKey: selectedDeviceKey,
    needsDeviceSelection: !deviceKey
  };
}

export async function deactivateAntiDevice(jid) {
  const store = await loadStore();
  
  if (store[jid]) {
    store[jid].enabled = false;
    store[jid].deactivatedAt = new Date().toISOString();
    await saveStore(store);
  }
  
  return { enabled: false };
}

export async function setDevice(jid, deviceKey) {
  const store = await loadStore();
  const allDevices = await loadDevicesStore();
  
  if (!allDevices[deviceKey]) {
    throw new Error(`Appareil "${deviceKey}" non trouvé.`);
  }
  
  if (!store[jid]) {
    store[jid] = {};
  }
  
  store[jid].deviceKey = deviceKey;
  store[jid].deviceId = allDevices[deviceKey].id;
  store[jid].lastUpdated = new Date().toISOString();
  
  if (store[jid].enabled && store[jid].deviceKey === 'PENDING_SELECTION') {
    store[jid].deviceKey = deviceKey;
  }
  
  await saveStore(store);
  return allDevices[deviceKey];
}

export async function recordMessageSent(jid) {
  const store = await loadStore();
  if (store[jid] && store[jid].enabled) {
    store[jid].messageCount = (store[jid].messageCount || 0) + 1;
    store[jid].lastActive = new Date().toISOString();
    await saveStore(store);
  }
}

export async function addCustomDevice(jid, deviceKey, deviceInfo) {
  const customDevice = {
    id: deviceInfo.id,
    name: deviceInfo.name || deviceKey,
    platform: deviceInfo.platform || 'Custom',
    version: deviceInfo.version || '1.0.0',
    description: deviceInfo.description || 'Appareil personnalisé',
    custom: true
  };
  
  const success = await saveCustomDevice(deviceKey, customDevice);
  if (success) {
    await setDevice(jid, deviceKey);
  }
  return success;
}

// Gestionnaire de commande principal
export async function handleAntiDeviceCommand(conn, mek, m, { from, isGroup, sender, pushname }, args) {
  try {
    const remoteJid = mek.key.remoteJid;
    const isEnabled = await isAntiDeviceEnabled(sender);
    
    if (args.length === 0) {
      // Afficher le statut ou basculer
      if (isEnabled) {
        await deactivateAntiDevice(sender);
        await conn.sendMessage(remoteJid, { 
          text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🔓 " + sebastian.getResponse('deactivation') + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯"
        });
      } else {
        const result = await activateAntiDevice(sender);
        const allDevices = await loadDevicesStore();
        
        if (result.needsDeviceSelection) {
          await conn.sendMessage(remoteJid, { 
            text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🛡️ " + sebastian.getResponse('activation') + "\n│ \n│ Maintenant, veuillez choisir l'appareil à simuler :\n│ \n" + sebastian.formatDeviceList(allDevices) + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯"
          });
        } else {
          const deviceInfo = allDevices[result.deviceKey];
          await conn.sendMessage(remoteJid, { 
            text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🛡️ " + sebastian.getResponse('device_selection', `Votre appareil apparaîtra maintenant comme un ${deviceInfo.name}.`) + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯"
          });
        }
      }
    } else {
      // Gérer les sous-commandes
      const subCommand = args[0].toLowerCase();
      
      switch (subCommand) {
        case 'on':
          const deviceKey = args[1]?.toUpperCase();
          if (deviceKey) {
            await activateAntiDevice(sender, deviceKey);
            const deviceInfo = (await loadDevicesStore())[deviceKey];
            await conn.sendMessage(remoteJid, { 
              text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🛡️ " + sebastian.getResponse('device_selection', `L'appareil ${deviceInfo.name} a été sélectionné.`) + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯"
            });
          } else {
            await handleAntiDeviceCommand(conn, mek, m, { from, isGroup, sender, pushname }, []);
          }
          break;
          
        case 'off':
          await deactivateAntiDevice(sender);
          await conn.sendMessage(remoteJid, { 
            text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🔓 " + sebastian.getResponse('deactivation') + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯"
          });
          break;
          
        case 'status':
          await handleDeviceStatus(conn, mek, m, { from, isGroup, sender, pushname });
          break;
          
        case 'list':
          await handleDeviceList(conn, mek, m, { from, isGroup, sender, pushname });
          break;
          
        case 'set':
          if (args.length < 2) {
            await conn.sendMessage(remoteJid, { 
              text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ " + sebastian.getResponse('error', 'Veuillez spécifier un appareil. Utilisez !antidevice list pour voir les options.') + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯"
            });
            return;
          }
          const setDeviceKey = args[1].toUpperCase();
          await setDevice(sender, setDeviceKey);
          const deviceInfo = (await loadDevicesStore())[setDeviceKey];
          await conn.sendMessage(remoteJid, { 
            text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🛡️ " + sebastian.getResponse('device_selection', `Appareil défini sur ${deviceInfo.name}.`) + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯"
          });
          break;
          
        default:
          // Si c'est un nom d'appareil directement
          const directDeviceKey = args[0].toUpperCase();
          const allDevices = await loadDevicesStore();
          if (allDevices[directDeviceKey]) {
            await activateAntiDevice(sender, directDeviceKey);
            const deviceInfo = allDevices[directDeviceKey];
            await conn.sendMessage(remoteJid, { 
              text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🛡️ " + sebastian.getResponse('device_selection', `Protection activée avec l'appareil ${deviceInfo.name}.`) + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯"
            });
          } else {
            await conn.sendMessage(remoteJid, { 
              text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ " + sebastian.getResponse('error', 'Commande non reconnue. Utilisez !antidevice list pour voir les options.') + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯"
            });
          }
      }
    }
  } catch (err) {
    await conn.sendMessage(remoteJid, { 
      text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ " + sebastian.getResponse('error', `Détails: ${err.message}`) + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯"
    });
  }
}

export async function handleDeviceStatus(conn, mek, m, { from, isGroup, sender, pushname }) {
  try {
    const remoteJid = mek.key.remoteJid;
    const store = await loadStore();
    const userConfig = store[sender];
    const allDevices = await loadDevicesStore();
    
    const deviceInfo = userConfig?.deviceKey ? allDevices[userConfig.deviceKey] : null;
    
    await conn.sendMessage(remoteJid, { 
      text: sebastian.formatStatus(userConfig || { enabled: false }, deviceInfo)
    });
  } catch (err) {
    await conn.sendMessage(remoteJid, { 
      text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ " + sebastian.getResponse('error', `Détails: ${err.message}`) + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯"
    });
  }
}

export async function handleDeviceList(conn, mek, m, { from, isGroup, sender, pushname }) {
  try {
    const remoteJid = mek.key.remoteJid;
    const allDevices = await loadDevicesStore();
    
    await conn.sendMessage(remoteJid, { 
      text: sebastian.formatDeviceList(allDevices)
    });
  } catch (err) {
    await conn.sendMessage(remoteJid, { 
      text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ " + sebastian.getResponse('error', `Détails: ${err.message}`) + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯"
    });
  }
}

// Middleware pour appliquer la configuration d'appareil aux messages
export function createDeviceSpoofMiddleware() {
  return {
    preMessageSending: async (jid, messageData) => {
      try {
        const deviceConfig = await getCurrentDeviceConfig(jid);
        if (deviceConfig) {
          // Modifier les métadonnées de l'appareil
          messageData.deviceInfo = {
            id: deviceConfig.id,
            platform: deviceConfig.platform,
            version: deviceConfig.version
          };
          
          await recordMessageSent(jid);
          console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🛡️ Anti-Device: Message envoyé avec appareil " + deviceConfig.name + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
        }
      } catch (error) {
        console.error("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ Error in device spoof middleware:\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯", error);
      }
    }
  };
}

export default {
  isAntiDeviceEnabled,
  getCurrentDeviceConfig,
  activateAntiDevice,
  deactivateAntiDevice,
  setDevice,
  addCustomDevice,
  handleAntiDeviceCommand,
  handleDeviceStatus,
  handleDeviceList,
  createDeviceSpoofMiddleware
};
