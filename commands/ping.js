const BOT_NAME = "🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛭𝑫🎴";
const CREATOR = "🎴𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴";

export async function pingCommand(message, client) {
    const remoteJid = message.key.remoteJid;
    const startTime = Date.now();

    const sentMessage = await client.sendMessage(remoteJid, { text: '⏳ Vérification en cours...' });

    const endTime = Date.now();
    const latency = endTime - startTime;

    await client.sendMessage(remoteJid, {
        text: 
`> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │        ${BOT_NAME} 
> │  ❃ 𝗢𝘄𝗻𝗲𝗿 :  ${CREATOR}
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> │    _🏓 Pong : ${latency} ms_
> │    _🎴 Speed Test : ${Math.round(latency / 2)} ms_
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`,
    }, { quoted: sentMessage });

    console.log(`[${BOT_NAME}]`);
}

export default pingCommand;
