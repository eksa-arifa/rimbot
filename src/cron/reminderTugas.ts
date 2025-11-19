import { baileys } from "@/config/baileys";
import { prisma } from "@/core/db";
import { Cron } from "@/interfaces/cron";
import { formatEventsToMessage } from "@/utils/formatEventsToMessage";
import { getUpcomingEvents } from "@/utils/getUpcommingEvents";




const reminderTugas: Cron = {
    time: "0 0 3 * * *",
    execute: async ()=>{
        const tasks = await prisma.taskSchedule.findMany({include: {user: true}})
        const sock = baileys.sock

        for(const task of tasks){
            const events = await getUpcomingEvents(task.taskUrl)

            const message = formatEventsToMessage(events)

            await sock.sendMessage(task.user.remotejid, {text: message})
        }
    }
}



export default reminderTugas