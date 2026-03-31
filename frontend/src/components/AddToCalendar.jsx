import { Calendar } from "lucide-react";
import { downloadCalendarInvite } from "../utils/ticketing";

export default function AddToCalendar({ booking }) {
  const handleAddToCalendar = () => {
    try {
      downloadCalendarInvite(booking);
    } catch (error) {
      console.error("Failed to add booking to calendar", error);
      window.alert("Unable to create the calendar file right now.");
    }
  };

  return (
    <button
      className="btn btn-secondary"
      onClick={handleAddToCalendar}
      type="button"
      style={{ position: "relative", zIndex: 30, pointerEvents: "auto" }}
    >
      <Calendar size={18} />
      Add to Calendar
    </button>
  );
}
