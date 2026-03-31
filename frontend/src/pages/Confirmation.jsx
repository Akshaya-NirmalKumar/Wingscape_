import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookingById } from '../utils/api';
import { CheckCircle, ArrowRight, PlaneTakeoff } from 'lucide-react';
import { motion } from 'framer-motion';
import DownloadETicket from '../components/DownloadETicket';
import AddToCalendar from '../components/AddToCalendar';

const Confirmation = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingById(bookingId);
        setBooking(data);
      } catch (err) {
        setError('Failed to fetch booking confirmation.');
      }
      setLoading(false);
    };
    fetchBooking();
  }, [bookingId]);

  // ── Download E-Ticket ──────────────────────────────────────
  const handleDownloadTicket = () => {
    const doc = new jsPDF();
    const fd = booking.flight_details || {};
    const passengers = booking.passengers || [];
    const seats = booking.seats || [];

    // Header bar
    doc.setFillColor(220, 80, 60);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('WINGSCAPE', 15, 20);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('E-Ticket / Boarding Pass', 135, 20);

    // PNR
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text('BOOKING REFERENCE (PNR)', 15, 44);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 80, 60);
    doc.text(booking.pnrcode || 'N/A', 15, 58);

    // Divider
    doc.setDrawColor(220, 80, 60);
    doc.setLineWidth(0.5);
    doc.line(15, 65, 195, 65);

    // Route
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(fd.origin || 'N/A', 15, 80);
    doc.text('→', 88, 80);
    doc.text(fd.destination || 'N/A', 108, 80);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(fd.airline || 'Wingscape', 15, 88);
    doc.text(`Flight: ${fd.flight_number || 'N/A'}`, 108, 88);

    // Departure / Arrival boxes
    doc.setFillColor(245, 245, 245);
    doc.rect(15, 94, 85, 22, 'F');
    doc.rect(108, 94, 87, 22, 'F');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text('DEPARTURE', 20, 101);
    doc.text('ARRIVAL', 113, 101);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(fd.departure ? new Date(fd.departure).toLocaleString() : 'N/A', 20, 111);
    doc.text(fd.arrival ? new Date(fd.arrival).toLocaleString() : 'N/A', 113, 111);

    // Passengers
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    let y = 132;
    doc.text('PASSENGERS', 15, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    passengers.forEach((p, i) => {
      y += 8;
      const name = typeof p === 'object'
        ? (p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim())
        : String(p);
      doc.text(`${i + 1}. ${name}`, 15, y);
      doc.text(`Seat: ${seats[i] || '—'}`, 140, y);
    });

    // Total
    y += 16;
    doc.setDrawColor(220, 80, 60);
    doc.line(15, y, 195, y);
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text('TOTAL PAID', 15, y);
    doc.setTextColor(220, 80, 60);
    doc.text(`$${Number(booking.total_price || 0).toFixed(2)}`, 162, y);

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for choosing Wingscape. Safe travels!', 15, 274);
    doc.text('This is your official e-ticket. Please present at check-in.', 15, 280);

    doc.save(`wingscape-eticket-${booking.pnrcode}.pdf`);
  };

  // ── Add to Calendar ────────────────────────────────────────
  const handleAddToCalendar = () => {
    const fd = booking.flight_details || {};
    const passengers = booking.passengers || [];

    const departureDate = fd.departure && !isNaN(new Date(fd.departure).getTime()) ? new Date(fd.departure) : new Date();
    const arrivalDate = fd.arrival && !isNaN(new Date(fd.arrival).getTime()) ? new Date(fd.arrival) : new Date(departureDate.getTime() + 2 * 3600 * 1000);

    const pad = (n) => String(n).padStart(2, '0');
    const toICS = (d) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
      `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

    const passengerNames = passengers
      .map((p) => typeof p === 'object' ? (p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim()) : String(p))
      .join(', ');

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Wingscape//FlightTicket//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${booking.pnrcode}-wingscape@wingscape.app`,
      `DTSTAMP:${toICS(new Date())}`,
      `DTSTART:${toICS(departureDate)}`,
      `DTEND:${toICS(arrivalDate)}`,
      `SUMMARY:✈ ${fd.airline || 'Wingscape'} ${fd.flight_number || ''} – ${fd.origin} to ${fd.destination}`,
      `DESCRIPTION:PNR: ${booking.pnrcode}\\nPassengers: ${passengerNames}\\nFlight: ${fd.airline} ${fd.flight_number}`,
      `LOCATION:${fd.origin || ''} Airport`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wingscape-flight-${booking.pnrcode}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ── Render ─────────────────────────────────────────────────
  if (loading) return (
    <div className="flex-center" style={{ minHeight: '60vh' }}>
      <div className="loader"></div>
    </div>
  );

  if (error) return (
    <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--error)' }}>
      {error}
    </div>
  );

  const fd = booking.flight_details || {};
  const passengers = booking.passengers || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: '2rem 0', maxWidth: '800px', margin: '0 auto' }}
    >
      <div className="flex-center flex-col glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        >
          <CheckCircle size={80} className="text-success" style={{ marginBottom: '1.5rem' }} />
        </motion.div>

        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
        <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '3rem' }}>
          Your journey awaits. A confirmation email has been sent.
        </p>

        <div className="glass-panel" style={{
          width: '100%', padding: '2rem', borderRadius: '16px',
          position: 'relative', overflow: 'hidden', textAlign: 'left'
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
            background: 'linear-gradient(to bottom, var(--success), var(--accent))'
          }} />

          {/* PNR row */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem'
          }}>
            <div>
              <p className="text-muted" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Booking Reference (PNR)
              </p>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent)', fontFamily: 'monospace', letterSpacing: '4px' }}>
                {booking.pnrcode}
              </h3>
            </div>
            <PlaneTakeoff size={48} className="text-muted" style={{ opacity: 0.5 }} />
          </div>

          {/* Origin / Destination */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <p className="text-muted">Origin</p>
              <h4 className="font-bold" style={{ fontSize: '1.2rem' }}>{fd.origin}</h4>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                {fd.departure ? new Date(fd.departure).toLocaleString() : '—'}
              </p>
            </div>
            <div>
              <p className="text-muted">Destination</p>
              <h4 className="font-bold" style={{ fontSize: '1.2rem' }}>{fd.destination}</h4>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                {fd.arrival ? new Date(fd.arrival).toLocaleString() : '—'}
              </p>
            </div>
          </div>

          {/* Passenger + price row */}
          <div style={{
            background: 'rgba(255,255,255,0.05)', padding: '1rem',
            borderRadius: '8px', display: 'flex', justifyContent: 'space-between'
          }}>
            <div>
              <span className="text-muted">Passengers ({passengers.length}) </span>
              <span className="font-bold">
                {typeof passengers[0] === 'object'
                  ? (passengers[0].name || `${passengers[0].first_name || ''} ${passengers[0].last_name || ''}`.trim())
                  : passengers[0]}
                {passengers.length > 1 ? ` +${passengers.length - 1} more` : ''}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="text-muted">Paid </span>
              <span className="font-bold text-success">${booking.total_price}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <DownloadETicket booking={booking} />
          <AddToCalendar booking={booking} />
          <Link to="/dashboard" className="btn">
            Go to My Trips <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </motion.div>
  );
};

export default Confirmation;
