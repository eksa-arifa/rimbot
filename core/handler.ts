import { type WAMessage } from "baileys"
import { loadCommand } from "./command.ts"
import { RimBotConfig } from "../config/rimbot.ts"
import { baileys } from "../config/baileys.ts"




const handler= async (msg: WAMessage, sock: typeof baileys.sock, type: string)=>{
    const commands = await loadCommand(type)


    for(let command of commands){
        const prefixedCommand = `${RimBotConfig.prefix}${command[0]}`

        if(msg.message?.conversation?.toLowerCase() == prefixedCommand){
            await command[1](msg, sock)
        }
    }
}


export {handler}