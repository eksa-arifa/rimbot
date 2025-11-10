import { Middleware } from "@/interfaces/middleware";




const auth: Middleware = {
    name: "auth",
    async execute(msg, sock, db) {

        const user = await db.user.findFirst({ where: { remotejid: { equals: msg.key.remoteJid } } })

        if (!user) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: "Kamu belum terdaftar di database, silahkan daftar dengan menggunakan \n `/daftar <nama>`"
            }, { quoted: msg })
            return false
        }


        return true
    },
}


export default auth