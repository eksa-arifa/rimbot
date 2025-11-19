import { RimBotConfig } from "@/config/rimbot";
import { Cron } from "@/interfaces/cron";
import { readdirSync } from "fs";
import { extname, join } from "path";
import cron from "node-cron"

const cronDir = join(RimBotConfig.dirname, "..", "cron");

const setupCron = async () => {
    try {
        console.log('🔧 Setting up cron jobs...');
        
        const files = readdirSync(cronDir).filter(file =>
            [".ts", ".js"].includes(extname(file))
        );

        console.log(`Found ${files.length} cron files`);

        for(const file of files){
            try {
                const pathToFile = join(cronDir, file);
                console.log(`🔄 Loading cron: ${file}`);

                const mod = await import(pathToFile);
                const modDefault: Cron = mod.default;

                if (!modDefault.time || !modDefault.execute) {
                    console.error(`Invalid cron configuration in file: ${file}`);
                    continue;
                }

                cron.schedule(modDefault.time, modDefault.execute);
                console.log(`Cron job scheduled: ${file} (${modDefault.time})`);

            } catch (fileError) {
                console.error(`Failed to load cron file: ${file}`, fileError);
            }
        }

        console.log('All cron jobs setup completed');

    } catch (error) {
        console.error('Failed to setup cron jobs:', error);
    }
}

export { setupCron }