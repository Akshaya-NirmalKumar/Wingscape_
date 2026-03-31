import { Download } from "lucide-react";
import { downloadETicket } from "../utils/ticketing";

export default function DownloadETicket({ booking }) {
  const handleDownload = () => {
    try {
      downloadETicket(booking);
    } catch (error) {
      console.error("Failed to download e-ticket", error);
      window.alert("Unable to download e-ticket right now.");
    }
  };

  return (
    <button
      className="btn btn-secondary"
      onClick={handleDownload}
      type="button"
      style={{ position: "relative", zIndex: 30, pointerEvents: "auto" }}
    >
      <Download size={18} />
      Download E-Ticket
    </button>
  );
}
