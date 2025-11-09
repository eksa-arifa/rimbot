import { Command } from "@/interfaces/command";
import { getVideoTikTok } from "@/utils/getVideoTiktok";



const tiktok: Command = {
    name: "tiktok",
    async execute(msg, sock) {
        const message = msg.message.extendedTextMessage.text.split(" ")


        const tiktokVideo = await getVideoTikTok(message[1])

        

        await sock.sendMessage(msg.key.remoteJid, {
            video: tiktokVideo
        })
    },
}


export default tiktok