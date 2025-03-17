import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          // prompt: "consent", // Consent required for initial login
          access_type: "offline", // Enables refresh token support
          include_granted_scopes: "true", // Reuse existing consent
          response_type: "code" // Authorization code flow
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return 'http://localhost:8080';
    },
    async signOut({ url, baseUrl }) {
      return 'http://localhost:8080';
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };