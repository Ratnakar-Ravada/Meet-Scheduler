import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import MeetingCard from './MeetingCard';
import { CalendarCheck } from 'lucide-react';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { DatePicker, MobileTimePicker } from '@mui/x-date-pickers';

// Function to generate a random Google Meet-like link
const generateMeetLink = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = 'https://meet.google.com/';
  for (let i = 0; i < 3; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));
  result += '-';
  for (let i = 0; i < 4; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));
  result += '-';
  for (let i = 0; i < 3; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));
  return result;
};

const ScheduledMeeting = () => {
  const [date, setDate] = useState(dayjs());
  const [time, setTime] = useState(dayjs());
  const [meetingLink, setMeetingLink] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formattedDateTime, setFormattedDateTime] = useState<string | undefined>(undefined);

  const handleCreateMeeting = () => {
    if (!date || !time) {
      toast.error('Please select both date and time');
      return;
    }

    const scheduledDate = date.set('hour', time.hour()).set('minute', time.minute());

    if (scheduledDate.isBefore(dayjs())) {
      toast.error('Cannot schedule a meeting in the past');
      return;
    }

    setIsGenerating(true);

    const formattedDate = scheduledDate.format('dddd, MMMM D, YYYY');
    const formattedTime = scheduledDate.format('h:mm A');
    setFormattedDateTime(`${formattedDate} at ${formattedTime}`);

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
            <DatePicker
              defaultValue={dayjs()}
              disablePast
              views={['year', 'month', 'day']}
              value={date}
              onChange={(newValue) => setDate(newValue)}
              closeOnSelect
            />
          </div>

          <div className="space-y-2">
            <MobileTimePicker defaultValue={time} onChange={(newValue) => setTime(newValue)} format='HH:mm' ampm={false} closeOnSelect/>
          </div>

          <Button onClick={handleCreateMeeting} className="w-full button-hover mt-4">
            <CalendarCheck className="mr-2 h-4 w-4" />
            Schedule Meeting
          </Button>
        </div>
      )}
    </MeetingCard>
  );
};

export default ScheduledMeeting;