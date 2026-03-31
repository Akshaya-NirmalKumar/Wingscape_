import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Map, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  const [tripType, setTripType] = useState('round');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [flightClass, setFlightClass] = useState('Economy');
  
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!origin || !destination) return;
    navigate(`/flights?origin=${origin}&destination=${destination}&date=${date}&passengers=${passengers}&class=${flightClass}`);
  };

  return (
    <div className="hero" style={{ marginTop: '2rem' }}>
      <h2 style={{ fontSize: '4.5rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.1 }}>
        Discover the <span className="text-gradient">World.</span>
      </h2>
      <p className="text-muted" style={{ fontSize: '1.2rem', marginBottom: '3rem' }}>
        Find the best flights to your dream destination instantly.
      </p>

      <motion.div 
        className="glass-panel"
        style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', textAlign: 'left' }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
          <label htmlFor="trip-one-way" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input id="trip-one-way" type="radio" name="trip" checked={tripType === 'one'} onChange={() => setTripType('one')} />
            One-way
          </label>
          <label htmlFor="trip-round-trip" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input id="trip-round-trip" type="radio" name="trip" checked={tripType === 'round'} onChange={() => setTripType('round')} />
            Round-trip
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={16} className="text-muted" />
              <input id="hero-passengers" name="passengers" type="number" min="1" value={passengers} onChange={(e) => setPassengers(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'white', width: '40px', outline: 'none' }} /> Passenger(s)
            </div>
            <select id="hero-flight-class" name="flightClass" value={flightClass} onChange={(e) => setFlightClass(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', cursor: 'pointer' }}>
              <option value="Economy" style={{color: 'black'}}>Economy</option>
              <option value="Premium" style={{color: 'black'}}>Premium</option>
              <option value="Business" style={{color: 'black'}}>Business</option>
              <option value="First" style={{color: 'black'}}>First</option>
            </select>
          </div>
        </div>

        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
          {/* Origin */}
          <div style={{ position: 'relative' }}>
            <label htmlFor="flight-origin" className="text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>From</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <MapPin size={20} className="text-muted" style={{ position: 'absolute', left: '1rem' }} />
              <input 
                id="flight-origin"
                name="origin"
                type="text" 
                placeholder="Airport code (e.g., JFK)" 
                value={origin}
                onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          {/* Destination */}
          <div style={{ position: 'relative' }}>
            <label htmlFor="flight-destination" className="text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>To</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Map size={20} className="text-muted" style={{ position: 'absolute', left: '1rem' }} />
              <input 
                id="flight-destination"
                name="destination"
                type="text" 
                placeholder="Airport code (e.g., LHR)" 
                value={destination}
                onChange={(e) => setDestination(e.target.value.toUpperCase())}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          {/* Departure */}
          <div>
            <label htmlFor="flight-departure-date" className="text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Departure</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Calendar size={20} className="text-muted" style={{ position: 'absolute', left: '1rem' }} />
              <input 
                id="flight-departure-date"
                name="departureDate"
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Return Date */}
          <div style={{ opacity: tripType === 'one' ? 0.4 : 1, pointerEvents: tripType === 'one' ? 'none' : 'auto' }}>
            <label htmlFor="flight-return-date" className="text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Return</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Calendar size={20} className="text-muted" style={{ position: 'absolute', left: '1rem' }} />
              <input 
                id="flight-return-date"
                name="returnDate"
                type="date" 
                className="form-input"
                style={{ paddingLeft: '2.5rem', cursor: 'pointer' }}
                disabled={tripType === 'one'}
              />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="btn" style={{ height: '50px', padding: '0 2rem' }}>
            <Search size={20} /> Search
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Hero;
