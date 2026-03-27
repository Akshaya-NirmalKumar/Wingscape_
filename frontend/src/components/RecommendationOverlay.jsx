import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { MapPin, Calendar, Users, Plane, ArrowRight, Loader2, X } from 'lucide-react';

const RecommendationOverlay = ({ emotion, onClose }) => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await api.get(`/emotions/${emotion}/destinations`);
        setDestinations(res.data.slice(0, 6)); // Top 6 recommendations
      } catch (err) {
        console.error('Failed to fetch destinations', err);
      }
      setLoading(false);
    };
    fetchDestinations();
  }, [emotion]);

  const handleViewFlights = (airportCode) => {
    navigate(`/flights?destination=${airportCode}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ 
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
        backgroundColor: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(10px)',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem'
      }}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-panel"
        style={{ 
          width: '100%', maxWidth: '1200px', maxHeight: '90vh', overflowY: 'auto',
          padding: '3rem', position: 'relative'
        }}
      >
        <button 
          onClick={onClose}
          className="btn-ghost"
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Recommendations for <span className="text-accent">{emotion}</span></h2>
          <p className="text-muted">Handpicked escapes to match your mood.</p>
        </div>

        {loading ? (
          <div className="flex-center" style={{ minHeight: '300px' }}>
            <Loader2 className="loader text-accent" size={48} />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {destinations.map(dest => (
              <motion.div 
                key={dest._id}
                className="glass-card"
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                whileHover={{ y: -5 }}
              >
                <div style={{ height: '200px', width: '100%', position: 'relative' }}>
                  <img 
                    src={dest.image_url} 
                    alt={dest.city} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://picsum.photos/seed/travel/800/600'; }}
                  />
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--accent)', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {dest.airport_code}
                  </div>
                </div>
                <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{dest.city}, {dest.country}</h3>
                  <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem', flexGrow: 1 }}>{dest.description}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <div>
                      <p className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Best Time</p>
                      <p className="font-semibold" style={{ fontSize: '0.9rem' }}>{dest.best_season}</p>
                    </div>
                    <button 
                      className="btn"
                      onClick={() => handleViewFlights(dest.airport_code)}
                      style={{ padding: '0.5rem 1rem' }}
                    >
                      View Flights <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default RecommendationOverlay;
