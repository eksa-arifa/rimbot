import { type WAMessage } from "baileys"
import { getCommand } from "@/core/command"
import { RimBotConfig } from "@/config/rimbot"
import { baileys } from "@/config/baileys"
import { getMiddleware } from "@/core/middleware"
import { prisma } from "./db"
import { similarity } from "@/utils/matcher"


const handler = async (msg: WAMessage, sock: typeof baileys.sock, type: string, message: string) => {
    const commands = await getCommand(type)
    const userMsgArray = message.toLowerCase().split(" ")
    const userCommand = userMsgArray[0]
    const jid = msg.key.remoteJid as string

    let found = false
    let bestMatch = { cmd: "", score: 0 }

    for (const command of commands) {
        const prefixedCommand = `${RimBotConfig.prefix}${command[0]}`

        if (userCommand === prefixedCommand) {
            found = true
            await sock.readMessages([msg.key])
            await sock.sendMessage(jid, { react: { text: "⏳", key: msg.key } })

            const listMiddleware = command[1].middleware || []
            for (const middleware of listMiddleware) {
                const mod = await getMiddleware(middleware)
                try {
                    const allowed = await mod.execute(msg, sock, prisma)
                    if (!allowed) {
                        await sock.sendMessage(jid, { react: { text: "❌", key: msg.key } })
                        return
                    }
                } catch (err) {
                    console.error(`[Middleware Error: ${middleware}]`, err)
                    await sock.sendMessage(jid, { react: { text: "💥", key: msg.key } })
                    await sock.sendMessage(jid, {
                        text: `⚠️ Terjadi kesalahan pada middleware *${middleware}*. Coba lagi nanti ya.`,
                    }, { quoted: msg })
                    return
                }
            }

            try {
                await command[1].execute(msg, sock, prisma)
                await sock.sendMessage(jid, { react: { text: "✅", key: msg.key } })
            } catch (err) {
                console.error(`[Command Error: ${command[0]}]`, err)
                await sock.sendMessage(jid, { react: { text: "💥", key: msg.key } })
                await sock.sendMessage(jid, {
                    text: `💣 Terjadi kesalahan saat menjalankan perintah *${command[0]}*.\n\n${err instanceof Error ? err.message : "Coba ulangi nanti ya!"}`,
                }, { quoted: msg })
            }
            return
        }

        const score = similarity(userCommand, prefixedCommand)
        if (score > bestMatch.score) bestMatch = { cmd: prefixedCommand, score }
    }

    if (!found && bestMatch.score >= 0.6 && userCommand[0] == RimBotConfig.prefix) {
        await sock.sendMessage(jid, {
            text: `⚙️ Command tidak dikenali. Mungkin maksud kamu *${bestMatch.cmd}* ?`
        }, { quoted: msg })
    }
}

export { handler }
