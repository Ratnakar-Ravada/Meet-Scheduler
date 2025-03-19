import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string; // Add accessToken as an optional property
    maxAge?: number; // Add maxAge as an optional property
    hasConsent?: boolean; // Add hasContent as an optional property
    missingScopes?: string[]; // Add missingScopes as an optional property
  }

  interface JWT {
    accessToken?: string; // Add accessToken for JWT as well
    maxAge?: number; // Add maxAge for JWT
  }
}
