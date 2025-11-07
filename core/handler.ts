import { type WAMessage } from "baileys"
import { getCommand } from "./command.ts"
import { RimBotConfig } from "../config/rimbot.ts"
import { baileys } from "../config/baileys.ts"




const handler = async (msg: WAMessage, sock: typeof baileys.sock, type: string, message: string) => {
    const commands = getCommand(type)

    for (let command of commands) {
        console.log(command)
        const prefixedCommand = `${RimBotConfig.prefix}${command[0]}`

        const userMsgArray: string[] = message.toLowerCase().split(" ") as string[]

        if (userMsgArray[0] == prefixedCommand) {
            await sock.readMessages([msg.key])

            const mod = await import(command[1])

            await mod.default(msg, sock)

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