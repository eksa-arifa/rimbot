import { RimBotConfig } from "@/config/rimbot";
import { Cron } from "@/interfaces/cron";
import { readdirSync } from "fs";
import { extname, join } from "path";

const cronDir = join(RimBotConfig.dirname, "..", "cron");

const setupCron = async () => {
    try {
        console.log('🔧 Setting up cron jobs...');

        const files = readdirSync(cronDir).filter(file =>
            [".ts", ".js"].includes(extname(file))
        );

        console.log(`Found ${files.length} cron files`);

        for (const file of files) {
            try {
                const pathToFile = join(cronDir, file);
                console.log(`🔄 Loading cron: ${file}`);

                const mod = await import(pathToFile);
                const modDefault: Cron = mod.default;

                if (!modDefault.time || !Array.isArray(modDefault.time) || !modDefault.execute) {
                    console.error(`Invalid cron configuration in file: ${file}`);
                    continue;
                }

                // Parse cron time array
                const cronTime = modDefault.time;
                if (cronTime.length !== 6) {
                    console.error(`Invalid cron format in file: ${file}. Expected 6 parts, got ${cronTime.length}`);
                    continue;
                }

                const [cronSecond, cronMinute, cronHour, cronDay, cronMonth, cronYear] = cronTime;

                // Track last execution time untuk mencegah eksekusi berulang
                let lastExecutionTime = "";

                // Fungsi untuk mengecek apakah nilai cocok dengan pattern cron
                const isMatch = (cronValue: string, currentValue: number): boolean => {
                    if (cronValue === "*") return true;
                    
                    // Handle angka tunggal
                    const numericValue = Number(cronValue);
                    if (!isNaN(numericValue)) {
                        return numericValue === currentValue;
                    }
                    
                    // Handle range (e.g., "1-5")
                    if (cronValue.includes("-")) {
                        const [start, end] = cronValue.split("-").map(Number);
                        return currentValue >= start && currentValue <= end;
                    }
                    
                    // Handle list (e.g., "1,3,5")
                    if (cronValue.includes(",")) {
                        const values = cronValue.split(",").map(Number);
                        return values.includes(currentValue);
                    }
                    
                    // Handle step values (e.g., "*/5" untuk setiap 5 detik)
                    if (cronValue.includes("/")) {
                        const [range, step] = cronValue.split("/");
                        const stepNum = Number(step);
                        if (range === "*") {
                            return currentValue % stepNum === 0;
                        }
                    }
                    
                    return false;
                };

                // Schedule interval setiap detik untuk akurasi yang lebih baik
                setInterval(() => {
                    const now = new Date();
                    const currentValues = {
                        second: now.getSeconds(),
                        minute: now.getMinutes(),
                        hour: now.getHours(),
                        day: now.getDate(),
                        month: now.getMonth() + 1,
                        year: now.getFullYear(),
                    };

                    // Cek semua kondisi cron
                    const secondMatch = isMatch(cronSecond, currentValues.second);
                    const minuteMatch = isMatch(cronMinute, currentValues.minute);
                    const hourMatch = isMatch(cronHour, currentValues.hour);
                    const dayMatch = isMatch(cronDay, currentValues.day);
                    const monthMatch = isMatch(cronMonth, currentValues.month);
                    const yearMatch = isMatch(cronYear, currentValues.year);

                    // Buat timestamp unik untuk eksekusi ini
                    const executionKey = `${currentValues.year}-${currentValues.month}-${currentValues.day}-${currentValues.hour}-${currentValues.minute}`;

                    // Jika semua kondisi terpenuhi DAN belum dieksekusi pada menit ini
                    if (secondMatch && minuteMatch && hourMatch && dayMatch && monthMatch && yearMatch) {
                        if (lastExecutionTime !== executionKey) {
                            lastExecutionTime = executionKey;
                            
                            try {
                                modDefault.execute();
                                console.log(`🚀 Executed cron: ${file} at ${new Date().toISOString()}`);
                            } catch (executeError) {
                                console.error(`Error executing cron job ${file}:`, executeError);
                            }
                        }
                    }
                }, 1000); // Cek setiap detik untuk akurasi

                console.log(`✅ Cron job scheduled: ${file} (${cronTime.join(' ')})`);

            } catch (fileError) {
                console.error(`Failed to load cron file: ${file}`, fileError);
            }
        }

        console.log('🎉 All cron jobs setup completed');

    } catch (error) {
        console.error('Failed to setup cron jobs:', error);
    }
}

export { setupCron }