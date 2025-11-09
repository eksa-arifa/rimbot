import QRCode from "qrcode"
import { baileys, saveCreds } from "@/config/baileys"
import { handler } from "@/core/handler"


const startBot = async () => {
    const sock = baileys.sock


    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", async (update) => {
        const { qr } = update

        if (qr) {
            console.log(QRCode.toString(qr))
        }
    })


    sock.ev.on("messages.upsert", async (message) => {
        const msg = message.messages[0]

        console.log(msg)

        const textBiasa = msg.message?.conversation?.toLowerCase() || null
        const textReply = msg.message?.extendedTextMessage?.text?.toLocaleLowerCase() || null
        const textImage = msg.message?.imageMessage?.caption?.toLocaleLowerCase() || null


        if (textBiasa != null) {
            await handler(msg, sock, "biasa", textBiasa)
        }else if(textReply != null){
            await handler(msg, sock, "replyan", textReply)
        }else if(textImage != null){
            await handler(msg, sock, "gambar", textImage)
        }

    })
}


export { startBot }