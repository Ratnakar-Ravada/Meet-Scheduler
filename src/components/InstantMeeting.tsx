import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import MeetingCard from "./MeetingCard";
import { Video } from "lucide-react";
import { createGoogleEvent, deleteGoogleEvent } from "@/apis/meet";
import { toast } from "sonner";

// Function to generate a random Google Meet-like link
const generateMeetLink = async () => {
  const { meetURL, calendarURL, eventId } = await createGoogleEvent();
  if (meetURL && calendarURL && eventId) {
    return { meetLink: meetURL, calendarLink: calendarURL, eventId: eventId };
  }
  return { meetLink: null, calendarLink: null, eventId: null };
};

const InstantMeeting = () => {
  const [meetingLink, setMeetingLink] = useState<string | undefined>(undefined);
  const [calendarLink, setCalendarLink] = useState<string | undefined>(
    undefined,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [eventId, setEventId] = useState<string | undefined>(undefined);

  const handleCreateMeeting = async () => {
    setIsGenerating(true);
    // Simulate API call delay
    const { meetLink, calendarLink, eventId } = await generateMeetLink();
    if (meetLink && calendarLink && eventId) {
      setMeetingLink(meetLink);
      setCalendarLink(calendarLink);
      setEventId(eventId);
    } else {
      setMeetingLink(null);
      setCalendarLink(null);
      setEventId(null);
      toast.error("Failed to create meeting");
    }
    setIsGenerating(false);
  };

  const handleResetMeetingCard = () => {
    setMeetingLink(undefined);
    setCalendarLink(undefined);
    setEventId(undefined);
    setIsGenerating(false);
  };

  const handleDeleteMeeting = async () => {
    if (!eventId) {
      toast.error("No event found to delete.");
      return;
    }
    const response = await deleteGoogleEvent(eventId);
    if (response) {
      toast.success("Meeting and Calendar Event deleted successfully.");
      handleResetMeetingCard();
    } else {
      toast.error("Could not delete the event. Please try again.");
    }
  };

  return (
    <MeetingCard
      title="Instant Meeting"
      description="Create a meeting and join immediately"
      meetingLink={meetingLink}
      calendarLink={calendarLink}
      isGenerating={isGenerating}
      onDelete={handleDeleteMeeting}
    >
      {!meetingLink && !isGenerating && (
        <div className="flex flex-col items-center justify-center py-6">
          <Button
            onClick={handleCreateMeeting}
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
