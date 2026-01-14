import React from 'react';

function ItemList({ items, onView, onEdit, onDelete }) {
  return (
    <div>
      <h2>Available Items</h2>
      <div className="grid">
        {items.map(item => (
          <div key={item.id} className="card">
            <img src={item.image} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.description.substring(0, 100)}...</p>
            <div>
              <span className={`badge badge-${item.type}`}>
                {item.type === 'rental' ? `$${item.price}/day` : 'Barter'}
              </span>
              <span className="rating">★ {item.rating.toFixed(1)}</span>
            </div>
            <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#888' }}>
              Owner: {item.owner}
            </p>
            <div className="actions">
              <button className="btn" onClick={() => onView(item)}>View Details</button>
              <button className="btn btn-secondary" onClick={() => onEdit(item)}>Edit</button>
              <button className="btn btn-danger" onClick={() => onDelete(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ItemList;
