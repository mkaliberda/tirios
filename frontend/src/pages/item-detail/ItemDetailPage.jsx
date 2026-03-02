import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useItemQuery } from '../../entities/items';
import ItemDetailsCard from './components/ItemDetailsCard';

const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: item, isPending, isError } = useItemQuery(id);

  useEffect(() => {
    if (isError) {
      navigate('/');
    }
  }, [isError, navigate]);

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (!item) {
    return null;
  }

  return <ItemDetailsCard item={item} />;
};

export default ItemDetailPage;
