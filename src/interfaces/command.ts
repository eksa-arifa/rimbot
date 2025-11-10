import { baileys } from "@/config/baileys"
import { PrismaClient } from "@/generated/prisma/client"
import { GlobalOmitConfig, LogLevel } from "@/generated/prisma/internal/prismaNamespace"
import { DefaultArgs } from "@prisma/client/runtime/library"
import { WAMessage } from "baileys"



interface Command {
    name : string,
    middleware? : string[],
    execute : (msg: WAMessage, sock: typeof baileys.sock, db: PrismaClient<LogLevel, GlobalOmitConfig, DefaultArgs>) => void
}


export {Command}