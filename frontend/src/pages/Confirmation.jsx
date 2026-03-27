import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { CheckCircle, Download, Calendar, ArrowRight, PlaneTakeoff, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

const Confirmation = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${bookingId}`);
        setBooking(res.data);
      } catch (err) {
        setError('Failed to fetch booking confirmation.');
      }
      setLoading(false);
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) return <div className="flex-center" style={{ minHeight: '60vh' }}><div className="loader"></div></div>;
  if (error) return <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--error)' }}>{error}</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '2rem 0', maxWidth: '800px', margin: '0 auto' }}>
      <div className="flex-center flex-col glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 10 }}>
          <CheckCircle size={80} className="text-success" style={{ marginBottom: '1.5rem' }} />
        </motion.div>
        
        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
        <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '3rem' }}>Your journey awaits. A confirmation email has been sent.</p>

        <div className="glass-panel" style={{ width: '100%', padding: '2rem', borderRadius: '16px', position: 'relative', overflow: 'hidden', textAlign: 'left' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, var(--success), var(--accent))' }}></div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>
            <div>
              <p className="text-muted" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Booking Reference (PNR)</p>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent)', fontFamily: 'monospace', letterSpacing: '4px' }}>{booking.pnrcode}</h3>
            </div>
            <PlaneTakeoff size={48} className="text-muted" style={{ opacity: 0.5 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <p className="text-muted">Origin</p>
              <h4 className="font-bold" style={{ fontSize: '1.2rem' }}>{booking.flight_details?.origin}</h4>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>{new Date(booking.flight_details?.departure).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted">Destination</p>
              <h4 className="font-bold" style={{ fontSize: '1.2rem' }}>{booking.flight_details?.destination}</h4>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>{new Date(booking.flight_details?.arrival).toLocaleString()}</p>
            </div>
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <span className="text-muted">Passengers ({booking.passengers.length}) </span>
              <span className="font-bold">{booking.passengers[0].name} {booking.passengers.length > 1 ? `+${booking.passengers.length-1} more` : ''}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="text-muted">Paid </span>
              <span className="font-bold text-success">${booking.total_price}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn btn-secondary">
            <Download size={18} /> Download E-Ticket
          </button>
          <button className="btn btn-secondary">
            <Calendar size={18} /> Add to Calendar
          </button>
          <Link to="/dashboard" className="btn">
            Go to My Trips <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Confirmation;
