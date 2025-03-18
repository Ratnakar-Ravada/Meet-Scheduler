import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          // prompt: "consent", // Prompts consent for every login - No need for this use case
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar", // Request Google Profile and Calendar permissions
          access_type: "offline", // Enables refresh token support
          include_granted_scopes: "true", // Reuse existing consent
          response_type: "code", // Authorization code flow
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
      session.accessToken = token.accessToken;
      session.maxAge = token.maxAge;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return "http://localhost:8080";
    },
    async signOut({ url, baseUrl }) {
      return "http://localhost:8080";
    },
  },
});

export { handler as GET, handler as POST };
