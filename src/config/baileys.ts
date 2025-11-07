import makeWASocket, { useMultiFileAuthState } from "baileys";
import P from "pino"


const { saveCreds, state } = await useMultiFileAuthState("./auth")

const baileys = {
    sock: makeWASocket({
        auth: state,
        logger: P()
    })
}


export {saveCreds, baileys}