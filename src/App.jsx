import React, { useState } from 'react';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';
import ItemDetail from './components/ItemDetail';
import Matches from './components/Matches';
import { mockItems } from './data/mockData';

function App() {
  const [view, setView] = useState('list');
  const [items, setItems] = useState(mockItems);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const handleCreate = (newItem) => {
    const item = { ...newItem, id: Date.now(), reviews: [], rating: 0 };
    setItems([...items, item]);
    setView('list');
  };

  const handleUpdate = (updatedItem) => {
    setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item));
    setEditingItem(null);
    setView('list');
  };

  const handleDelete = (id) => {
    setItems(items.filter(item => item.id !== id));
    setSelectedItem(null);
    setView('list');
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setView('form');
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setView('detail');
  };

  const handleAddReview = (itemId, review) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const newReviews = [...item.reviews, review];
        const avgRating = newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
        return { ...item, reviews: newReviews, rating: avgRating };
      }
      return item;
    }));
  };

  return (
    <div>
      <header className="header">
        <div className="container">
          <h1>ShareSwap</h1>
          <nav className="nav">
            <button 
              className={view === 'list' ? 'active' : ''} 
              onClick={() => setView('list')}
            >
              Browse Items
            </button>
            <button 
              className={view === 'matches' ? 'active' : ''} 
              onClick={() => setView('matches')}
            >
              Smart Matches
            </button>
            <button 
              className={view === 'form' ? 'active' : ''} 
              onClick={() => { setEditingItem(null); setView('form'); }}
            >
              List Item
            </button>
          </nav>
        </div>
      </header>

      <div className="container">
        {view === 'list' && (
          <ItemList 
            items={items} 
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        
        {view === 'form' && (
          <ItemForm 
            item={editingItem}
            onSubmit={editingItem ? handleUpdate : handleCreate}
            onCancel={() => setView('list')}
          />
        )}
        
        {view === 'detail' && selectedItem && (
          <ItemDetail 
            item={selectedItem}
            onBack={() => setView('list')}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddReview={handleAddReview}
          />
        )}
        
        {view === 'matches' && (
          <Matches items={items} onView={handleView} />
        )}
      </div>
    </div>
  );
}

export default App;
