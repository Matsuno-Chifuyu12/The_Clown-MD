// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// autoJoin.js
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫 🎴
// Adhésion automatique à un canal / newsletter + récupération du dernier message
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const textEncoder = new TextEncoder();

async function autoJoin(sock, channelId, cont = {}) {
  const jid = channelId;
  const server = 's.whatsapp.net';
  const queryId = '24404358912487870'; // Identifiant fixe ou à adapter

  // ─────────────────────────────────────
  // Requête d’adhésion
  // ─────────────────────────────────────
  const joinNode = {
    tag: 'iq',
    attrs: {
      id: sock.generateMessageTag(),
      type: 'get',
      xmlns: 'w:mex',
      to: server,
    },
    content: [
      {
        tag: 'query',
        attrs: { query_id: queryId },
        content: textEncoder.encode(
          JSON.stringify({
            variables: {
              newsletter_id: jid,
              ...cont,
            },
          })
        ),
      },
    ],
  };

  // ─────────────────────────────────────
  // Récupération du dernier message
  // ─────────────────────────────────────
  const fetchNode = {
    tag: 'iq',
    attrs: {
      id: sock.generateMessageTag(),
      type: 'get',
      xmlns: 'newsletter',
      to: server,
    },
    content: [
      {
        tag: 'messages',
        attrs: {
          type: 'jid',
          jid: jid,
          count: '1', // récupère le dernier message
        },
        content: [],
      },
    ],
  };

  try {
    // Envoi de la requête d’adhésion
    const joinResponse = await sock.query(joinNode);
    console.log(`✅ Adhésion réussie au canal : ${jid}`);

    // Envoi de la requête de récupération des messages
    const fetchResponse = await sock.query(fetchNode);
    console.log(`📩 Dernier message récupéré pour ${jid}`);

    return {
      joined: true,
      joinResponse,
      lastMessage: fetchResponse,
    };
  } catch (err) {
    console.error(`❌ Échec de l’adhésion à ${jid} :`, err.message);
    return {
      joined: false,
      error: err.message,
    };
  }
}

export default autoJoin;
