import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero';
import EmotionGrid from '../components/EmotionGrid';
import RecommendationOverlay from '../components/RecommendationOverlay';

const Home = () => {
  const [searchMode, setSearchMode] = useState('route'); // 'route' | 'mood'
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  const handleSelectEmotion = (emotion) => {
    setSelectedEmotion(emotion);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="animate-fade-in"
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '30px', display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`btn ${searchMode === 'route' ? '' : 'btn-secondary'}`}
            onClick={() => setSearchMode('route')}
            style={{ borderRadius: '20px', padding: '0.5rem 1.5rem', border: 'none' }}
          >
            Search by Route
          </button>
          <button 
            className={`btn ${searchMode === 'mood' ? '' : 'btn-secondary'}`}
            onClick={() => setSearchMode('mood')}
            style={{ borderRadius: '20px', padding: '0.5rem 1.5rem', border: 'none' }}
          >
            Search by Mood
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {searchMode === 'route' ? (
          <motion.div key="hero" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <Hero />
          </motion.div>
        ) : (
          <motion.div key="mood" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 800 }}>Where to next?</h2>
              <p className="text-muted" style={{ fontSize: '1.2rem', marginTop: '1rem' }}>Tell us how you feel, and we'll find the perfect escape.</p>
            </div>
            <EmotionGrid onSelectEmotion={handleSelectEmotion} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedEmotion && (
          <RecommendationOverlay 
            emotion={selectedEmotion} 
            onClose={() => setSelectedEmotion(null)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Home;
