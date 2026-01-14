import React, { useState } from 'react';

function ItemDetail({ item, onBack, onEdit, onDelete, onAddReview }) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [review, setReview] = useState({ user: 'Current User', rating: 5, comment: '' });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    onAddReview(item.id, review);
    setReview({ user: 'Current User', rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: '20px' }}>
        ← Back to List
      </button>
      
      <div className="card">
        <img src={item.image} alt={item.title} style={{ height: '400px' }} />
        <h2>{item.title}</h2>
        <div style={{ marginBottom: '15px' }}>
          <span className={`badge badge-${item.type}`}>
            {item.type === 'rental' ? `$${item.price}/day` : 'Barter'}
          </span>
          <span className="rating" style={{ marginLeft: '10px' }}>
            ★ {item.rating.toFixed(1)} ({item.reviews.length} reviews)
          </span>
        </div>
        <p><strong>Category:</strong> {item.category}</p>
        <p><strong>Owner:</strong> {item.owner}</p>
        <p style={{ marginTop: '15px', lineHeight: '1.6' }}>{item.description}</p>
        
        <div className="actions" style={{ marginTop: '20px' }}>
          <button className="btn" onClick={() => onEdit(item)}>Edit</button>
          <button className="btn btn-danger" onClick={() => onDelete(item.id)}>Delete</button>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>Reviews</h3>
        {item.reviews.length === 0 ? (
          <p style={{ color: '#888' }}>No reviews yet. Be the first to review!</p>
        ) : (
          item.reviews.map((rev, idx) => (
            <div key={idx} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <strong>{rev.user}</strong>
                <span className="rating">★ {rev.rating}</span>
              </div>
              <p>{rev.comment}</p>
            </div>
          ))
        )}
        
        {!showReviewForm ? (
          <button 
            className="btn" 
            onClick={() => setShowReviewForm(true)}
            style={{ marginTop: '15px' }}
          >
            Add Review
          </button>
        ) : (
          <form onSubmit={handleSubmitReview} style={{ marginTop: '15px' }}>
            <div className="form-group">
              <label>Rating</label>
              <select 
                value={review.rating} 
                onChange={(e) => setReview({ ...review, rating: parseInt(e.target.value) })}
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Terrible</option>
              </select>
            </div>
            <div className="form-group">
              <label>Comment</label>
              <textarea 
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn">Submit Review</button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ItemDetail;
