
import React from 'react';
import ItemCard from './ItemCard';
import { RegistryItem } from './types';

interface FeaturedItemsProps {
  items: RegistryItem[];
  highlightItemId: number | null;
  onPurchaseConfirm: (item: RegistryItem, buyerName: string, buyerSurname: string) => void;
  isItemUnavailable: (item: RegistryItem) => boolean;
  getRemainingQuantity: (item: RegistryItem) => number;
}

const FeaturedItems: React.FC<FeaturedItemsProps> = ({
  items,
  highlightItemId,
  onPurchaseConfirm,
  isItemUnavailable,
  getRemainingQuantity
}) => {
  return (
    <div className="mb-8">
      <h2 className="font-playfair text-3xl font-bold text-brown mb-6 text-center">
        Featured Items
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div 
            key={item.id}
            className={highlightItemId === item.id ? 'ring-4 ring-terracotta rounded-lg' : ''}
          >
            <ItemCard 
              item={item} 
              onPurchaseConfirm={onPurchaseConfirm}
              isItemUnavailable={isItemUnavailable}
              getRemainingQuantity={getRemainingQuantity}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedItems;
