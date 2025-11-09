import { baileys } from "@/config/baileys"
import { WAMessage } from "baileys"



interface Command {
    name : string,
    middleware? : string[],
    execute : (msg: WAMessage, sock: typeof baileys.sock) => void
}


export {Command}