import React from 'react';
import { Plane, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FlightCard = ({ flight }) => {
  const navigate = useNavigate();

  const handleSelect = () => {
    navigate(`/book/${flight._id}`);
  };

  return (
    <motion.div 
      className="glass-card flex-col md:flex-row" 
      style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s ease' }}
      whileHover={{ scale: 1.01, boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--bg-dark), var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
          <Plane size={32} className="text-accent" />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <h3 className="font-bold" style={{ fontSize: '1.25rem' }}>{flight.airline}</h3>
          <p className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><ShieldCheck size={16} className="text-success" /> {flight.flight_number}</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexGrow: 1, justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p className="font-bold text-accent" style={{ fontSize: '1.2rem' }}>{new Date(flight.departure).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
          <p className="text-muted font-semibold">{flight.origin}</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', width: '200px' }}>
          <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}><Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />{flight.duration}</p>
          <div style={{ width: '100%', height: '2px', background: 'var(--glass-border)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-4px', left: '50%', transform: 'translateX(-50%)', background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', borderRadius: '50%', padding: '2px' }}>
              <Plane size={14} className="text-muted" style={{ display: 'block' }} />
            </div>
          </div>
          <p className="text-accent" style={{ fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 'bold' }}>{flight.stops}</p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p className="font-bold text-accent" style={{ fontSize: '1.2rem' }}>{new Date(flight.arrival).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
          <p className="text-muted font-semibold">{flight.destination}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem', borderLeft: '1px solid var(--glass-border)', paddingLeft: '2rem' }}>
        <p style={{ fontSize: '2rem', fontWeight: 800 }}>${flight.price}</p>
        <button className="btn" onClick={handleSelect} style={{ padding: '0.5rem 2rem' }}>
          Select
        </button>
      </div>
    </motion.div>
  );
};

export default FlightCard;
