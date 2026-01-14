import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './ResourceDetail.css';

const ResourceDetail = () => {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    startTime: '', endTime: '', purpose: '', attendees: 1
  });

  useEffect(() => {
    fetchResource();
  }, [id]);

  useEffect(() => {
    if (selectedDate) fetchAvailability();
  }, [selectedDate]);

  const fetchResource = async () => {
    try {
      const { data } = await axios.get(`/api/resources/${id}`);
      setResource(data);
    } catch (error) {
      toast.error('Error loading resource');
    }
  };

  const fetchAvailability = async () => {
    try {
      const { data } = await axios.get(`/api/resources/${id}/availability`, {
        params: { date: selectedDate.toISOString() }
      });
      setBookings(data);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookingData = {
        resource: id,
        startTime: new Date(`${selectedDate.toDateString()} ${formData.startTime}`),
        endTime: new Date(`${selectedDate.toDateString()} ${formData.endTime}`),
        purpose: formData.purpose,
        attendees: parseInt(formData.attendees)
      };

      await axios.post('/api/bookings', bookingData);
      toast.success('Booking request submitted!');
      setFormData({ startTime: '', endTime: '', purpose: '', attendees: 1 });
      fetchAvailability();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  if (!resource) return <div className="loading">Loading...</div>;

  return (
    <div className="resource-detail">
      <div className="container">
        <div className="detail-grid">
          <div className="resource-info-section">
            <h1>{resource.name}</h1>
            <span className={`badge ${resource.type}`}>{resource.type}</span>
            <p>{resource.description}</p>
            <div className="info-list">
              <div><strong>Capacity:</strong> {resource.capacity}</div>
              <div><strong>Location:</strong> {resource.location.building}, Floor {resource.location.floor}</div>
              <div><strong>Operating Hours:</strong> {resource.operatingHours.start} - {resource.operatingHours.end}</div>
            </div>
          </div>

          <div className="booking-section">
            <h2>Book This Resource</h2>
            <Calendar onChange={setSelectedDate} value={selectedDate} minDate={new Date()} />
            
            <div className="availability-slots">
              <h3>Booked Slots for {selectedDate.toDateString()}</h3>
              {bookings.length === 0 ? (
                <p>No bookings for this date</p>
              ) : (
                bookings.map(booking => (
                  <div key={booking._id} className="booked-slot">
                    {new Date(booking.startTime).toLocaleTimeString()} - {new Date(booking.endTime).toLocaleTimeString()}
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSubmit} className="booking-form">
              <input type="time" value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} required />
              <input type="time" value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} required />
              <input type="number" placeholder="Attendees" min="1" max={resource.capacity}
                value={formData.attendees}
                onChange={(e) => setFormData({ ...formData, attendees: e.target.value })} required />
              <textarea placeholder="Purpose of booking" value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} required />
              <button type="submit" className="btn-primary">Submit Booking</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;
