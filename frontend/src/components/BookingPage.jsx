import React from 'react';
import { motion } from 'framer-motion';

const BookingPage = ({ bookings, rebookingSuggestion, onSimulateDelay, onAcceptRebooking }) => {
  return (
    <motion.section 
      className="results-section"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem'}}>
        <h2>My Bookings</h2>
        <button className="btn btn-secondary" onClick={onSimulateDelay}>Simulate Flight Delay</button>
      </div>

      {rebookingSuggestion && (
        <motion.div 
          className="rebooking-alert glass-card"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>🚨 Flight Delay Detected!</h3>
          <p>Your flight to {rebookingSuggestion.suggestion.destination_name} has been delayed.</p>
          <div className="rebooking-suggestion-card">
            <p><strong>Suggested Alternative:</strong> {rebookingSuggestion.suggestion.airline}</p>
            <p style={{margin: '0.5rem 0'}}>Departure: {rebookingSuggestion.suggestion.departure} &bull; Price: ${rebookingSuggestion.suggestion.price}</p>
            <button className="btn" style={{marginTop: '1rem'}} onClick={() => onAcceptRebooking(rebookingSuggestion.suggestion)}>
              Accept Rebooking
            </button>
          </div>
        </motion.div>
      )}

      {bookings.length === 0 ? (
        <motion.p 
          style={{color: 'var(--text-muted)', fontSize: '1.2rem', textAlign: 'center', marginTop: '4rem'}}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          No bookings yet. Time for an adventure?
        </motion.p>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          {bookings.map((book, i) => (
            <motion.div 
              key={book._id} 
              className="flight-card glass-card" 
              style={{
                borderColor: book.status === 'Delayed' ? 'rgba(233, 69, 96, 0.5)' : 'var(--glass-border)',
                background: book.status === 'Delayed' ? 'rgba(233, 69, 96, 0.05)' : 'var(--glass)'
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flight-info">
                <h3>{book.destination_name}</h3>
                <p>Status: <span style={{
                  color: book.status === 'Delayed' ? '#ff6b81' : '#a7f3d0',
                  fontWeight: 600
                }}>{book.status}</span></p>
              </div>
              <div className="price-tag">${book.price}</div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default BookingPage;
