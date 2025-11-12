import { RimBotConfig } from "@/config/rimbot"
import { Middleware } from "@/interfaces/middleware"
import { readdirSync } from "fs"
import { join } from "path"

const middlewareRegistry = new Map<string, string>()

const middlewarePath = join(RimBotConfig.dirname, "..", "middlewares")

const loadMiddleware = async () => {
  const middlewareDir = readdirSync(middlewarePath)

  for (const file of middlewareDir) {
    const filePath = join(middlewarePath, file)
    const mod = await import(filePath)

    if (!mod?.default?.name) {
      console.warn(`Middleware di ${file} tidak punya 'default.name' — dilewati.`)
      continue
    }

    middlewareRegistry.set(mod.default.name, filePath)
  }

  console.log("✅ Middleware berhasil dimuat ke dalam Map")
}


const getMiddleware = async (middlewareName: string): Promise<Middleware> => {
  const filePath = middlewareRegistry.get(middlewareName)

  if (!filePath)
    throw new Error(`Middleware "${middlewareName}" tidak ditemukan di registry`)

  const mod = await import(filePath)
  return mod.default
}

export { loadMiddleware, getMiddleware }
