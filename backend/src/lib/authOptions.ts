import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string, // Ensure type safety for environment variables
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar",
          access_type: "offline",
          include_granted_scopes: "true",
          response_type: "code",
        },
      },
    }),
  ],
  debug: true,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      token.maxAge = 24 * 60 * 60; // 24 hours
      return token;
    },
    async session({ session, token }) {
      console.log(
        `[SESSION CALLBACK] Session Data:`,
        JSON.stringify(session, null, 2)
      );
      console.log(
        `[SESSION CALLBACK] Token Data:`,
        JSON.stringify(token, null, 2)
      );
      session.accessToken = token.accessToken as string;
      session.maxAge = token.maxAge as number;
      return session;
    },
    async redirect() {
      return process.env.FRONTEND_URL as string;
    },
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: false,
        sameSite: "none",
        secure: false,
        path: "/",
        domain: process.env.NEXTAUTH_URL,
      },
    },
  },
};
