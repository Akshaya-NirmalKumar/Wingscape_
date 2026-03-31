import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await register(name, email, password);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', width: '100%' }}>
      <motion.div 
        className="glass-card" 
        style={{ padding: '3rem', width: '100%', maxWidth: '450px', margin: '0 auto', textAlign: 'center' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Create Account</h2>
        
        {error && <div className="error-message" style={{ color: '#ff6b81', marginBottom: '1rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              autoComplete="name"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              autoComplete="new-password"
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="btn" disabled={loading} style={{ marginTop: '1rem', width: '100%' }}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--highlight)', textDecoration: 'none' }}>Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
