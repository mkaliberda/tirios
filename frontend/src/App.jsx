import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ItemsPage from './pages/items/items-page';
import ItemDetailPage from './pages/item-detail/item-detail-page';
import ViceCityBg from './shared/components/main-bg-vice-city';

const App = () => {
  return (
    <ViceCityBg>
      <Routes>
        <Route path="/" element={<ItemsPage />} />
        <Route path="/items/:id" element={<ItemDetailPage />} />
      </Routes>
    </ViceCityBg>
  );
};

export default App;
