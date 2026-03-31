import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchFlights } from '../utils/api';
import FlightCard from '../components/FlightCard';
import { Filter, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const FlightResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const searchParams = new URLSearchParams(location.search);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const date = searchParams.get('date');

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      setError('');
      try {
        const results = await searchFlights({
          ...(origin ? { origin } : {}),
          ...(destination ? { destination } : {}),
        });
        setFlights(Array.isArray(results) ? results : []);
      } catch (err) {
        setError('Failed to fetch flights.');
      }
      setLoading(false);
    };

    fetchFlights();
  }, [origin, destination]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="animate-fade-in"
      style={{ padding: '2rem 0' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <button onClick={() => navigate(-1)} className="btn-ghost" style={{ display: 'inline-flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <ArrowLeft size={16} /> Back to Search
          </button>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Flight Results</h2>
          <p className="text-muted">
            {origin} to {destination} {date ? `on ${date}` : ''} • {flights.length} flights found
          </p>
        </div>
        <button className="btn btn-secondary" style={{ display: 'flex', gap: '0.5rem' }}>
          <Filter size={18} /> Filters
        </button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        {/* Left Sidebar (Filters Mockup) */}
        <div style={{ width: '250px', flexShrink: 0 }} className="glass-panel">
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
            <h3 className="font-semibold" style={{ marginBottom: '1rem' }}>Stops</h3>
            <label htmlFor="stops-direct" style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }}><input id="stops-direct" name="stops-direct" type="checkbox" /> Direct</label>
            <label htmlFor="stops-one" style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }}><input id="stops-one" name="stops-one" type="checkbox" /> 1 Stop</label>
            <label htmlFor="stops-two-plus" style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }}><input id="stops-two-plus" name="stops-two-plus" type="checkbox" /> 2+ Stops</label>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <h3 className="font-semibold" style={{ marginBottom: '1rem' }}>Airlines</h3>
            <label htmlFor="airline-wingscape" style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }}><input id="airline-wingscape" name="airline-wingscape" type="checkbox" /> Wingscape Air</label>
            <label htmlFor="airline-global-jet" style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }}><input id="airline-global-jet" name="airline-global-jet" type="checkbox" /> Global Jet</label>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flexGrow: 1 }}>
          {loading ? (
            <div className="flex-center" style={{ height: '300px' }}>
              <Loader2 className="loader text-accent" size={40} />
            </div>
          ) : error ? (
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--error)' }}>
              {error}
            </div>
          ) : flights.length === 0 ? (
            <div className="glass-card flex-center flex-col" style={{ padding: '4rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No Flights Found</h3>
              <p className="text-muted">Try adjusting your origin and destination.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {flights.map((flight) => (
                <FlightCard key={flight._id} flight={flight} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FlightResults;
