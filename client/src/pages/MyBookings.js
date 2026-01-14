import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings');
      setBookings(data);
    } catch (error) {
      toast.error('Error loading bookings');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await axios.patch(`/api/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cancellation failed');
    }
  };

  return (
    <div className="my-bookings">
      <div className="container">
        <h1>My Bookings</h1>
        
        {bookings.length === 0 ? (
          <p>No bookings found</p>
        ) : (
          <div className="bookings-table">
            <table>
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking._id}>
                    <td>{booking.resource.name}</td>
                    <td>{new Date(booking.startTime).toLocaleDateString()}</td>
                    <td>
                      {new Date(booking.startTime).toLocaleTimeString()} - 
                      {new Date(booking.endTime).toLocaleTimeString()}
                    </td>
                    <td>{booking.purpose}</td>
                    <td><span className={`status ${booking.status}`}>{booking.status}</span></td>
                    <td>
                      {booking.status !== 'cancelled' && booking.status !== 'declined' && (
                        <button onClick={() => handleCancel(booking._id)} className="btn-cancel">
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
