import { dirname } from "path"
import { fileURLToPath } from "url"



const RimBotConfig = {
    bot_name: "RIMBOT",
    prefix: "/",
    command_types: [
        "biasa", "extended", "gambar"
    ],
    dirname: dirname(fileURLToPath(import.meta.url)),
    premium_limit: 20
}




export {RimBotConfig}