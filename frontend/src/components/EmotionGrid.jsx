import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Heart, 
  Trees, 
  Mountain, 
  Users, 
  Utensils 
} from 'lucide-react';

const emotions = [
  { name: 'Stressed', sub: 'Escape the chaos', icon: <Zap size={32} /> },
  { name: 'Romantic', sub: 'Love is in the air', icon: <Heart size={32} /> },
  { name: 'Adventure', sub: 'Pure adrenaline', icon: <Mountain size={32} /> },
  { name: 'Peaceful', sub: 'Find your zen', icon: <Trees size={32} /> },
  { name: 'Family', sub: 'Make memories', icon: <Users size={32} /> },
  { name: 'Foodie', sub: 'Taste the world', icon: <Utensils size={32} /> }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const EmotionGrid = ({ onSelectEmotion }) => {
  return (
    <motion.div 
      className="emotion-grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: '1200px', margin: '0 auto' }}
    >
      {emotions.map(e => (
        <motion.div 
          key={e.name} 
          className="emotion-card glass-card" 
          onClick={() => onSelectEmotion(e.name)}
          variants={itemVariants}
          style={{ 
            padding: '2rem', 
            textAlign: 'center', 
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 107, 107, 0.1)', borderColor: 'var(--accent)' }}
        >
          <div className="text-accent" style={{ marginBottom: '1rem' }}>{e.icon}</div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{e.name}</h2>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>{e.sub}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default EmotionGrid;
