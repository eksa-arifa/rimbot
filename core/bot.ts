import QRCode from "qrcode"
import { baileys, saveCreds } from "../config/baileys.ts"
import { handler } from "./handler.ts"


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

        const textBiasa = msg.message?.conversation?.toLowerCase() || null
        const textReply = msg.message?.extendedTextMessage?.text?.toLocaleLowerCase() || null


        if(textBiasa != null){
            await handler(msg, sock, "biasa")
        }

    })
}


export { startBot }