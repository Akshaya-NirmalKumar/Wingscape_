import { jsPDF } from "jspdf";

const pad = (value) => String(value).padStart(2, "0");

const safeText = (value, fallback = "N/A") => {
  if (value === null || value === undefined) {
    return fallback;
  }

  const normalized = String(value).trim();
  if (!normalized) {
    return fallback;
  }

  return normalized
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const formatDisplayDate = (value, fallback = "N/A") => {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toLocaleString();
};

const toIcsTimestamp = (value) => {
  const date = value instanceof Date ? value : new Date(value);

  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
};

const escapeIcsText = (value) =>
  safeText(value, "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");

export const getPassengerName = (passenger, index = 0) => {
  if (!passenger) {
    return `Passenger ${index + 1}`;
  }

  if (typeof passenger === "string") {
    return safeText(passenger, `Passenger ${index + 1}`);
  }

  return safeText(
    passenger.name || `${passenger.first_name || ""} ${passenger.last_name || ""}`.trim(),
    `Passenger ${index + 1}`
  );
};

const triggerDownload = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const downloadETicket = (booking) => {
  if (!booking) {
    throw new Error("Booking details are not available yet.");
  }

  const flightDetails = booking.flight_details || {};
  const passengers = Array.isArray(booking.passengers) ? booking.passengers : [];
  const seats = Array.isArray(booking.seats) ? booking.seats : [];

  const doc = new jsPDF();
  let y = 132;

  doc.setFillColor(220, 80, 60);
  doc.rect(0, 0, 210, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("WINGSCAPE", 15, 20);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("E-Ticket / Boarding Pass", 132, 20);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text("BOOKING REFERENCE (PNR)", 15, 44);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(220, 80, 60);
  doc.text(safeText(booking.pnrcode), 15, 58);

  doc.setDrawColor(220, 80, 60);
  doc.setLineWidth(0.5);
  doc.line(15, 65, 195, 65);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(safeText(flightDetails.origin), 15, 80);
  doc.text("->", 92, 80);
  doc.text(safeText(flightDetails.destination), 108, 80);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(safeText(flightDetails.airline, "Wingscape"), 15, 88);
  doc.text(`Flight: ${safeText(flightDetails.flight_number)}`, 108, 88);

  doc.setFillColor(245, 245, 245);
  doc.rect(15, 94, 85, 22, "F");
  doc.rect(108, 94, 87, 22, "F");
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.text("DEPARTURE", 20, 101);
  doc.text("ARRIVAL", 113, 101);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(formatDisplayDate(flightDetails.departure), 20, 111);
  doc.text(formatDisplayDate(flightDetails.arrival), 113, 111);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("PASSENGERS", 15, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  if (passengers.length === 0) {
    y += 8;
    doc.text("1. Passenger details unavailable", 15, y);
  } else {
    passengers.forEach((passenger, index) => {
      y += 8;
      doc.text(`${index + 1}. ${getPassengerName(passenger, index)}`, 15, y);
      doc.text(`Seat: ${safeText(seats[index], "-")}`, 140, y);
    });
  }

  y += 16;
  doc.setDrawColor(220, 80, 60);
  doc.line(15, y, 195, y);
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  doc.text("TOTAL PAID", 15, y);
  doc.setTextColor(220, 80, 60);
  doc.text(`$${Number(booking.total_price || 0).toFixed(2)}`, 162, y);

  doc.setTextColor(150, 150, 150);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for choosing Wingscape. Safe travels!", 15, 274);
  doc.text("Please present this e-ticket during check-in.", 15, 280);

  triggerDownload(
    doc.output("blob"),
    `wingscape-eticket-${safeText(booking.pnrcode, "booking")}.pdf`
  );
};

export const downloadCalendarInvite = (booking) => {
  if (!booking) {
    throw new Error("Booking details are not available yet.");
  }

  const flightDetails = booking.flight_details || {};
  const passengers = Array.isArray(booking.passengers) ? booking.passengers : [];

  const departureDate = new Date(flightDetails.departure || Date.now());
  const arrivalDate = new Date(
    flightDetails.arrival || departureDate.getTime() + 2 * 60 * 60 * 1000
  );

  const passengerNames = passengers
    .map((passenger, index) => getPassengerName(passenger, index))
    .join(", ");

  const calendarText = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wingscape//FlightTicket//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${safeText(booking.pnrcode, "booking")}-wingscape@wingscape.app`,
    `DTSTAMP:${toIcsTimestamp(new Date())}`,
    `DTSTART:${toIcsTimestamp(departureDate)}`,
    `DTEND:${toIcsTimestamp(arrivalDate)}`,
    `SUMMARY:${escapeIcsText(
      `${safeText(flightDetails.airline, "Wingscape")} ${safeText(flightDetails.flight_number, "")} ${safeText(
        flightDetails.origin
      )} to ${safeText(flightDetails.destination)}`
    )}`,
    `DESCRIPTION:${escapeIcsText(
      `PNR: ${safeText(booking.pnrcode)}\nPassengers: ${passengerNames || "Passenger details unavailable"}\nFlight: ${safeText(
        flightDetails.airline,
        "Wingscape"
      )} ${safeText(flightDetails.flight_number, "")}`
    )}`,
    `LOCATION:${escapeIcsText(`${safeText(flightDetails.origin)} Airport`)}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  triggerDownload(
    new Blob([calendarText], { type: "text/calendar;charset=utf-8" }),
    `wingscape-flight-${safeText(booking.pnrcode, "booking")}.ics`
  );
};
