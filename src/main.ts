import "dotenv/config";
import { startBot } from "@/core/bot";
import { loadCommand } from "@/core/command";
import { loadMiddleware } from "@/core/middleware";
import { setupCron } from "@/core/cron";



startBot()
loadMiddleware()
loadCommand()
setupCron()