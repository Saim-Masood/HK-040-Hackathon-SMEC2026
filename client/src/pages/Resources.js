import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Resources.css';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [filters, setFilters] = useState({ search: '', type: '', availability: '' });

  useEffect(() => {
    fetchResources();
  }, [filters]);

  const fetchResources = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.type) params.append('type', filters.type);
      if (filters.availability) params.append('availability', filters.availability);
      
      const { data } = await axios.get(`/api/resources?${params}`);
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  return (
    <div className="resources-page">
      <div className="container">
        <h1>Resource Catalog</h1>
        
        <div className="filters">
          <input
            type="text"
            placeholder="Search resources..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option value="">All Types</option>
            <option value="lab">Lab</option>
            <option value="hall">Hall</option>
            <option value="equipment">Equipment</option>
            <option value="room">Room</option>
          </select>
          <select value={filters.availability} onChange={(e) => setFilters({ ...filters, availability: e.target.value })}>
            <option value="">All</option>
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>

        <div className="resources-grid">
          {resources.map(resource => (
            <Link to={`/resources/${resource._id}`} key={resource._id} className="resource-card">
              <div className="resource-header">
                <h3>{resource.name}</h3>
                <span className={`badge ${resource.type}`}>{resource.type}</span>
              </div>
              <p>{resource.description}</p>
              <div className="resource-info">
                <span>Capacity: {resource.capacity}</span>
                <span className={resource.availability ? 'available' : 'unavailable'}>
                  {resource.availability ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;
