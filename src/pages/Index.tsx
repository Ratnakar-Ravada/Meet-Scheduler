import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import InstantMeeting from "@/components/InstantMeeting";
import ScheduledMeeting from "@/components/ScheduledMeeting";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { fetchAuthSession } from "@/apis/auth";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const LoadingScreen = () => (
  <div className="h-[60vh] w-full flex flex-col items-center justify-center space-y-2">
    <p className="text-lg text-primary">Please Wait...</p>
    <div className="flex space-x-4">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className={`h-6 w-6 rounded-full bg-primary animate-pulse delay-[${index * 200}ms]`}
        ></div>
      ))}
    </div>
  </div>
);

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setShowAnimation(true);
    (async () => {
      setLoading(true);
      const session = await fetchAuthSession();
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    })();
    return () => {
      setShowAnimation(false);
    };
  }, []);

  const handleSignIn = async () => {
    window.location.href = process.env.NEXTAUTH_URL + "/api/auth/signin";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <Navbar loading={loading} isAuthenticated={isAuthenticated} user={user} />

      <main className="app-container">
        {isAuthenticated ? (
          <div
            className={`mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 ${showAnimation ? "animate-slide-up" : "opacity-0"}`}
          >
            <InstantMeeting />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ScheduledMeeting />
            </LocalizationProvider>
          </div>
        ) : loading ? (
          <LoadingScreen />
        ) : (
          <div
            className={`max-w-2xl mx-auto mt-16 text-center ${showAnimation ? "animate-slide-up" : "opacity-0"}`}
          >
            <h1 className="text-4xl font-bold tracking-tight mb-6">
              Simple, secure video meetings
            </h1>
            <p className="text-xl mb-8 text-muted-foreground px-4 max-w-xl mx-auto">
              Create and join meetings with a single click. Schedule for later
              or start one instantly.
            </p>

            <div className="mb-12 mt-8">
              <Button
                size="lg"
                onClick={handleSignIn}
                className="button-hover px-8 py-6 text-lg shadow-lg shadow-primary/10 bg-primary"
              >
                Sign in to get started
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="p-6 rounded-2xl bg-white shadow-sm border">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg
                    className="h-6 w-6 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 10L19.5528 7.72361C19.8343 7.58281 20 7.30529 20 7V5.5C20 4.67157 19.3284 4 18.5 4H5.5C4.67157 4 4 4.67157 4 5.5V7C4 7.30529 4.16571 7.58281 4.44721 7.72361L9 10M15 10L9 10M15 10L15 16M9 10L9 16M9 16L4.44721 18.2764C4.16571 18.4172 4 18.6947 4 19V20.5C4 21.3284 4.67157 22 5.5 22H18.5C19.3284 22 20 21.3284 20 20.5V19C20 18.6947 19.8343 18.4172 19.5528 18.2764L15 16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Instant Meetings</h3>
                <p className="text-muted-foreground">
                  Start a meeting immediately with a single click. Perfect for
                  impromptu conversations.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white shadow-sm border">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg
                    className="h-6 w-6 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 2V5M16 2V5M3.5 9.09H20.5M3 8.5C3 7.12 4.12 6 5.5 6H18.5C19.88 6 21 7.12 21 8.5V18.5C21 19.88 19.88 21 18.5 21H5.5C4.12 21 3 19.88 3 18.5V8.5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Scheduled Meetings
                </h3>
                <p className="text-muted-foreground">
                  Plan ahead by scheduling meetings for a specific date and
                  time.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white shadow-sm border">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg
                    className="h-6 w-6 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Simple Authentication
                </h3>
                <p className="text-muted-foreground">
                  Sign in with your Google account for a seamless experience.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
