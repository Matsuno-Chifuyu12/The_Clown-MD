// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// autoJoin.js
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// Gestion d’adhésion automatique à un canal/newsletter
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Cache pour l'encodeur
const textEncoder = new TextEncoder();

async function autoJoin(sock, channelId, cont = {}) {
    const jid = channelId;
    const server = 's.whatsapp.net';
    const queryId = '24404358912487870'; // à adapter si nécessaire

    // Configuration du nœud XML pour la requête d'adhésion
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
                content: textEncoder.encode(JSON.stringify({
                    variables: {
                        newsletter_id: jid,
                        ...cont
                    }
                }))
            }
        ]
    };

    try {
        const joinResponse = await sock.query(joinNode);
        console.log(`✅ Demande d'adhésion envoyée: ${jid} | 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴`);
        return joinResponse;
    } catch (err) {
        console.error(`❌ Erreur lors de l'adhésion pour ${jid}:`, err.message);
        throw err;
    }
}

export default autoJoin;
