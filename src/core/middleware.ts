import { RimBotConfig } from "@/config/rimbot"
import { Middleware } from "@/interfaces/middleware"
import { readdirSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"




const middlewarePath = join(RimBotConfig.dirname, "..", "middlewares")
const cachePath = join(RimBotConfig.dirname, "..", "cache")
const jsonPath = join(cachePath, "middlewares.json")

const loadMiddleware = async ()=>{
    const middlewareDir = readdirSync(middlewarePath)

    const exports: Record<string, string> = {}
    
    for(const middleware of middlewareDir){
        const filePath = join(middlewarePath, middleware)


        const mod = await import(filePath)


        exports[mod.default.name] = filePath
    }

    writeFileSync(jsonPath, JSON.stringify(exports))

    console.log("Middleware berhasil di load")
}

const getMiddleware = async (middleware: string)=>{ 
    const middlewareData = JSON.parse(readFileSync(jsonPath, "utf8"))


    const middlewareModule = middlewareData[middleware]

    const mod = await import(middlewareModule)

    return mod.default
}



export {loadMiddleware, getMiddleware}