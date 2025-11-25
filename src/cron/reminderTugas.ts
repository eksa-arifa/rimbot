import { baileys } from "@/config/baileys";
import { prisma } from "@/core/db";
import { Cron } from "@/interfaces/cron";
import { formatEventsToMessage } from "@/utils/formatEventsToMessage";
import { getUpcomingEvents } from "@/utils/getUpcommingEvents";

const reminderTugas: Cron = {
    time: "0 0 3 * * *",
    execute: async () => {
        try {
            const tasks = await prisma.taskSchedule.findMany({ include: { user: true } });
            const sock = baileys.sock;
    
            for (const task of tasks) {
                try {
                    const events = await getUpcomingEvents(task.taskUrl);
                    const message = formatEventsToMessage(events);
    
                    await sock.sendMessage(task.user.remotejid, { text: message });
                } catch (err) {
                    console.error(
                        `[reminderTugas] Gagal mengirim pesan ke user: ${task.user.remotejid} | Url: ${task.taskUrl}`,
                        err
                    );
                }
            }
        } catch (err) {
            console.error("[reminderTugas] Gagal mengambil taskSchedule atau inisialisasi:", err);
        }
    },
};

export default reminderTugas;
