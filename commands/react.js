export async function react(message, client) {
    if (!message?.key?.remoteJid) return;
    
    try {
        await client.sendMessage(message.key.remoteJid, {
            react: {
                text: '🎴',
                key: message.key
            }
        });
    } catch (error) {
        console.error('❌ Erreur réaction:', error.message);
        // Ne pas bloquer l'exécution en cas d'erreur
    }
}

export default react;
