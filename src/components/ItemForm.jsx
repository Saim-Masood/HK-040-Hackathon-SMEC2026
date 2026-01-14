import React, { useState } from 'react';

function ItemForm({ item, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(item || {
    title: '',
    description: '',
    image: '',
    category: 'Electronics',
    type: 'rental',
    price: '',
    owner: 'Current User'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, price: parseFloat(formData.price) || 0 });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{item ? 'Edit Item' : 'List New Item'}</h2>
      
      <div className="form-group">
        <label>Title *</label>
        <input 
          type="text" 
          name="title" 
          value={formData.title} 
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Description *</label>
        <textarea 
          name="description" 
          value={formData.description} 
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Image URL *</label>
        <input 
          type="url" 
          name="image" 
          value={formData.image} 
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Category *</label>
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="Electronics">Electronics</option>
          <option value="Tools">Tools</option>
          <option value="Clothing">Clothing</option>
          <option value="Sports">Sports</option>
          <option value="Home">Home</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label>Type *</label>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="rental">Rental</option>
          <option value="barter">Barter</option>
        </select>
      </div>

      {formData.type === 'rental' && (
        <div className="form-group">
          <label>Price per Day ($) *</label>
          <input 
            type="number" 
            name="price" 
            value={formData.price} 
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="submit" className="btn">
          {item ? 'Update Item' : 'List Item'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ItemForm;
