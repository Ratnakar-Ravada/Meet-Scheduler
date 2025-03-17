
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import MeetingCard from './MeetingCard';
import { Video } from 'lucide-react';

// Function to generate a random Google Meet-like link
const generateMeetLink = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = 'https://meet.google.com/';
  
  // First segment (3 chars)
  for (let i = 0; i < 3; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  result += '-';
  
  // Second segment (4 chars)
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  result += '-';
  
  // Third segment (3 chars)
  for (let i = 0; i < 3; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

const InstantMeeting = () => {
  const [meetingLink, setMeetingLink] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCreateMeeting = () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setMeetingLink(generateMeetLink());
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <MeetingCard
      title="Instant Meeting"
      description="Create a meeting and join immediately"
      meetingLink={meetingLink}
      isGenerating={isGenerating}
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
