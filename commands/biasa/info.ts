import { type WAMessage } from "baileys"
import { RimBotConfig } from "../../config/rimbot.ts";
import { baileys } from "../../config/baileys.ts";




const info = async (msg: WAMessage, sock: typeof baileys.sock) => {

    const latency = Date.now() - (Date.now());

    await sock.sendMessage(msg.key.remoteJid as string, {
        text: `
        🤖 *RIMBOT BY REMMY*

╭───〔 *💡 BOT STATUS* 〕
│📦 Version: _1.3.2_
│⚙️ Mode: _Public_
│📡 Prefix: \`${RimBotConfig.prefix} \`
╰───────────────

╭───〔 *👤 OWNER INFO* 〕
│👑 Name: _Eksa Arifa_
│💬 WhatsApp: wa.me/628xxxxxxxxxx
│🌐 Website: _https://muheksarifa.vercel.app_
╰───────────────

╭───〔 *📊 SYSTEM INFO* 〕
│💻 Platform: _Node.js v20_
│📈 Memory: _${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB_
│⏱️ Response Time: _${latency} ms_
╰───────────────

✨ _Ketik .menu untuk melihat semua command tersedia._
        `
    })
}




export default info