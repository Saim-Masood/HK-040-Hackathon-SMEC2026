import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [resourceForm, setResourceForm] = useState({
    name: '', type: 'lab', description: '', capacity: 1,
    location: { building: '', floor: '', roomNumber: '' },
    operatingHours: { start: '08:00', end: '18:00' }
  });

  useEffect(() => {
    if (activeTab === 'bookings') fetchBookings();
    if (activeTab === 'resources') fetchResources();
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get('/api/admin/bookings');
      setBookings(data);
    } catch (error) {
      toast.error('Error loading bookings');
    }
  };

  const fetchResources = async () => {
    try {
      const { data } = await axios.get('/api/resources');
      setResources(data);
    } catch (error) {
      toast.error('Error loading resources');
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(`/api/admin/bookings/${id}/approve`);
      toast.success('Booking approved');
      fetchBookings();
    } catch (error) {
      toast.error('Error approving booking');
    }
  };

  const handleDecline = async (id) => {
    const notes = prompt('Reason for declining:');
    try {
      await axios.patch(`/api/admin/bookings/${id}/decline`, { adminNotes: notes });
      toast.success('Booking declined');
      fetchBookings();
    } catch (error) {
      toast.error('Error declining booking');
    }
  };

  const handleResourceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingResource) {
        await axios.put(`/api/admin/resources/${editingResource}`, resourceForm);
        toast.success('Resource updated');
      } else {
        await axios.post('/api/admin/resources', resourceForm);
        toast.success('Resource created');
      }
      setShowResourceForm(false);
      setEditingResource(null);
      fetchResources();
    } catch (error) {
      toast.error('Error saving resource');
    }
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm('Delete this resource?')) return;
    try {
      await axios.delete(`/api/admin/resources/${id}`);
      toast.success('Resource deleted');
      fetchResources();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting resource');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>
        
        <div className="tabs">
          <button className={activeTab === 'bookings' ? 'active' : ''} 
            onClick={() => setActiveTab('bookings')}>Bookings</button>
          <button className={activeTab === 'resources' ? 'active' : ''} 
            onClick={() => setActiveTab('resources')}>Resources</button>
        </div>

        {activeTab === 'bookings' && (
          <div className="bookings-section">
            <h2>Manage Bookings</h2>
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Resource</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking._id}>
                    <td>{booking.user.name}</td>
                    <td>{booking.resource.name}</td>
                    <td>{new Date(booking.startTime).toLocaleString()}</td>
                    <td><span className={`status ${booking.status}`}>{booking.status}</span></td>
                    <td>
                      {booking.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(booking._id)} className="btn-approve">
                            Approve
                          </button>
                          <button onClick={() => handleDecline(booking._id)} className="btn-decline">
                            Decline
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="resources-section">
            <div className="section-header">
              <h2>Manage Resources</h2>
              <button onClick={() => setShowResourceForm(true)} className="btn-primary">
                Add Resource
              </button>
            </div>

            {showResourceForm && (
              <form onSubmit={handleResourceSubmit} className="resource-form">
                <input type="text" placeholder="Name" value={resourceForm.name}
                  onChange={(e) => setResourceForm({ ...resourceForm, name: e.target.value })} required />
                <select value={resourceForm.type}
                  onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}>
                  <option value="lab">Lab</option>
                  <option value="hall">Hall</option>
                  <option value="equipment">Equipment</option>
                  <option value="room">Room</option>
                </select>
                <textarea placeholder="Description" value={resourceForm.description}
                  onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })} required />
                <input type="number" placeholder="Capacity" value={resourceForm.capacity}
                  onChange={(e) => setResourceForm({ ...resourceForm, capacity: e.target.value })} required />
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Save</button>
                  <button type="button" onClick={() => setShowResourceForm(false)} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="resources-list">
              {resources.map(resource => (
                <div key={resource._id} className="resource-item">
                  <h3>{resource.name}</h3>
                  <p>{resource.description}</p>
                  <div className="resource-actions">
                    <button onClick={() => handleDeleteResource(resource._id)} className="btn-delete">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
