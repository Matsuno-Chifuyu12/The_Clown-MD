// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Telegram Bot Message Handler (Premium + Utils)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from 'fs';
import start from '../commands/start.js';
import menu from '../commands/menu.js';
import handleCheckJoin from '../utils/checkJoin.js';
import { isUserInChannel } from '../utils/checkmember.js';
import sessionCount from '../utils/sessionCount.js';
import redirect from '../utils/redirect.js';
import { OWNER_ID, LIMIT } from '../config.js'; // ✅ PUB retiré
import connect from '../utils/connect.js';
import disconnect from '../utils/disconnect.js';
import { getCreds } from '../credits.js';

// ─── PREMIUM CACHE SYSTEM ────────────────────────────────────────────
let premiumCache = null;
let premiumLastModified = 0;

function loadPremiumData() {
  try {
    const stats = fs.statSync('./prem.json');
    if (!premiumCache || stats.mtimeMs > premiumLastModified) {
      premiumCache = JSON.parse(fs.readFileSync('./prem.json', 'utf-8'));
      premiumLastModified = stats.mtimeMs;
    }
    return premiumCache;
  } catch (error) {
    console.error('❌ Erreur lecture fichier premium:', error.message);
    return { users: [] };
  }
}

// ✅ FONCTION isPremium CORRIGÉE (sans PUB)
function isPremium(userId) {
  const data = loadPremiumData();
  return data.users.includes(userId.toString()); // ✅ Retiré la référence à PUB
}

function addPremium(userId) {
  try {
    const data = loadPremiumData();
    const userIdStr = userId.toString();
    if (!data.users.includes(userIdStr)) {
      data.users.push(userIdStr);
      fs.writeFileSync('./prem.json', JSON.stringify(data, null, 2));
      premiumCache = data;
      premiumLastModified = Date.now();
    }
  } catch (error) {
    console.error('❌ Erreur ajout premium:', error.message);
  }
}

function removePremium(userId) {
  try {
    const data = loadPremiumData();
    const userIdStr = userId.toString();
    data.users = data.users.filter(id => id !== userIdStr);
    fs.writeFileSync('./prem.json', JSON.stringify(data, null, 2));
    premiumCache = data;
    premiumLastModified = Date.now();
  } catch (error) {
    console.error('❌ Erreur suppression premium:', error.message);
  }
}

function encode(id, dur) {
  const expiry = Date.now() + dur * 24 * 60 * 60 * 1000;
  return Buffer.from(`${id}|${expiry}`).toString("base64");
}

// ─── CACHE POUR ADHÉSION ────────────────────────────────────────────
const membershipCache = new Map();
const CACHE_TTL = 30000; // 30 sec

async function checkMembershipCached(bot, userId) {
  const cacheKey = userId.toString();
  const cached = membershipCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    return cached.result;
  }
  const result = await isUserInChannel(bot, userId);
  membershipCache.set(cacheKey, { result, timestamp: Date.now() });
  return result;
}

// ─── MESSAGE HANDLER ─────────────────────────────────────────────
export function messageHandler(bot) {

  // Helper premium
  const handlePremiumCommand = async (msg, callback) => {
    const userId = msg.from.id;
    const [isMember, isPrem] = await Promise.all([
      checkMembershipCached(bot, userId),
      Promise.resolve(isPremium(userId))
    ]);

    if (!isMember) return await start(bot, msg);
    if (!isPrem) {
      return bot.sendMessage(msg.chat.id, "❌ Accès réservé aux utilisateurs premium | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴");
    }
    return callback();
  };

  // ─── Commandes de base ───
  bot.onText(/\/start/, async (msg) => await start(bot, msg));

  bot.onText(/\/myid/, async (msg) => {
    await bot.sendMessage(msg.chat.id, `🆔 Votre ID Telegram: \`${msg.from.id}\``, { parse_mode: 'Markdown' });
  });

  // ─── Commandes premium ───
  bot.onText(/\/menu/, async (msg) => {
    await handlePremiumCommand(msg, () => menu(bot, msg));
  });

  bot.onText(/\/connect(?:\s+(.+))?/, async (msg, match) => {
    await handlePremiumCommand(msg, async () => {
      const session = sessionCount();
      session >= LIMIT ? await redirect(bot, msg) : await connect.connect(bot, msg, match);
    });
  });

  bot.onText(/\/disconnect(?:\s+(.+))?/, async (msg, match) => {
    await handlePremiumCommand(msg, async () => {
      const session = sessionCount();
      session >= LIMIT ? await redirect(bot, msg) : await disconnect(bot, msg, match);
    });
  });

  // ─── Callback queries ───
  bot.on('callback_query', async (callbackQuery) => {
    if (callbackQuery.data === 'check_join') {
      await handleCheckJoin(bot, callbackQuery);
    }
  });

  // ─── Commandes admin ───
  bot.onText(/\/addprem(?:\s+(.+))?/, async (msg, match) => {
    if (msg.from.id.toString() !== OWNER_ID) {
      return bot.sendMessage(msg.chat.id, "❌ Accès refusé | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴");
    }
    const targetId = match?.[1]?.trim();
    if (!targetId) return bot.sendMessage(msg.chat.id, "❌ Usage: /addprem <user_id>");
    addPremium(targetId);
    bot.sendMessage(msg.chat.id, `✅ Utilisateur ${targetId} ajouté au premium`);
  });

  bot.onText(/\/delprem(?:\s+(.+))?/, async (msg, match) => {
    if (msg.from.id.toString() !== OWNER_ID) {
      return bot.sendMessage(msg.chat.id, "❌ Accès refusé | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴");
    }
    const targetId = match?.[1]?.trim();
    if (!targetId) return bot.sendMessage(msg.chat.id, "❌ Usage: /delprem <user_id>");
    removePremium(targetId);
    bot.sendMessage(msg.chat.id, `✅ Utilisateur ${targetId} retiré du premium`);
  });

  bot.onText(/\/keygen(?:\s+(.+))?/, async (msg, match) => {
    const creds = getCreds();
    if (msg.from.id.toString() !== creds.telegram_id) {
      return bot.sendMessage(msg.chat.id, "❌ Accès refusé | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴");
    }
    if (!match?.[1]) {
      return bot.sendMessage(msg.chat.id, "❌ Usage: /keygen <duration_days> <user_id>");
    }
    const args = match[1].trim().split(/\s+/);
    const dur = Number(args[0]);
    const id = args[1];
    if (!id || isNaN(dur) || dur <= 0) {
      return bot.sendMessage(msg.chat.id, "❌ Duration must be a positive number and user ID required");
    }
    const code = encode(id, dur);
    bot.sendMessage(
      msg.chat.id,
      `🗝️ Code pour ${id}:\n\`\`\`${code}\`\`\`\n⏰ Durée: ${dur} jour(s) | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴`,
      { parse_mode: "Markdown" }
    );
  });

        }
