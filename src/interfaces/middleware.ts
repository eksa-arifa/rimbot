import { baileys } from "@/config/baileys";
import { WAMessage } from "baileys";





interface Middleware{
    name: string,
    execute: (msg: WAMessage, sock: typeof baileys.sock) => Promise<boolean>
}



export { Middleware }