import { readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, extname, join } from "path";
import { fileURLToPath } from "url";
import { RimBotConfig } from "@/config/rimbot";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commandDir = join(__dirname, "..", "commands")
const jsonDir = join(commandDir, "commands.json")


function loadCommand() {

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

    console.log("Command sudah terload, siap digunakan")

}


async function getCommand(category: string) {
    const commandData = JSON.parse(readFileSync(jsonDir, "utf8"));

    const lists = commandData[category];
    if (!lists) throw new Error(`Kategori ${category} tidak ditemukan`);


    const exports = []

    for(const list of lists){
        const mod = await import(list[1])



        exports.push([list[0], mod.default])
    }
    
    return exports;
}



export { loadCommand, getCommand }