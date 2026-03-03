import React from 'react';
import CardContent from '../../../shared/components/card-content';
import ItemTextCard from './item-text-card';

const ItemDetailsCard = ({ item, actions, closeAction }) => {
  return (
    <CardContent
      className="max-w-2xl"
      closeAction={closeAction}
      title={item.name}
      contentClassName="space-y-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <ItemTextCard
          title="Category"
          text={item.category}
        />
        <ItemTextCard
          title="Price"
          text={`$ ${item.price}`}
        />
      </div>
      {actions && <div className="flex justify-end pt-1">{actions}</div>}
    </CardContent>
  );
};

export default ItemDetailsCard;
