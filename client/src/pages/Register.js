import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', department: '', studentId: ''
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Full Name" value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <input type="email" placeholder="Email" value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          <input type="tel" placeholder="Phone" value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
          <input type="password" placeholder="Password" value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
          <input type="text" placeholder="Department" value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
          <input type="text" placeholder="Student ID" value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} />
          <button type="submit" className="btn-primary">Register</button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
