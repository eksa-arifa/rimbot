import { downloadMediaMessage, WAMessage } from "baileys";




async function getMediaFromExtendedMessage(msg: WAMessage){
    const media = msg.message.extendedTextMessage.contextInfo.quotedMessage


    const quotedMedia: WAMessage = {
        key: {
            remoteJid: msg.key.remoteJid,
            fromMe: false,
            id: "quoted"
        },
        message: media
    }


    return await downloadMediaMessage(quotedMedia, "buffer", {})
}



export { getMediaFromExtendedMessage }