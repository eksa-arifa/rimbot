import { Command } from "@/interfaces/command";

const addTaskSchedule: Command = {
    name: "tambahpengingattugas",
    middleware: ["auth"],
    async execute(msg, sock, db) {
        try {
            const body = msg.message?.conversation ?? ""
            const args = body.trim().split(/\s+/).slice(1);
            const taskUrl = args.join(" ").trim();

            if (!taskUrl) {
                await sock.sendMessage(msg.key.remoteJid, {
                    text: "❌ Format salah!\n\nGunakan: /tambahpengingattugas <url_calendar_ical>\n\nContoh: /tambahpengingattugas https://calendar.com/ical.ics"
                });
                return;
            }

            const user = await db.user.findFirst({ 
                where: { remotejid: msg.key.remoteJid } 
            });

            await db.user.update({
                where: { id: user.id },
                data: {
                    taskSchedules: {
                        create: {
                            taskUrl: taskUrl
                        }
                    }
                }
            });

            await sock.sendMessage(msg.key.remoteJid, {
                text: "✅ Task sudah berhasil ditambahkan!"
            });

        } catch (error) {
            console.error("Error in addTaskSchedule:", error);
            
            await sock.sendMessage(msg.key.remoteJid, {
                text: "❌ Terjadi kesalahan saat menambahkan task. Silakan coba lagi."
            });
        }
    },
}

export default addTaskSchedule;