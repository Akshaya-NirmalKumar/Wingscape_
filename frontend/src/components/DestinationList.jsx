import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const DestinationList = ({ emotion, destinations, flights, onShowFlights }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleBookFlight = async (flight) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      await api.post('/bookings', {
        flight_id: flight._id,
        destination_name: flight.destination_name,
        price: flight.price
      });
      alert('Flight booked successfully!');
      navigate('/bookings');
    } catch (err) {
      console.error(err);
      alert('Failed to book flight');
    }
  };

  return (
    <motion.section 
      className="results-section"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2>Destinations for {emotion}</h2>
      <div className="dest-list">
        {destinations.map((dest, i) => (
          <motion.div 
            key={dest._id} 
            className="glass-card"
            style={{marginBottom: '3rem', overflow: 'hidden', padding: 0}}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            {/* Added Destination Image support based on new seed logic */}
            {dest.image && (
              <div style={{ height: '250px', width: '100%', overflow: 'hidden' }}>
                <img 
                  src={dest.image} 
                  alt={dest.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}
            
            <div style={{ padding: '2rem' }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem'}}>
                <div style={{flex: 1, minWidth: '250px'}}>
                  <h3 style={{fontSize: '2.2rem', marginBottom: '0.5rem', fontWeight: 700}}>{dest.name}</h3>
                  <p style={{color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6}}>{dest.description}</p>
                </div>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => onShowFlights(dest._id)}
                  style={{whiteSpace: 'nowrap'}}
                >
                  Show Flights
                </button>
              </div>
              
              <div className="flight-list">
                {flights.filter(f => f.destination_id === dest._id).map((flight, j) => (
                  <motion.div 
                    key={flight._id} 
                    className="flight-card"
                    style={{ background: 'rgba(0,0,0,0.2)' }}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flight-info">
                      <h3 style={{ color: '#d8b4fe' }}>{flight.airline}</h3>
                      <p>Departure: {flight.departure} &bull; Duration: {flight.duration} &bull; Status: {flight.status}</p>
                    </div>
                    <div className="flight-card-actions">
                      <span className="price-tag">${flight.price}</span>
                      <button className="btn" onClick={() => handleBookFlight(flight)}>Book Now</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default DestinationList;
