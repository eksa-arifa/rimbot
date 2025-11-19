import { readdirSync } from "fs";
import { extname, join } from "path";
import { RimBotConfig } from "@/config/rimbot";

const commandRegistry = new Map<string, Map<string, string>>();

const commandDir = join(RimBotConfig.dirname, "..", "commands");

async function loadCommand() {
  try {
    console.log('Loading commands...');
    
    const directories = RimBotConfig.command_types;
    console.log(`Found ${directories.length} command categories: ${directories.join(', ')}`);

    for (const directory of directories) {
      try {
        const dir = join(commandDir, directory);
        console.log(`Loading command category: ${directory}`);

        const files = readdirSync(dir).filter(file =>
          [".ts", ".js"].includes(extname(file))
        );

        console.log(`Found ${files.length} commands in ${directory}`);

        const commandMap = new Map<string, string>();

        for (const file of files) {
          try {
            const filePath = join(dir, file);
            console.log(`Loading command: ${file}`);

            const mod = await import(filePath);
            
            if (!mod.default?.name) {
              console.warn(`Command di ${file} tidak punya 'default.name' — dilewati.`);
              continue;
            }

            commandMap.set(mod.default.name, filePath);
            console.log(`Command loaded: ${mod.default.name}`);

          } catch (fileError) {
            console.error(`Failed to load command file: ${file}`, fileError);
          }
        }

        commandRegistry.set(directory, commandMap);
        console.log(`Category ${directory} loaded with ${commandMap.size} commands`);

      } catch (dirError) {
        console.error(`Failed to load command category: ${directory}`, dirError);
      }
    }

    console.log(`Command loading completed. Total categories: ${commandRegistry.size}`);

  } catch (error) {
    console.error('Failed to load commands:', error);
  }
}

async function getCommand(category: string) {
  try {
    const commandMap = commandRegistry.get(category);
    if (!commandMap) {
      throw new Error(`Kategori ${category} tidak ditemukan`);
    }

    const exports: [string, any][] = [];

    for (const [name, filePath] of commandMap.entries()) {
      try {
        const mod = await import(filePath);
        
        if (!mod.default) {
          console.warn(`Command ${name} tidak memiliki default export — dilewati.`);
          continue;
        }

        exports.push([name, mod.default]);
        console.log(`Command retrieved: ${name} from category ${category}`);

      } catch (commandError) {
        console.error(`Failed to get command ${name} from category ${category}:`, commandError);
      }
    }

    return exports;

  } catch (error) {
    console.error(`Error getting commands from category "${category}":`, error);
    throw error;
  }
}

export { loadCommand, getCommand };