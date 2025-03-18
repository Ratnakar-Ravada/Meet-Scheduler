import axios from "axios";

export const createGoogleEvent = async (
  date = null,
  time = null,
  timezone = "UTC",
) => {
  try {
    const response = await axios.post(
      `${process.env.NEXTAUTH_URL}/api/meet`,
      {
        date,
        time,
        timezone,
      },
      { withCredentials: true },
    );
    if (
      response &&
      response.data &&
      response.data.meetLink &&
      response.data.calendarLink &&
      response.data.eventId
    ) {
      return {
        meetURL: response?.data?.meetLink,
        calendarURL: response?.data?.calendarLink,
        eventId: response?.data?.eventId,
      };
    }
    console.error("Failed to create meeting:", response);
    return { meetURL: null, calendarURL: null, eventId: null };
  } catch (error) {
    console.error("Error creating meeting:", error);
    return { meetURL: null, calendarURL: null, eventId: null };
  }
};

export const deleteGoogleEvent = async (eventId) => {
  try {
    const response = await axios.delete(
      `${process.env.NEXTAUTH_URL}/api/meet`,
      {
        data: { eventId: decodeURIComponent(eventId) },
        withCredentials: true, // Body goes in `data` for Axios DELETE
      },
    );
    console.log("Meeting and Calendar Event deleted successfully.");
    return response.data;
  } catch (error) {
    console.error("Failed to delete the event:", error);
    return null;
  }
};
