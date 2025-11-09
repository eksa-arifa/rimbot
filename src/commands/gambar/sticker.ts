import { baileys } from "@/config/baileys";
import { addTextBelowImage } from "@/utils/addTextBellowImage";
import { getMediaFromImageMessage } from "@/utils/getMediaMessage";
import { type WAMessage } from "baileys";
import {Sticker} from "wa-sticker-formatter";




async function sticker(msg: WAMessage, sock: typeof baileys.sock) {

    const text = msg.message.imageMessage.caption.split(" ")
    text.shift()
    const sanitizeText = text.join(' ')

    const media = await getMediaFromImageMessage(msg)

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



export default sticker