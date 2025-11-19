


function formatEventsToMessage(events: any[], taskName?: string): string {
    let message = "";
    
    if (taskName) {
        message += `⏰ *ADA TUGAS ${taskName}*\n\n`;
    }
    
    if (events.length === 0) {
        message += "Selamat, tidak ada tugas dalam 7 hari ke depan 🎉 selamat bersenang-senang";
        return message;
    }
    
    events.forEach((event) => {
        message += `📌 *${event.title}*\n`;
        message += `   📅 ${event.start}`;
        
        if (event.end && event.end !== event.start) {
            message += ` - ${event.end}`;
        }
        
        message += `\n\n`;
    });
    
    message += `📊 Total: ${events.length} tugas`;
    
    return message;
}


export {formatEventsToMessage}