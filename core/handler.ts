import { type WAMessage } from "baileys"
import { loadCommand } from "./command.ts"
import { RimBotConfig } from "../config/rimbot.ts"
import { baileys } from "../config/baileys.ts"




const handler= async (msg: WAMessage, sock: typeof baileys.sock, type: string)=>{
    const commands = await loadCommand(type)

    for(let command of commands){
        const prefixedCommand = `${RimBotConfig.prefix}${command[0]}`

        const userMsgArray: string[] = msg.message?.conversation?.toLowerCase().split(" ") as string[]

        if(userMsgArray[0] == prefixedCommand){
            await sock.readMessages([msg.key])

            await command[1](msg, sock)

            await sock.sendMessage(msg.key.remoteJid as string, {
                react: {
                    text: '✅',
                    key: msg.key
                }
            })
        }
    }
}


export {handler}