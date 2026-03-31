import React, { useState, useEffect, useContext } from 'react';
import { getUserBookings, getUserProfile } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Plane, Tag, User, Clock, Wallet, CheckCircle, Navigation, AlertTriangle, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('trips');
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [bookingsData, profileData] = await Promise.all([
          getUserBookings(),
          getUserProfile(),
        ]);
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        setProfile(profileData);
        setAlerts([]);
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data.');
      }
      setLoading(false);
    };
    if (user) fetchDashboardData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    if (status === 'Confirmed') return 'var(--success)';
    if (status === 'Delayed') return 'var(--accent)';
    return '#eab308'; // Warning/yellow for Boarding
  };

  if (loading) return <div className="flex-center" style={{ minHeight: '60vh' }}><div className="loader"></div></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '2rem 0', display: 'flex', gap: '2rem' }}>
      
      {/* Sidebar Navigation */}
      <div className="glass-panel" style={{ width: '280px', flexShrink: 0, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignSelf: 'start', position: 'sticky', top: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-light)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, margin: '0 auto 1rem' }}>
            {profile?.name.charAt(0).toUpperCase()}
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{profile?.name}</h3>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>{profile?.email}</p>
          
          <div style={{ marginTop: '1.5rem', background: 'rgba(255,107,107,0.1)', border: '1px solid var(--accent)', padding: '1rem', borderRadius: '12px' }}>
            <Wallet size={24} className="text-accent" style={{ margin: '0 auto 0.5rem' }} />
            <p className="font-bold text-accent" style={{ fontSize: '1.2rem' }}>{profile?.points} Points</p>
            <p className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{profile?.points_tier} Tier</p>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            className={`btn-ghost ${activeTab === 'trips' ? 'bg-glass text-white' : ''}`} 
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', justifyContent: 'flex-start', padding: '1rem', textAlign: 'left', borderRadius: '8px' }}
            onClick={() => setActiveTab('trips')}
          >
            <Plane size={20} /> My Trips
          </button>
          <button 
            className={`btn-ghost ${activeTab === 'alerts' ? 'bg-glass text-white' : ''}`} 
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', justifyContent: 'flex-start', padding: '1rem', textAlign: 'left', borderRadius: '8px' }}
            onClick={() => setActiveTab('alerts')}
          >
            <Tag size={20} /> Price Alerts
          </button>
          <button 
            className={`btn-ghost ${activeTab === 'profile' ? 'bg-glass text-white' : ''}`} 
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', justifyContent: 'flex-start', padding: '1rem', textAlign: 'left', borderRadius: '8px' }}
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} /> Profile Details
          </button>
        </nav>
        
        <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
          <button onClick={handleLogout} className="btn-ghost text-muted hover:text-accent" style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', justifyContent: 'flex-start', padding: '1rem' }}>
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flexGrow: 1 }}>
        {error && <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--error)' }}>{error}</div>}

        {activeTab === 'trips' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>My Trips</h2>
            
            {bookings.length === 0 ? (
              <div className="glass-panel flex-center flex-col" style={{ padding: '4rem', textAlign: 'center' }}>
                <Plane size={48} className="text-muted" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No Upcoming Trips</h3>
                <p className="text-muted" style={{ marginBottom: '2rem' }}>You haven't booked any flights yet.</p>
                <button className="btn" onClick={() => navigate('/')}>Book a Flight</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {bookings.map((booking) => (
                  <div key={booking._id} className="glass-card" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: getStatusColor(booking.status) }}></div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <div>
                        <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem', display: 'inline-block', marginBottom: '0.5rem', color: getStatusColor(booking.status), border: `1px solid ${getStatusColor(booking.status)}` }}>
                          {booking.status}
                        </span>
                        <h4 className="font-bold" style={{ fontSize: '1.5rem' }}>{booking.flight_details?.origin} → {booking.flight_details?.destination}</h4>
                        <p className="text-muted font-monospace" style={{ marginTop: '0.25rem' }}>PNR: {booking.pnrcode}</p>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <p className="font-bold" style={{ fontSize: '1.2rem' }}>{new Date(booking.flight_details?.departure).toLocaleDateString()}</p>
                        <p className="text-muted">{booking.flight_details?.airline} • {booking.flight_details?.flight_number}</p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Clock size={24} className="text-accent" />
                        <div>
                          <p className="text-muted" style={{ fontSize: '0.8rem' }}>Check-in</p>
                          <p className="font-semibold">Opens 24h before flight</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Navigation size={24} className="text-success" />
                        <div>
                          <p className="text-muted" style={{ fontSize: '0.8rem' }}>Terminal Info</p>
                          <p className="font-semibold">T1, Gate drops 2h prior</p>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                      <button className="btn-secondary" style={{ padding: '0.5rem 1.5rem', borderRadius: '8px' }}>Manage Booking</button>
                      <button className="btn" style={{ padding: '0.5rem 1.5rem', borderRadius: '8px' }} onClick={() => navigate(`/confirmation/${booking._id}`)}>View Ticket</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'alerts' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              Price Alerts <span style={{ background: 'var(--accent)', fontSize: '1rem', padding: '0.2rem 0.8rem', borderRadius: '12px', verticalAlign: 'middle' }}>Premium</span>
            </h2>
            <div className="glass-panel flex-center flex-col" style={{ padding: '4rem', textAlign: 'center' }}>
              <Tag size={48} className="text-muted" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>You have 0 active alerts</h3>
              <p className="text-muted">Set price alerts on specific routes and we'll notify you when the price drops!</p>
            </div>
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Profile Details</h2>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                  <input type="text" className="form-input" disabled value={profile?.name || ''} />
                </div>
                <div>
                  <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
                  <input type="email" className="form-input" disabled value={profile?.email || ''} />
                </div>
                <div>
                  <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Phone Number</label>
                  <input type="tel" className="form-input" disabled value={profile?.phone || ''} placeholder="Add phone number" />
                </div>
                <div>
                  <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem' }}>Passport</label>
                  <input type="text" className="form-input" disabled value={profile?.passport || ''} placeholder="Add passport number" />
                </div>
              </div>
              <button className="btn btn-secondary" style={{ marginTop: '2rem' }} disabled>Edit Details <span style={{ fontSize: '0.8rem', marginLeft: '0.5rem' }}>(Coming Soon)</span></button>
            </div>
          </motion.div>
        )}

      </div>
    </motion.div>
  );
};

export default Dashboard;
