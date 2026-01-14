import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const bookingsRes = await axios.get('/api/bookings');
      setRecentBookings(bookingsRes.data.slice(0, 5));
      
      if (user.role === 'admin') {
        const statsRes = await axios.get('/api/admin/dashboard/stats');
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Welcome, {user.name}!</h1>
        
        {user.role === 'admin' && stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Resources</h3>
              <p className="stat-number">{stats.totalResources}</p>
            </div>
            <div className="stat-card">
              <h3>Available Resources</h3>
              <p className="stat-number">{stats.availableResources}</p>
            </div>
            <div className="stat-card">
              <h3>Pending Bookings</h3>
              <p className="stat-number">{stats.pendingBookings}</p>
            </div>
            <div className="stat-card">
              <h3>Today's Bookings</h3>
              <p className="stat-number">{stats.todayBookings}</p>
            </div>
          </div>
        )}

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/resources" className="btn-action">Browse Resources</Link>
            <Link to="/my-bookings" className="btn-action">My Bookings</Link>
            {user.role === 'admin' && <Link to="/admin" className="btn-action">Admin Panel</Link>}
          </div>
        </div>

        <div className="recent-bookings">
          <h2>Recent Bookings</h2>
          {recentBookings.length === 0 ? (
            <p>No bookings yet. <Link to="/resources">Book a resource</Link></p>
          ) : (
            <div className="bookings-list">
              {recentBookings.map(booking => (
                <div key={booking._id} className="booking-item">
                  <h3>{booking.resource.name}</h3>
                  <p>{new Date(booking.startTime).toLocaleString()}</p>
                  <span className={`status ${booking.status}`}>{booking.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
