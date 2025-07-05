
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ItemCard from './ItemCard';
import { RegistryItem } from './types';

interface PaginatedItemsProps {
  items: RegistryItem[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  highlightItemId: number | null;
  onPurchaseConfirm: (item: RegistryItem, buyerName: string, buyerSurname: string) => void;
  isItemUnavailable: (item: RegistryItem) => boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const PaginatedItems: React.FC<PaginatedItemsProps> = ({
  items,
  currentPage,
  totalPages,
  itemsPerPage,
  highlightItemId,
  onPurchaseConfirm,
  isItemUnavailable,
  onPreviousPage,
  onNextPage
}) => {
  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageItems = items.slice(startIndex, endIndex);

  return (
    <div className="animate-fade-in">
      <h2 id="all-registry-items" className="font-playfair text-3xl font-bold text-brown mb-6 text-center">
        All Registry Items
      </h2>
      
      {/* Current Page Items */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentPageItems.map((item) => (
          <div 
            key={item.id}
            className={highlightItemId === item.id ? 'ring-4 ring-terracotta rounded-lg' : ''}
          >
            <ItemCard 
              item={item} 
              onPurchaseConfirm={onPurchaseConfirm}
              isItemUnavailable={isItemUnavailable}
            />
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mb-8">
          <button
            onClick={onPreviousPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 bg-brown hover:bg-brown/90 text-cream rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          
          <span className="text-brown font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 bg-brown hover:bg-brown/90 text-cream rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PaginatedItems;
