import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export default async function handler(req, res) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // Google OAuth URL with additional scopes
  const authUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
      scope:
        "openid email profile https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar", // Add your additional scopes here
      state: Buffer.from(
        JSON.stringify({
          csrfToken: req.cookies["next-auth.csrf-token"],
          callbackUrl: req.headers.referer,
        })
      ).toString("base64"),
      include_granted_scopes: "true", // Important for incremental authorization
    });
  console.log(authUrl);
  res.status(200).json({ authUrl });
}
