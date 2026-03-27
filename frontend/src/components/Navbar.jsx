import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Plane, User, LogOut, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', marginBottom: '2rem' }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Plane size={32} className="text-accent" />
        <h1 className="logo text-gradient" style={{ margin: 0, fontSize: '2rem', fontWeight: 800 }}>Wingscape</h1>
      </Link>

      <nav className="nav-links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/" className="nav-link font-semibold">Home</Link>
        <Link to="/flights" className="nav-link font-semibold">Flights</Link>
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem' }}>
            <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
              <User size={18} />
              <span style={{ marginLeft: '0.5rem' }}>{user.name}</span>
            </Link>
            <button onClick={handleLogout} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', border: 'none' }}>
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem' }}>
            <Link to="/login" className="btn btn-secondary">Log In</Link>
            <Link to="/register" className="btn">Sign Up</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
