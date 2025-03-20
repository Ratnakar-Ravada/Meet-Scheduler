# Meet Scheduler

A simple and user-friendly interface for scheduling meetings with Google Calendar using Next.js (App Router), NextAuth.js for Google SSO authentication, and a React + Vite frontend styled with Tailwind CSS.

Live link: Deployed on Vercel - https://meet-scheduler-mvp.vercel.app/

## Project Structure

- **Frontend:** Located in the root directory (React + Vite)
- **Backend:** Located in the `/backend` directory (Next.js + TypeScript)
- **Environment Variables:** Managed via `.env.dev` for development and `.env` for production

## Prerequisites

1. **Google Cloud Console Setup**

   - Create a project in Google Cloud Console
   - Create an **OAuth 2.0 Client ID** with a redirect URI: `${NEXTAUTH_URL}/api/auth/callback/google`
   - Create a **Google API Key** and add it to `.env.dev` file
   - Add both `Client ID` and `Client Secret` to `.env.dev` file
   - Add Google Meet and Google Calendar Apps in the APIs & Services Tab in Google Cloud Platform.

2. **Domain Verification for Production**
   - For trusted API usage in production, verify your domain in Google Cloud Console.

## Environment Variables

### Frontend `.env.dev` File

```
VITE_APP_ENV='dev'
GOOGLE_CLIENT_ID=xxxxxxxxxxxx
GOOGLE_CLIENT_SECRET=yyyyyyyyyyyy
GOOGLE_CALENDAR_API_KEY=zzzzzzzzzzzz
GOOGLE_REDIRECT_URI='${NEXTAUTH_URL}/api/auth/callback/google'
NEXTAUTH_URL=${NEXTAUTH_URL}
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
```

### Backend `.env.dev` File

```
NEXT_APP_ENV='dev'
FRONTEND_URL=${FRONTEND_URL}
GOOGLE_CLIENT_ID=xxxxxxxxxxxx
GOOGLE_CLIENT_SECRET=yyyyyyyyyyyy
GOOGLE_CALENDAR_API_KEY=zzzzzzzzzzzz
NEXTAUTH_URL=${NEXTAUTH_URL}
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
```

## Commands

### Development Commands

```

"dev:frontend": "vite --mode dev",
"build:frontend": "vite build --mode dev",
"dev:frontend:prod": "vite --mode prod",
"build:frontend:prod": "vite build --mode prod",
"format": "prettier --write .",

"dev:backend": "cd backend && dotenv -e .env.dev -- next dev --turbopack",
"build:backend": "cd backend && dotenv -e .env.dev -- next build",
"dev:backend:prod": "cd backend && dotenv -e .env -- next dev --turbopack",
"build:backend:prod": "cd backend && dotenv -e .env -- next build",

"lint": "cd backend && next lint",
"format:backend": "cd backend && prettier --write ."

```

### Build Outputs

- **Frontend:** `/dist`
- **Backend:** `/backend/.next`

## Features

- **Google SSO Authentication** with NextAuth.js
- **Meeting Scheduler** with Google Calendar API integration
- **Meeting Deletion** directly removes the event from Google Calendar
- **User Sign Out** using NextAuth.js

## Running the Application

### Development

```
npm run dev:frontend
npm run dev:backend
```

### Production

```
npm run build:frontend:prod
npm run build:backend:prod
```

## Deployment (Vercel)

### Frontend Deployment

1. Add the repo to Vercel
2. Choose the **root directory**
3. Choose **Vite** as the framework
4. Set Build Command: `npm run build:frontend:prod`
5. Deploy
6. Set the deployed domain as `FRONTEND_URL` in your `.env` files

### Backend Deployment

1. Add the repo to Vercel as a new project
2. Choose the `/backend` directory
3. Choose **Next.js** as the framework
4. Set Build Command: `npm run build:backend:prod`
5. Set Output Directory: `/backend/.next`
6. Deploy
7. Set the deployed domain as `NEXTAUTH_URL` in your `.env` files

## Limitations

In the OAuth Consent screen you may see something like this

```
Google hasn’t verified this app
The app is requesting access to sensitive info in your Google Account. Until the developer (ratnakarravada11@gmail.com) verifies this app with Google, you shouldn't use it.
```

This web application is intended solely for development purposes. As I currently do not possess a valid public domain to verify the Google Client App, this assumption is made. To proceed, you may need to continue with the insecure URL and provide your consent. Please note that you can revoke your consent at any time through your Google Account settings. Once consent is granted, you will not need to provide it again unless you manually revoke it from your Google Account.

## Future Scope

- Add functionality to schedule meetings with multiple participants
- Send email or in-app notifications for scheduled meetings
- Introduce timezone support for scheduling
- Expand the scheduling form with detailed fields (title, description, location, etc.)
- Display a list of upcoming events with Google Calendar APIs
- Improve domain verification for enhanced security and trusted Google API access.
