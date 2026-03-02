import React from 'react';
import { Link } from 'react-router-dom';
import { useItemsQuery } from '../../../entities/items';

const ITEMS_QUERY_PARAMS = { limit: 500 };

const ItemsList = () => {
  const { data: items = [], isPending, isError } = useItemsQuery(ITEMS_QUERY_PARAMS);

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Unable to load items.</p>;
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <Link to={`/items/${item.id}`}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );
};

export default ItemsList;
