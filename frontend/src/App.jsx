import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FlightResults from './pages/FlightResults';
import BookingDetails from './pages/BookingDetails';
import Confirmation from './pages/Confirmation';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/flights" element={<FlightResults />} />
              
              {/* Protected Routes */}
              <Route path="/book/:flightId" element={<ProtectedRoute><BookingDetails /></ProtectedRoute>} />
              <Route path="/confirmation/:bookingId" element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

