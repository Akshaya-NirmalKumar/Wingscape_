import { jsPDF } from "jspdf";
import { downloadETicket } from "../utils/ticketing";
export default function DownloadETicket({ booking }) {
    const handleDownload = () => {
        downloadETicket(booking);
        return;
        const doc = new jsPDF();
        const {
            pnrcode = "N/A",
            flight_details = {},
            passengers = [],
            seats = [],
            total_price = 0,
        } = booking;

        const {
            flight_number = "N/A",
            airline = "Wingscape",
            origin = "N/A",
            destination = "N/A",
            departure = "N/A",
            arrival = "N/A",
        } = flight_details;

        // ── Header ──────────────────────────────────────────────
        doc.setFillColor(220, 80, 60);
        doc.rect(0, 0, 210, 30, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("WINGSCAPE", 15, 20);

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text("E-Ticket / Boarding Pass", 140, 20);

        // ── PNR Code ────────────────────────────────────────────
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.text("BOOKING REFERENCE (PNR)", 15, 45);

        doc.setFontSize(28);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(220, 80, 60);
        doc.text(pnrcode, 15, 60);

        // ── Divider ─────────────────────────────────────────────
        doc.setDrawColor(220, 80, 60);
        doc.setLineWidth(0.5);
        doc.line(15, 67, 195, 67);

        // ── Flight Route ────────────────────────────────────────
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text(origin, 15, 82);
        doc.text("→", 90, 82);
        doc.text(destination, 110, 82);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(airline, 15, 90);
        doc.text(`Flight: ${flight_number}`, 110, 90);

        // ── Departure / Arrival ─────────────────────────────────
        doc.setFillColor(245, 245, 245);
        doc.rect(15, 96, 85, 22, "F");
        doc.rect(110, 96, 85, 22, "F");

        doc.setTextColor(100, 100, 100);
        doc.setFontSize(9);
        doc.text("DEPARTURE", 20, 103);
        doc.text("ARRIVAL", 115, 103);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(String(departure), 20, 113);
        doc.text(String(arrival), 115, 113);

        // ── Passengers ──────────────────────────────────────────
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        let y = 135;
        doc.setFont("helvetica", "bold");
        doc.text("PASSENGERS", 15, y);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        passengers.forEach((p, i) => {
            y += 8;
            const name = typeof p === "object" ? `${p.first_name || ""} ${p.last_name || ""}`.trim() : String(p);
            const seat = seats[i] || "—";
            doc.text(`${i + 1}. ${name}`, 15, y);
            doc.text(`Seat: ${seat}`, 130, y);
        });

        // ── Price ────────────────────────────────────────────────
        y += 18;
        doc.setDrawColor(220, 80, 60);
        doc.line(15, y, 195, y);
        y += 10;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text("TOTAL PAID", 15, y);
        doc.setTextColor(220, 80, 60);
        doc.text(`$${Number(total_price).toFixed(2)}`, 160, y);

        // ── Footer ────────────────────────────────────────────────
        doc.setTextColor(150, 150, 150);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Thank you for choosing Wingscape. Safe travels!", 15, 275);
        doc.text("This is your official e-ticket. Please present at check-in.", 15, 281);

        doc.save(`wingscape-eticket-${pnrcode}.pdf`);
    };

    return (
        <button
            onClick={handleDownload}
            style={{
                padding: "10px 22px",
                backgroundColor: "#DC5038",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
            }}
        >
            ⬇ Download E-Ticket
        </button>
    );
}
