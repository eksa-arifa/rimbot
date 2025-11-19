import { RimBotConfig } from "@/config/rimbot"
import { Middleware } from "@/interfaces/middleware"
import { readdirSync } from "fs"
import { join } from "path"

const middlewareRegistry = new Map<string, string>()

const middlewarePath = join(RimBotConfig.dirname, "..", "middlewares")

const loadMiddleware = async () => {
  try {
    console.log('Loading middlewares...')
    
    const middlewareDir = readdirSync(middlewarePath)
    console.log(`Found ${middlewareDir.length} middleware files`)

    for (const file of middlewareDir) {
      try {
        const filePath = join(middlewarePath, file)
        console.log(`Loading middleware: ${file}`)

        const mod = await import(filePath)

        if (!mod?.default?.name) {
          console.warn(`Middleware di ${file} tidak punya 'default.name' — dilewati.`)
          continue
        }

        middlewareRegistry.set(mod.default.name, filePath)
        console.log(`Middleware loaded: ${mod.default.name}`)

      } catch (fileError) {
        console.error(`Failed to load middleware file: ${file}`, fileError)
      }
    }

    console.log(`Middleware loading completed. Total: ${middlewareRegistry.size} middlewares`)

  } catch (error) {
    console.error('Failed to load middlewares:', error)
  }
}

const getMiddleware = async (middlewareName: string): Promise<Middleware> => {
  try {
    const filePath = middlewareRegistry.get(middlewareName)

    if (!filePath) {
      throw new Error(`Middleware "${middlewareName}" tidak ditemukan di registry`)
    }

    const mod = await import(filePath)
    
    if (!mod.default) {
      throw new Error(`Middleware "${middlewareName}" tidak memiliki default export`)
    }

    return mod.default

  } catch (error) {
    console.error(`Error getting middleware "${middlewareName}":`, error)
    throw error
  }
}

export { loadMiddleware, getMiddleware }