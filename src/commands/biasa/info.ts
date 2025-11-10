import { RimBotConfig } from "@/config/rimbot";
import { Command } from "@/interfaces/command";


const info: Command = {
    name: "info",
    async execute(msg, sock, db) {
        const uptime = Math.floor(process.uptime());


        await sock.sendMessage(msg.key.remoteJid as string, {
            image: {
                url: "https://itkoding.com/wp-content/uploads/2023/07/gambar-anime-keren-naruto-dan-sasuke.jpg"
            },
            caption: `
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
│⏱️ UpTime: _${uptime} s_
╰───────────────

✨ _Ketik ${RimBotConfig.prefix}menu untuk melihat semua command tersedia._
        `.trim()
        }, { quoted: msg })
    }
}




export default info