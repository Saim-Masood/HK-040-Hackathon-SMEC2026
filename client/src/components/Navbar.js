import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">Campus Resources</Link>
        <ul className="nav-menu">
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/resources">Resources</Link></li>
          <li><Link to="/my-bookings">My Bookings</Link></li>
          {user.role === 'admin' && <li><Link to="/admin">Admin</Link></li>}
          <li className="nav-user">
            <span>{user.name}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
