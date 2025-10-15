import { google } from "googleapis";

const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID!;
const GOOGLE_CREDENTIALS = JSON.parse(
  process.env.GOOGLE_SERVICE_ACCOUNT_KEY as string
);

const auth = new google.auth.JWT({
  email: GOOGLE_CREDENTIALS.client_email,
  key: GOOGLE_CREDENTIALS.private_key.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({ version: "v3", auth });

export async function createCalendarEvent(event: {
  summary: string;
  description: string;
  startTime: string;
  endTime: string;
  attendees?: { email: string }[];
}) {
  try {
    const startISO = new Date(event.startTime).toISOString();
    const endISO = new Date(event.endTime).toISOString();

    // 👇 Skip attendees to prevent “Domain-Wide Delegation” error
    const eventBody = {
      summary: event.summary,
      description: event.description,
      start: {
        dateTime: startISO,
        timeZone: "Asia/Kuala_Lumpur",
      },
      end: {
        dateTime: endISO,
        timeZone: "Asia/Kuala_Lumpur",
      },
    };

    const response = await calendar.events.insert({
      calendarId: GOOGLE_CALENDAR_ID,
      requestBody: eventBody,
    });

    console.log("✅ Google Calendar event created:", response.data.htmlLink);
    return response.data;
  } catch (error) {
    console.error("❌ Google Calendar API Error:", error);
    throw error;
  }
}
