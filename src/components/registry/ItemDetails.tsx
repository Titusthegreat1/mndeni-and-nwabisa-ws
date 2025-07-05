
import React from 'react';
import { RegistryItem } from './types';

interface ItemDetailsProps {
  item: RegistryItem;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ item }) => {
  return (
    <div className="bg-cream/50 p-4 rounded-lg">
      <h4 className="font-semibold text-brown mb-2">{item.name}</h4>
      <p className="text-sm text-brown/70 mb-1">{item.brand}</p>
      <p className="text-lg font-bold text-brown">{item.price}</p>
    </div>
  );
};

export default ItemDetails;
