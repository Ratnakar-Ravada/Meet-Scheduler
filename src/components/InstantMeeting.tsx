import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import MeetingCard from "./MeetingCard";
import { Video } from "lucide-react";
import { createInstantMeeting, endGoogleMeetMeeting } from "@/apis/meet";
import { toast } from "sonner";

// Function to generate a random Google Meet-like link
const generateMeetLink = async () => {
  const { meetUrl, name } = await createInstantMeeting();
  if (meetUrl && name) {
    return { meetLink: meetUrl, meetName: name };
  }
  return { meetLink: null, meetName: null };
};

const InstantMeeting = ({ hasConsent }) => {
  const [meetingLink, setMeetingLink] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const [meetName, setMeetName] = useState<string | undefined>(undefined);

  const handleCreateMeeting = async () => {
    setIsGenerating(true);
    // Simulate API call delay
    const { meetLink, meetName } = await generateMeetLink();
    if (meetLink && meetName) {
      setMeetingLink(meetLink);
      setMeetName(meetName);
    } else {
      toast.error("Login expired. Please log in again.");
    }
    setIsGenerating(false);
  };

  const handleResetMeetingCard = () => {
    setMeetingLink(undefined);
    setMeetName(undefined);
    setIsGenerating(false);
  };

  const handleDeleteMeeting = async () => {
    if (!meetName) {
      toast.error("Failed to delete meeting");
      return;
    }
    const result = await endGoogleMeetMeeting(meetName);

    if (!result || result.status !== 200) {
      toast.error("Failed to delete meeting");
      return;
    }
    toast.success("Meeting deleted successfully");
    handleResetMeetingCard();
  };

  return (
    <MeetingCard
      title="Instant Meeting"
      description="Create a meeting and join immediately"
      meetingLink={meetingLink}
      isGenerating={isGenerating}
      onDelete={handleDeleteMeeting}
    >
      {!meetingLink && !isGenerating && (
        <div className="flex flex-col items-center justify-center py-6">
          <Button
            onClick={handleCreateMeeting}
            disabled={!hasConsent}
            className="px-6 button-hover flex items-center gap-2 mt-2 mb-1"
            size="lg"
          >
            <Video className="h-5 w-5 mr-1" />
            Create Instant Meeting
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Generate a meeting that you can join right away
          </p>
        </div>
      )}
    </MeetingCard>
  );
};

export default InstantMeeting;
