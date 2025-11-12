import { readdirSync } from "fs";
import { extname, join } from "path";
import { RimBotConfig } from "@/config/rimbot";

const commandRegistry = new Map<string, Map<string, string>>();

const commandDir = join(RimBotConfig.dirname, "..", "commands");

async function loadCommand() {
  const directories = RimBotConfig.command_types;

  for (const directory of directories) {
    const dir = join(commandDir, directory);
    const files = readdirSync(dir).filter(file =>
      [".ts", ".js"].includes(extname(file))
    );

    const commandMap = new Map<string, string>();

    for (const file of files) {
      const filePath = join(dir, file);
      const mod = await import(filePath);
      commandMap.set(mod.default.name, filePath);
    }

    commandRegistry.set(directory, commandMap);
  }

  console.log("Command sudah terload ke dalam Map, siap digunakan!");
}

async function getCommand(category: string) {
  const commandMap = commandRegistry.get(category);
  if (!commandMap) throw new Error(`Kategori ${category} tidak ditemukan`);

  const exports: [string, any][] = [];

  for (const [name, filePath] of commandMap.entries()) {
    const mod = await import(filePath);
    exports.push([name, mod.default]);
  }

  return exports;
}

export { loadCommand, getCommand };
