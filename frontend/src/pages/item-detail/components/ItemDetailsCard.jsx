import React from 'react';

const ItemDetailsCard = ({ item }) => {
  return (
    <div style={{ padding: 16 }}>
      <h2>{item.name}</h2>
      <p>
        <strong>Category:</strong>
        {' '}
        {item.category}
      </p>
      <p>
        <strong>Price:</strong>
        {' '}
        $
        {item.price}
      </p>
    </div>
  );
};

export default ItemDetailsCard;
