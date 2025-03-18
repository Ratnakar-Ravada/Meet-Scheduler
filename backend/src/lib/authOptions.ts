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
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      token.maxAge = 24 * 60 * 60; // 24 hours
      return token;
    },
    async session({ session, token }) {
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
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NEXT_APP_ENV === "prod", // Critical for HTTPS in Vercel
        domain: ".vercel.app", // Allow cookies across subdomains
        path: "/",
      },
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
