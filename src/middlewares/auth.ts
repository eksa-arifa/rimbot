import { Middleware } from "@/interfaces/middleware";




const auth: Middleware = {
    name: "auth",
    async execute(msg, sock) {
        

        return true
    },
}


export default auth