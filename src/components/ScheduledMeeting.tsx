import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import MeetingCard from "./MeetingCard";
import { CalendarCheck } from "lucide-react";
import { toast } from "sonner";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { MobileDatePicker, MobileTimePicker } from "@mui/x-date-pickers";
import { createGoogleEvent, deleteGoogleEvent } from "@/apis/meet";

dayjs.extend(utc);

const ScheduledMeeting = () => {
  const [meetingLink, setMeetingLink] = useState<string | undefined>(undefined);
  const [calendarLink, setCalendarLink] = useState<string | undefined>(
    undefined,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [formattedDateTime, setFormattedDateTime] = useState<
    string | undefined
  >(undefined);
  const [date, setDate] = useState(dayjs().utc());
  const [time, setTime] = useState(dayjs().utc());
  const [eventId, setEventId] = useState<string | undefined>(undefined);

  const handleCreateMeeting = async () => {
    if (!date || !time) {
      toast.error("Please select both date and time");
      return;
    }

    const scheduledDate = date
      .set("hour", time.hour())
      .set("minute", time.minute());
    setIsGenerating(true);

    const formattedDate = scheduledDate.format("DD-MMM-YYYY");
    const formattedTime = scheduledDate.format("HH:mm");
    setFormattedDateTime(`${formattedDate} at ${formattedTime} (UTC GMT+0)`);

    const { meetURL, calendarURL, eventId } = await createGoogleEvent(
      formattedDate,
      formattedTime,
      "UTC",
    );
    if (meetURL && calendarURL && eventId) {
      setMeetingLink(meetURL);
      setCalendarLink(calendarURL);
      setEventId(eventId);
      setIsGenerating(false);
    } else {
      toast.error("Failed to create meeting");
      setMeetingLink(undefined);
      setCalendarLink(undefined);
      setEventId(undefined);
      setIsGenerating(false);
    }
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
      title="Schedule a meeting"
      description="Plan a meeting for later (Timezone: UTC GMT+0)"
      meetingLink={meetingLink}
      calendarLink={calendarLink}
      meetingTime={formattedDateTime}
      isGenerating={isGenerating}
      onDelete={handleDeleteMeeting}
    >
      {!meetingLink && !isGenerating && (
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <MobileDatePicker
              disablePast
              views={["year", "month", "day"]}
              value={date}
              onChange={(newValue) => setDate(dayjs.utc(newValue))}
              closeOnSelect
              label="Select Date"
              slotProps={{
                textField: {
                  placeholder: "Select Date",
                  fullWidth: true,
                  sx: { height: 48, width: "100%" },
                },
              }}
            />
          </div>

          <div className="space-y-2">
            <MobileTimePicker
              disablePast={date.isSame(dayjs().utc(), "day")}
              defaultValue={time}
              onChange={(newValue) => setTime(dayjs.utc(newValue))}
              format="HH:mm"
              ampm={false}
              label="Select Time"
              closeOnSelect
              slotProps={{
                textField: {
                  placeholder: "Select Time",
                  fullWidth: true,
                  sx: { height: 48, width: "100%" },
                },
              }}
            />
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
