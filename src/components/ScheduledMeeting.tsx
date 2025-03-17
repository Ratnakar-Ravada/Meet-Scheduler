
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import MeetingCard from './MeetingCard';
import { Calendar as CalendarIcon, Clock, CalendarCheck } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

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

const ScheduledMeeting = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>('');
  const [meetingLink, setMeetingLink] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formattedDateTime, setFormattedDateTime] = useState<string | undefined>(undefined);

  const handleCreateMeeting = () => {
    if (!date || !time) {
      toast.error('Please select both date and time');
      return;
    }

    // Parse the time
    const [hours, minutes] = time.split(':').map(Number);
    
    // Create a new date with the selected time
    const scheduledDate = new Date(date);
    scheduledDate.setHours(hours, minutes);
    
    // Check if the date is in the past
    if (scheduledDate < new Date()) {
      toast.error('Cannot schedule a meeting in the past');
      return;
    }

    setIsGenerating(true);
    
    // Format the date and time for display
    const formattedDate = format(scheduledDate, 'EEEE, MMMM d, yyyy');
    const formattedTime = format(scheduledDate, 'h:mm a');
    setFormattedDateTime(`${formattedDate} at ${formattedTime}`);
    
    // Simulate API call delay
    setTimeout(() => {
      setMeetingLink(generateMeetLink());
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <MeetingCard
      title="Scheduled Meeting"
      description="Plan a meeting for later"
      meetingLink={meetingLink}
      meetingTime={formattedDateTime}
      isGenerating={isGenerating}
    >
      {!meetingLink && !isGenerating && (
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="meeting-date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal input-focus-ring",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meeting-time">Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="meeting-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="pl-10 input-focus-ring"
              />
            </div>
          </div>

          <Button 
            onClick={handleCreateMeeting} 
            className="w-full button-hover mt-4"
          >
            <CalendarCheck className="mr-2 h-4 w-4" />
            Schedule Meeting
          </Button>
        </div>
      )}
    </MeetingCard>
  );
};

export default ScheduledMeeting;
