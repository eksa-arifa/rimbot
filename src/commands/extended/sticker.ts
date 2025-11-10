import { Command } from "@/interfaces/command";
import { addTextBelowImage } from "@/utils/addTextBellowImage";
import { getMediaFromExtendedMessage } from "@/utils/getMediaMessage";
import { Sticker } from "wa-sticker-formatter";


const sticker: Command = {
    name: "sticker",
    middleware: ["auth"],
    async execute(msg, sock, db) {

        const text = msg.message.extendedTextMessage.text.split(" ")
        text.shift()
        const sanitizeText = text.join(' ')

        const media = await getMediaFromExtendedMessage(msg)

        const stickerWithText = await addTextBelowImage(media, sanitizeText)

        const sticker = new Sticker(stickerWithText, {
            author: "Eksa Arifa",
            pack: "RIMBOT"
        })

        await sock.sendMessage(msg.key.remoteJid, await sticker.toMessage())
        if (sanitizeText.length > 18) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: "Captionnya kepanjangan boss, maksimal 18 karakter termasuk spasi dan karakter khusus... Inget-inget yaa bos, nah karena itu aku nggak munculin teksnya di caption biar tetep aestethic..."
            })
        }
    }
}



export default sticker