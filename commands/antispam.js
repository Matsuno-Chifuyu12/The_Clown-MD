//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// AntiSpam Guard (anti-flood)
// Supprime un membre s'il envoie >= THRESHOLD messages en WINDOW ms
// Style : Majordome Sébastien Michaelis (messages & logs)
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function AntiSpamGuard(client, opts = {}) {
  const BOT_NAME = "🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴";
  const {
    threshold = 5,
    windowMs = 10_000,
    cleanupIntervalMs = 60_000,
    exemptAdmins = true
  } = opts;

  // Map<chatId, Map<userId, Array<timestamp>>>
  const chatMap = new Map();

  // Periodic cleanup to avoid memory growth
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [chatId, userMap] of chatMap.entries()) {
      for (const [userId, timestamps] of userMap.entries()) {
        const filtered = timestamps.filter(ts => now - ts <= windowMs);
        if (filtered.length === 0) userMap.delete(userId);
        else userMap.set(userId, filtered);
      }
      if (userMap.size === 0) chatMap.delete(chatId);
    }
  }, cleanupIntervalMs);

  cleanupTimer.unref?.(); // don't keep event loop alive if possible

  /**
   * Handler to be called for each upserted message(s)
   * Accepts the same object emitted by sock.ev.on('messages.upsert', ...)
   */
  return async function handleAntiSpam(upsert) {
    try {
      const now = Date.now();

      // messages might be array or object depending on library - normalize
      const messages = Array.isArray(upsert.messages) ? upsert.messages : (upsert.messages ? [upsert.messages] : (upsert || []));
      for (const msg of messages) {
        // Skip non-message types or status broadcasts
        if (!msg || !msg.key) continue;

        const remoteJid = msg.key.remoteJid;
        const fromMe = !!msg.key.fromMe;
        const participant = msg.key.participant || msg.key.remoteJid; // participant for groups
        if (!remoteJid || !participant) continue;

        // Only apply in groups (group JIDs usually contain "g.us" or similar).
        // To be safe, treat any remoteJid containing '@g.us' or ending with 'g.us' as group.
        const isGroup = String(remoteJid).includes('@g.us') || String(remoteJid).includes('g.us') || String(remoteJid).includes('gchat');
        if (!isGroup) continue;

        // Ignore messages from the bot itself
        if (fromMe) continue;

        // Initialize maps
        if (!chatMap.has(remoteJid)) chatMap.set(remoteJid, new Map());
        const userMap = chatMap.get(remoteJid);
        const userId = participant;

        // Record timestamp
        const arr = userMap.get(userId) || [];
        arr.push(now);

        // Keep only timestamps inside the window
        const windowed = arr.filter(ts => now - ts <= windowMs);
        userMap.set(userId, windowed);

        // If threshold reached -> punitive action
        if (windowed.length >= threshold) {
          // Double-check: optional exempt admins
          let isAdmin = false;
          if (exemptAdmins) {
            try {
              // try to fetch participant metadata to check role
              const meta = await client.groupMetadata(remoteJid).catch(() => null);
              if (meta && Array.isArray(meta.participants)) {
                const p = meta.participants.find(x => x.id === userId);
                if (p && (p.admin === 'admin' || p.admin === 'superadmin' || p.isAdmin)) isAdmin = true;
              }
            } catch (e) {
              // ignore metadata errors; default to not admin
            }
          }

          if (isAdmin) {
            // Notify and reset their count (avoid kicking admins)
            await client.sendMessage(remoteJid, {
              text:
`${BOT_NAME}:  
Cher @${userId.split('@')[0]}, vous avez été détecté comme actif excessivement. En tant qu'administrateur, je n'exécuterai pas l'expulsion, mais je vous prie instamment de modérer vos interventions.`,
              mentions: [userId]
            }).catch(() => null);

            // reset their timestamps to avoid repeated warnings
            userMap.set(userId, []);
            console.log(`[${BOT_NAME}] AntiSpam: admin ${userId} warned in ${remoteJid}`);
            continue;
          }

          // Proceed to remove the user
          try {
            // Compose elegant message before removal
            await client.sendMessage(remoteJid, {
              text:
`${BOT_NAME}:
Sir @${userId.split('@')[0]}, votre activité a dépassé les limites tolérées (≥ ${threshold} messages en ${Math.round(windowMs/1000)}s).  
Par ordre, je procède à votre retrait, afin de préserver l'ordre.`,
              mentions: [userId]
            });
          } catch (e) {
            // ignore send failure
          }

          try {
            // Remove the user from group
            await client.groupParticipantsUpdate(remoteJid, [userId], "remove");
            console.log(`[${BOT_NAME}] AntiSpam: removed ${userId} from ${remoteJid} (threshold ${threshold} in ${windowMs}ms)`);
          } catch (err) {
            console.error(`[${BOT_NAME}] AntiSpam: failed to remove ${userId} from ${remoteJid}:`, err);
            // If remove fails, attempt to delete their messages locally if possible (best-effort)
            try {
              // best-effort: delete recent messages in window (some clients support delete by id)
              // Not implemented generically because APIs differ — left intentionally minimal and safe.
            } catch (e) { /* ignore */ }
          }

          // clear counters for this user after action
          userMap.delete(userId);
        }
      }
    } catch (err) {
      console.error(`[🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴] AntiSpam handler error:`, err);
    }
  };
}

export default AntiSpamGuard;
