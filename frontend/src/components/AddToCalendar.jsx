import { downloadCalendarInvite } from "../utils/ticketing";

export default function AddToCalendar({ booking }) {
    const handleAddToCalendar = () => {
        try {
            downloadCalendarInvite(booking);
        } catch (error) {
            console.error("Failed to add booking to calendar", error);
            window.alert("Unable to create the calendar file right now.");
        }
        return;
        const { pnrcode = "N/A", flight_details, passengers = [] } = booking;
        const fd = flight_details || {};
        const {
            origin = "N/A",
            destination = "N/A",
            departure,
            arrival,
            flight_number = "",
            airline = "Wingscape",
        } = fd;

        // Parse departure and arrival into Date objects safely
        const departureDate = departure && !isNaN(new Date(departure).getTime()) ? new Date(departure) : new Date();
        const arrivalDate = arrival && !isNaN(new Date(arrival).getTime()) ? new Date(arrival) : new Date(departureDate.getTime() + 2 * 60 * 60 * 1000);

        const pad = (n) => String(n).padStart(2, "0");
        const toICS = (d) =>
            `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
            `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

        const passengerNames = passengers
            .map((p) =>
                typeof p === "object" ? `${p.first_name || ""} ${p.last_name || ""}`.trim() : String(p)
            )
            .join(", ");

        const icsLines = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Wingscape//FlightTicket//EN",
            "CALSCALE:GREGORIAN",
            "METHOD:PUBLISH",
            "BEGIN:VEVENT",
            `UID:${pnrcode}-wingscape-flight@wingscape.app`,
            `DTSTAMP:${toICS(new Date())}`,
            `DTSTART:${toICS(departureDate)}`,
            `DTEND:${toICS(arrivalDate)}`,
            `SUMMARY:✈ ${airline} ${flight_number} – ${origin} to ${destination}`,
            `DESCRIPTION:Booking PNR: ${pnrcode}\\nPassengers: ${passengerNames}\\nFlight: ${airline} ${flight_number}\\nFrom: ${origin}\\nTo: ${destination}`,
            `LOCATION:${origin} Airport`,
            "STATUS:CONFIRMED",
            "TRANSP:OPAQUE",
            "END:VEVENT",
            "END:VCALENDAR",
        ].join("\r\n");

        const blob = new Blob([icsLines], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `wingscape-flight-${pnrcode}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <button
            onClick={handleAddToCalendar}
            type="button"
            style={{
                padding: "10px 22px",
                backgroundColor: "#ffffff",
                color: "#DC5038",
                border: "2px solid #DC5038",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
            }}
        >
            📅 Add to Calendar
        </button>
    );
}
