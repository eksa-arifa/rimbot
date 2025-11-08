import { baileys } from "@/config/baileys";
import { addTextBelowImage } from "@/utils/addTextBellowImage";
import { getMediaFromExtendedMessage } from "@/utils/getMediaMessage";
import { type WAMessage } from "baileys";
import {Sticker} from "wa-sticker-formatter";




async function sticker(msg: WAMessage, sock: typeof baileys.sock) {

    const text = msg.message.extendedTextMessage.text.split(" ")
    text.shift()
    const sanitizeText = text.join(' ')

    const media = await getMediaFromExtendedMessage(msg)

    const stickerWithText = await addTextBelowImage(media, sanitizeText)

    const sticker = new Sticker(stickerWithText, {
        author: "Eksa Arifa",
        pack: "RIMBOT GENERATED",
        quality: 75
    })
    

    await sock.sendMessage(msg.key.remoteJid, await sticker.toMessage())
    if(sanitizeText.length >= 16){
        await sock.sendMessage(msg.key.remoteJid, {
            text: "Captionnya kepanjangan boss, maksimal 15 karakter termasuk spasi dan karakter khusus... Inget-inget yaa bos, nah karena itu aku nggak munculin teksnya di caption biar tetep aestethic..."
        })
    }
}



export default sticker