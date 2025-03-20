import { google } from "googleapis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

async function createMeetingSpace(accessToken) {
  // OAuth client setup
  const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  });

  // Set credentials from user session
  oauth2Client.setCredentials({ access_token: accessToken });

  // Create a Meet client
  const meet = google.meet({ version: "v2", auth: oauth2Client });
  try {
    // Create a new meeting space
    const response = await meet.spaces.create({
      requestBody: {},
    });

    // Extract the meeting details
    const meetingSpace = response.data;
    console.log(meetingSpace);
    const meetingCode = meetingSpace.meetingCode;

    // Construct the Google Meet URL
    const meetUrl = `https://meet.google.com/${meetingCode}`;

    return { meetUrl: meetUrl || null, name: meetingSpace.name || null };
  } catch (error) {
    console.error("Error creating meeting space:", error);
    throw error;
  }
}

async function endGoogleMeetMeeting(accessToken, meetName) {
  // OAuth client setup
  const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  });

  // Set credentials from user session
  oauth2Client.setCredentials({ access_token: accessToken });

  // Create a Meet client
  const meet = google.meet({ version: "v2", auth: oauth2Client });

  try {
    const request = {
      name: meetName,
    };

    // Call API to end the active conference
    const response = await meet.spaces.endActiveConference(request);
    // console.log(response);
    return response;
  } catch (error) {
    console.error("Error ending meeting:", error.message);
    return null;
  }
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
    const { meetUrl, name } = await createMeetingSpace(accessToken);
    return new Response(JSON.stringify({ meetUrl, name }), { status: 200 });
  } catch (error) {
    console.error("Error creating meeting space:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create meeting space." }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  if (req.method !== "DELETE") {
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
    const { meetName } = await req.json();
    const result = await endGoogleMeetMeeting(accessToken, meetName);
    console.log(result);
    return new Response(JSON.stringify({}), { status: 200 });
  } catch (error) {
    console.error("Error ending meeting:", error);
    if (error.includes("There is no active conference for the given space.")) {
      return new Response(JSON.stringify({}), { status: 200 });
    }
    return new Response(
      JSON.stringify({ error: "Failed to end the meeting." }),
      { status: 500 }
    );
  }
}
