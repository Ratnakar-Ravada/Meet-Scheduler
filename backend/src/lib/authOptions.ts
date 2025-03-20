import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

interface TokenInfoResponse {
  scope?: string;
  [key: string]: string | number | undefined;
}

// Fetch user scopes from Google's token introspection endpoint
async function fetchUserInfo(accessToken: string): Promise<string[]> {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`
  );
  const data: TokenInfoResponse = await response.json();
  return data.scope ? data.scope.split(" ") : [];
}

// Check for missing scopes and return them
async function getMissingScopes(
  accessToken: string,
  requiredScopes: string[]
): Promise<string[]> {
  const userScopes = await fetchUserInfo(accessToken);
  return requiredScopes.filter((scope) => !userScopes.includes(scope));
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/meetings.space.created https://www.googleapis.com/auth/meetings.space.settings",
          access_type: "offline",
          include_granted_scopes: "true",
          response_type: "code",
        },
      },
    }),
  ],
  debug: process.env.NEXT_APP_ENV === "dev",
  callbacks: {
    async jwt({ token, account, trigger, session }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      token.maxAge = 24 * 60 * 60;
      if (trigger === "update" && session) {
        token = { ...token, user: session };
        return token;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.maxAge = token.maxAge as number;

      const requiredScopes = [
        "https://www.googleapis.com/auth/calendar.events",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/meetings.space.created",
        "https://www.googleapis.com/auth/meetings.space.settings",
      ];

      const missingScopes = await getMissingScopes(
        token.accessToken as string,
        requiredScopes
      );

      session.hasConsent = missingScopes.length === 0;
      session.missingScopes = missingScopes; // Send missing scopes in session
      return session;
    },

    async redirect() {
      return process.env.FRONTEND_URL as string;
    },
  },
  useSecureCookies: true,
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        path: "/",
        sameSite: "none",
        secure: true,
      },
    },
  },
};
