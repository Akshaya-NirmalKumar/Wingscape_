import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { Plane, CheckCircle, AlertCircle, ShoppingBag, Heart, Shield, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const BookingDetails = () => {
  const { flightId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');

  // Passenger state
  const numPassengers = parseInt(searchParams.get('passengers') || '1', 10);
  const [passengers, setPassengers] = useState(
    Array(numPassengers).fill({ name: '', email: '', phone: '', passport: '' })
  );

  const [addons, setAddons] = useState({ baggage: false, insurance: false, meal: false });

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const res = await api.get(`/flights/search?flight_id=${flightId}`); // MOCK fetching by ID for now 
        // Actual robust api route should just get single flight, we'll iterate through all for now if no specific route
        const globalRes = await api.get('/flights/search');
        const found = globalRes.data.find(f => f._id === flightId);
        if (found) setFlight(found);
        else setError('Flight not found');
      } catch (err) {
        setError('Failed to fetch flight details');
      }
      setLoading(false);
    };
    fetchFlight();
  }, [flightId]);

  const handlePassengerChange = (index, field, value) => {
    const newPassengers = [...passengers];
    newPassengers[index] = { ...newPassengers[index], [field]: value };
    setPassengers(newPassengers);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setError('');

    try {
      // Calculate total price: Base * quantity + addons
      const basePrice = flight.price * numPassengers;
      let extra = 0;
      if (addons.baggage) extra += 50 * numPassengers;
      if (addons.insurance) extra += 30 * numPassengers;
      if (addons.meal) extra += 15 * numPassengers;

      const total = basePrice + extra;

      const payload = {
        flight_id: flight._id,
        passengers: passengers,
        seats: [], 
        add_ons: addons,
        total_price: total
      };

      const res = await api.post('/bookings/create', payload);
      navigate(`/confirmation/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to complete booking. Please try again.');
    }
    setBookingLoading(false);
  };

  if (loading) return <div className="flex-center" style={{ minHeight: '60vh' }}><div className="loader"></div></div>;
  if (error) return <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--error)' }}>{error}</div>;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: '2rem 0', display: 'flex', gap: '2rem' }}>
      <div style={{ flex: 2 }}>
        <button onClick={() => navigate(-1)} className="btn-ghost text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Passenger Details</h2>

        <form onSubmit={handleBook}>
          {passengers.map((p, i) => (
            <div key={i} className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>{i + 1}</span>
                Passenger {i + 1}
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Full Name</label>
                  <input type="text" className="form-input" required value={p.name} onChange={(e) => handlePassengerChange(i, 'name', e.target.value)} placeholder="As shown on passport" />
                </div>
                <div>
                  <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
                  <input type="email" className="form-input" required value={p.email} onChange={(e) => handlePassengerChange(i, 'email', e.target.value)} />
                </div>
                <div>
                  <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Phone Number</label>
                  <input type="tel" className="form-input" required value={p.phone} onChange={(e) => handlePassengerChange(i, 'phone', e.target.value)} />
                </div>
                <div>
                  <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Passport Number (Optional)</label>
                  <input type="text" className="form-input" value={p.passport} onChange={(e) => handlePassengerChange(i, 'passport', e.target.value)} />
                </div>
              </div>
            </div>
          ))}

          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '3rem 0 1rem' }}>Add-ons</h2>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
            <label className={`glass-card ${addons.baggage ? 'border-accent bg-accent-glow' : ''}`} style={{ flex: 1, padding: '1.5rem', cursor: 'pointer', border: addons.baggage ? '2px solid var(--accent)' : '1px solid var(--glass-border)' }}>
              <input type="checkbox" checked={addons.baggage} onChange={(e) => setAddons(prev => ({...prev, baggage: e.target.checked}))} style={{ display: 'none' }} />
              <ShoppingBag size={24} className={addons.baggage ? "text-accent" : "text-muted"} style={{ marginBottom: '1rem' }} />
              <h4 className="font-bold">Extra Baggage</h4>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>+$50 per person</p>
            </label>
            <label className={`glass-card ${addons.insurance ? 'border-accent bg-accent-glow' : ''}`} style={{ flex: 1, padding: '1.5rem', cursor: 'pointer', border: addons.insurance ? '2px solid var(--accent)' : '1px solid var(--glass-border)' }}>
              <input type="checkbox" checked={addons.insurance} onChange={(e) => setAddons(prev => ({...prev, insurance: e.target.checked}))} style={{ display: 'none' }} />
              <Shield size={24} className={addons.insurance ? "text-accent" : "text-muted"} style={{ marginBottom: '1rem' }} />
              <h4 className="font-bold">Travel Insurance</h4>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>+$30 per person</p>
            </label>
            <label className={`glass-card ${addons.meal ? 'border-accent bg-accent-glow' : ''}`} style={{ flex: 1, padding: '1.5rem', cursor: 'pointer', border: addons.meal ? '2px solid var(--accent)' : '1px solid var(--glass-border)' }}>
              <input type="checkbox" checked={addons.meal} onChange={(e) => setAddons(prev => ({...prev, meal: e.target.checked}))} style={{ display: 'none' }} />
              <Heart size={24} className={addons.meal ? "text-accent" : "text-muted"} style={{ marginBottom: '1rem' }} />
              <h4 className="font-bold">In-flight Meal</h4>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>+$15 per person</p>
            </label>
          </div>

          {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>{error}</div>}

          <button type="submit" disabled={bookingLoading} className="btn" style={{ width: '100%', padding: '1rem', fontSize: '1.2rem' }}>
            {bookingLoading ? 'Processing...' : 'Confirm Booking Securely'}
          </button>
        </form>
      </div>

      {/* Flight Summary Sidebar */}
      <div style={{ flex: 1 }}>
        <div className="glass-card" style={{ padding: '2rem', position: 'sticky', top: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plane size={24} className="text-accent" /> Booking Summary
          </h3>

          <div style={{ marginBottom: '2rem' }}>
            <p className="font-bold">{flight.origin} → {flight.destination}</p>
            <p className="text-muted">{flight.airline} • {flight.flight_number}</p>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <div>
                <p className="text-muted">Departure</p>
                <p className="font-bold">{new Date(flight.departure).toLocaleString()}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="text-muted">Arrival</p>
                <p className="font-bold">{new Date(flight.arrival).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '1.5rem 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Base Fare (x{numPassengers})</span>
              <span className="font-bold">${flight.price * numPassengers}</span>
            </div>
            {addons.baggage && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Extra Baggage</span>
                <span className="font-bold">${50 * numPassengers}</span>
              </div>
            )}
            {addons.insurance && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Insurance</span>
                <span className="font-bold">${30 * numPassengers}</span>
              </div>
            )}
            {addons.meal && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Meals</span>
                <span className="font-bold">${15 * numPassengers}</span>
              </div>
            )}
            
            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0.5rem 0' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 800 }}>
              <span>Total</span>
              <span className="text-accent">
                ${(flight.price * numPassengers) + (addons.baggage ? 50 * numPassengers : 0) + (addons.insurance ? 30 * numPassengers : 0) + (addons.meal ? 15 * numPassengers : 0)}
              </span>
            </div>
            
            <p className="text-muted flex-center" style={{ fontSize: '0.8rem', marginTop: '1rem' }}>
               <CheckCircle size={14} style={{ marginRight: '4px' }} className="text-success" /> Secure payment via Wingscape
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingDetails;
