import React from 'react';

function Matches({ items, onView }) {
  // Smart matching algorithm based on category and type
  const findMatches = (item) => {
    return items
      .filter(i => i.id !== item.id)
      .map(i => {
        let score = 0;
        
        // Same category increases match score
        if (i.category === item.category) score += 40;
        
        // Complementary types (barter with barter, rental with rental)
        if (i.type === item.type) score += 30;
        
        // High rating items are better matches
        score += i.rating * 6;
        
        return { item: i, score: Math.min(100, Math.round(score)) };
      })
      .filter(match => match.score >= 50)
      .sort((a, b) => b.score - a.score);
  };

  const allMatches = items.flatMap(item => 
    findMatches(item).slice(0, 2).map(match => ({
      sourceItem: item,
      matchItem: match.item,
      score: match.score
    }))
  );

  // Remove duplicates
  const uniqueMatches = allMatches.filter((match, index, self) =>
    index === self.findIndex(m => 
      (m.sourceItem.id === match.sourceItem.id && m.matchItem.id === match.matchItem.id) ||
      (m.sourceItem.id === match.matchItem.id && m.matchItem.id === match.sourceItem.id)
    )
  ).slice(0, 6);

  return (
    <div>
      <h2>Smart Matches</h2>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Our algorithm suggests these swaps based on category, type, and ratings
      </p>
      
      {uniqueMatches.length === 0 ? (
        <div className="card">
          <p>No matches found yet. Add more items to see smart suggestions!</p>
        </div>
      ) : (
        <div className="grid">
          {uniqueMatches.map((match, idx) => (
            <div key={idx} className="card">
              <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>Match Suggestion</h3>
              
              <div style={{ marginBottom: '15px' }}>
                <img 
                  src={match.sourceItem.image} 
                  alt={match.sourceItem.title}
                  style={{ height: '120px', marginBottom: '10px' }}
                />
                <h4 style={{ fontSize: '0.95rem' }}>{match.sourceItem.title}</h4>
                <span className={`badge badge-${match.sourceItem.type}`}>
                  {match.sourceItem.type}
                </span>
              </div>
              
              <div style={{ textAlign: 'center', margin: '10px 0', fontSize: '1.5rem' }}>
                ⇄
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <img 
                  src={match.matchItem.image} 
                  alt={match.matchItem.title}
                  style={{ height: '120px', marginBottom: '10px' }}
                />
                <h4 style={{ fontSize: '0.95rem' }}>{match.matchItem.title}</h4>
                <span className={`badge badge-${match.matchItem.type}`}>
                  {match.matchItem.type}
                </span>
              </div>
              
              <div className="match-score">
                Match Score: {match.score}%
              </div>
              
              <div className="actions">
                <button 
                  className="btn" 
                  onClick={() => onView(match.sourceItem)}
                  style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                >
                  View Item 1
                </button>
                <button 
                  className="btn" 
                  onClick={() => onView(match.matchItem)}
                  style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                >
                  View Item 2
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Matches;
