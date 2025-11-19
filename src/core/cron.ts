import { RimBotConfig } from "@/config/rimbot";
import { Cron } from "@/interfaces/cron";
import { readdirSync } from "fs";
import { extname, join } from "path";
import cron from "node-cron"




const cronDir = join(RimBotConfig.dirname, "..", "cron");

const setupCron = async () => {
    const files = readdirSync(cronDir).filter(file =>
        [".ts", ".js"].includes(extname(file))
    );

    for(const file of files){
        const pathToFile = join(cronDir, file)

        const mod = await import(pathToFile)

        const modDefault: Cron = mod.default

        cron.schedule(modDefault.time, modDefault.execute)
    }
}





export { setupCron }