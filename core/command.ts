import { readdirSync } from "fs";
import { dirname, extname, join } from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commandDir = join(__dirname, "..", "commands")


async function loadCommand(directory: string) {
    const dir = join(commandDir, directory)
    const files = readdirSync(dir).filter(file =>
        [".ts"].includes(extname(file))
    );
    const exports = []

    for (const file of files) {
        const filePath = join(dir, file);

        const mod = await import(filePath);

        exports.push([file.replace(/\.(ts)$/, ""), mod.default])
    }

    return exports;
}



export { loadCommand }