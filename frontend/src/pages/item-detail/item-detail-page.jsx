import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useItemQuery } from '../../entities/items';
import ItemDetailsCard from './components/item-details-card';
import Btn from '../../shared/components/btn';

const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: item, isPending, isError } = useItemQuery(id);

  useEffect(() => {
    if (isError) {
      navigate('/');
    }
  }, [isError, navigate]);

  if (!item) {
    return null;
  }

  return (
    <ItemDetailsCard
      actions={(
        <Btn to="/" variant="primary">
          Back to items
        </Btn>
      )}
      closeAction={(
        <Btn
          aria-label="Back to items"
          className="rounded-full"
          size="icon"
          to="/"
          variant="icon"
        >
          <svg
            aria-hidden
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 5L15 15M15 5L5 15"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </svg>
        </Btn>
      )}
      item={isPending ? {} : item}
    />
  );
};

export default ItemDetailPage;
