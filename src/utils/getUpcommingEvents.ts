import { addDays, isWithinInterval } from "date-fns";
import ical from "ical"




async function getUpcomingEvents(url: string) {
  const res = await fetch(url);
  const text = await res.text();
  const data = ical.parseICS(text);

  const now = new Date();
  const nextWeek = addDays(now, 7);

  const events = Object.values(data)
    .filter(e => e.type === "VEVENT" && e.start)
    .filter(e => isWithinInterval(e.start, { start: now, end: nextWeek }))
    .map(e => ({
      title: e.summary,
      start: e.start.toLocaleString("id-ID"),
      end: e.end?.toLocaleString("id-ID"),
    }));

  return events;
}



export {getUpcomingEvents}