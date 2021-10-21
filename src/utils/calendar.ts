import {google} from "googleapis";

const SCOPE = ["https://www.googleapis.com/auth/calendar.readonly",]

export class Calendar {
    static default: Calendar = new Calendar();
    private api: any;
    private readonly calendarId: string;

    private constructor() {
        const key = JSON.parse(process.env.FIREBASE_CREDENTIALS || "{}");
        const auth = new google.auth.JWT(
            key.client_email,
            undefined,
            key.private_key,
            SCOPE,
        )
        this.api = google.calendar({version: "v3", auth: auth});
        this.calendarId = "1t1ggg1uamf194kmrgftse1nk8@group.calendar.google.com";
    }

    static async getCalendarEvents() {
        const calendar_data = await this.default.api.events.list({
            calendarId: this.default.calendarId,
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        });
        const response: any[] = [];
        for (const c of calendar_data.data.items) {
            response.push({
                title: c.summary,
                start: c.start,
                end: c.end,
            })
        }
        return response;
    }
}