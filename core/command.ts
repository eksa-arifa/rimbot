import { readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, extname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { RimBotConfig } from "../config/rimbot.ts";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commandDir = join(__dirname, "..", "commands")
const jsonDir = join(commandDir, "commands.json")


async function loadCommand() {

    const directories = RimBotConfig.command_types
    let listCommand: Record<string, string[][]> = {}

    for (const directory of directories) {

        const dir = join(commandDir, directory)
        const files = readdirSync(dir).filter(file =>
            [".ts"].includes(extname(file))
        );
        const exports: string[][] = []

        for (const file of files) {
            const filePath = join(dir, file);

            exports.push([file.replace(/\.(ts)$/, ""), filePath])
        }

        listCommand[directory] = exports

    }

    writeFileSync(jsonDir, JSON.stringify(listCommand));

}


function getCommand(category: string) {
    const commandData = JSON.parse(readFileSync(jsonDir, "utf8"));

    const lists = commandData[category];
    if (!lists) throw new Error(`Kategori ${category} tidak ditemukan`);


    const exports = []

    for(const list of lists){
        exports.push(list)
    }
    
    return exports;
}



export { loadCommand, getCommand }