import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ItemsPage from './pages/items/ItemsPage';
import ItemDetailPage from './pages/item-detail/ItemDetailPage';

const App = () => {
  return (
    <>
      <nav style={{ padding: 16, borderBottom: '1px solid #ddd' }}>
        <Link to="/">Items</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ItemsPage />} />
        <Route path="/items/:id" element={<ItemDetailPage />} />
      </Routes>
    </>
  );
};

export default App;
