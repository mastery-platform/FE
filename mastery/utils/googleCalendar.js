import { google } from "googleapis";

const calendar = google.calendar("v3");
const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

export const addToGoogleCalendar = async (userId, studyPlan) => {
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

  try {
    for (const session of studyPlan) {
      await calendar.events.insert({
        auth,
        calendarId: "primary",
        resource: {
          summary: `Study: ${session.topic}`,
          start: { dateTime: `${session.date}T09:00:00Z` },
          end: { dateTime: `${session.date}T10:00:00Z` },
        },
      });
    }
  } catch (error) {
    console.error("Google Calendar Error:", error);
  }
};
