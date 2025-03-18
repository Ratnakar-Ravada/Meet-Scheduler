import { google } from "googleapis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

// Create Google Event
async function createGoogleEvent(
  accessToken,
  {
    summary,
    location,
    description,
    startDateTime,
    endDateTime,
    attendees,
    timezone,
  }
) {
  // Setup Google Auth Client
  const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  });

  // Create Calendar Instance
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  // Add access token from google user session into oauth2Client
  oauth2Client.setCredentials({ access_token: accessToken });

  const event = {
    summary,
    location,
    description,
    start: { dateTime: startDateTime, timeZone: timezone },
    end: { dateTime: endDateTime, timeZone: timezone },
    attendees: attendees.map((attendee) => ({
      email: attendee.email,
      displayName: attendee.name,
    })),
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}`,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    resource: event,
    conferenceDataVersion: 1,
    sendNotifications: true,
    requestBody: event,
  });

  return response?.data;
}

// Delete Google Event
async function deleteGoogleEvent(accessToken, eventId) {
  // Setup Google Auth Client
  const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  });

  // Create Calendar Instance
  const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client,
    key: process.env.GOOGLE_CALENDAR_API_KEY,
  });

  // Add access token from google user session into oauth2Client
  oauth2Client.setCredentials({ access_token: accessToken });
  const calendarId = "primary";
  const response = await calendar.events.delete({
    calendarId: calendarId,
    eventId: eventId,
    auth: oauth2Client,
    key: process.env.GOOGLE_CALENDAR_API_KEY,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  return response;
}

// Create Event route
export async function POST(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
    });
  }

  try {
    const { date, time, timezone } = await req.json();
    const summary = "A Quick Call";
    const location = "Virtual (Google Meet)";
    const description = "Creating a meeting with Meet Scheduler Web App";
    const attendees = [];
    const startDateTime = date
      ? new Date(`${date}T${time}:00Z`).toISOString()
      : new Date(Date.now()).toISOString();
    const endDateTime = new Date(
      new Date(startDateTime).getTime() + 60 * 60 * 1000
    ).toISOString();

    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const accessToken = session.accessToken;
    const result = await createGoogleEvent(accessToken, {
      summary,
      location,
      description,
      startDateTime,
      endDateTime,
      attendees,
      timezone,
    });
    if (!result?.hangoutLink || !result?.htmlLink || !result?.id) {
      return new Response(
        JSON.stringify({ error: "Failed to create the meeting link." }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        meetLink: result?.hangoutLink,
        calendarLink: result?.htmlLink,
        eventId: result?.id,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating meeting:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create the meeting link." }),
      { status: 500 }
    );
  }
}

// Delete Event route
export async function DELETE(req) {
  if (req.method !== "DELETE") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
    });
  }

  try {
    const reqData = await req.json();
    const eventId = reqData.eventId;
    if (!eventId) {
      return new Response(JSON.stringify({ error: "Event ID is required." }), {
        status: 400,
      });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const accessToken = session.accessToken;
    const result = await deleteGoogleEvent(accessToken, eventId);

    if (!result || result.status.toString() !== "204") {
      return new Response(
        JSON.stringify({ error: "Failed to delete the meeting." }),
        { status: 500 }
      );
    }
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error deleting meeting:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete the meeting." }),
      { status: 500 }
    );
  }
}

async function listGoogleEvents(accessToken) {
  // Setup Google Auth Client
  const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  });

  // Create Calendar Instance
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  // Add access token from google user session into oauth2Client
  oauth2Client.setCredentials({ access_token: accessToken });

  const response = await calendar.events.list({
    calendarId: "primary",
    singleEvents: true,
    orderBy: "startTime",
  });

  const events = response.data.items;
  const eventList = [];
  for (const event of events) {
    const today = new Date();
    const eventDate = new Date(event.created);
    if (
      eventDate.toDateString() === today.toDateString() &&
      event.hangoutLink
    ) {
      event.id = event.id;
      event.summary = event.summary;
      event.location = event.location;
      event.description = event.description;
      event.start = event.start.dateTime;
      event.end = event.end.dateTime;
      event.hangoutLink = event.conferenceData?.entryPoints?.find(
        (point) => point.entryPointType === "video"
      )?.uri;
      eventList.push(event);
    }
  }
  return eventList;
}

export async function GET(req) {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
    });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const accessToken = session.accessToken;
    const events = await listGoogleEvents(accessToken);

    return new Response(JSON.stringify(events), { status: 200 });
  } catch (error) {
    console.error("Error listing events:", error);
    return new Response(JSON.stringify({ error: "Failed to list events." }), {
      status: 500,
    });
  }
}
