import { type WAMessage } from "baileys"
import { getCommand } from "@/core/command"
import { RimBotConfig } from "@/config/rimbot"
import { baileys } from "@/config/baileys"




const handler = async (msg: WAMessage, sock: typeof baileys.sock, type: string, message: string) => {
    const commands = await getCommand(type)

    for (let command of commands) {
        const prefixedCommand = `${RimBotConfig.prefix}${command[0]}`

        const userMsgArray: string[] = message.toLowerCase().split(" ") as string[]

        if (userMsgArray[0] == prefixedCommand) {
            await sock.readMessages([msg.key])
            await sock.sendMessage(msg.key.remoteJid as string, {
                react: {
                    text: '⏳',
                    key: msg.key
                }
            })

            await command[1].execute(msg, sock)

            await sock.sendMessage(msg.key.remoteJid as string, {
                react: {
                    text: '✅',
                    key: msg.key
                }
            })
        }
    }
}


export { handler }