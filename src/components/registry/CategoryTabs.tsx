import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ItemCard from './ItemCard';
import { RegistryItem } from './types';
import { registryCategories } from './RegistryItems';

interface CategoryTabsProps {
  highlightItemId: number | null;
  onPurchaseConfirm: (item: RegistryItem, buyerName: string, buyerSurname: string) => void;
  isItemUnavailable: (item: RegistryItem) => boolean;
  getRemainingQuantity: (item: RegistryItem) => number;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  highlightItemId,
  onPurchaseConfirm,
  isItemUnavailable,
  getRemainingQuantity
}) => {
  const [currentPages, setCurrentPages] = React.useState<Record<string, number>>({});
  const itemsPerPage = 10;

  const renderCategoryItems = (categoryKey: string, items: RegistryItem[]) => {
    const currentPage = currentPages[categoryKey] || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = items.slice(startIndex, endIndex);
    const totalPages = Math.ceil(items.length / itemsPerPage);

    return (
      <div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {pageItems.map((item) => (
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
        
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mb-8">
            <button
              onClick={() => setCurrentPages(prev => ({ 
                ...prev, 
                [categoryKey]: Math.max((prev[categoryKey] || 1) - 1, 1) 
              }))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-brown hover:bg-brown/90 text-cream rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-brown font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPages(prev => ({ 
                ...prev, 
                [categoryKey]: Math.min((prev[categoryKey] || 1) + 1, totalPages) 
              }))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-brown hover:bg-brown/90 text-cream rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-5 lg:grid-cols-11 mb-8">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="appliances">Appliances</TabsTrigger>
        <TabsTrigger value="bathroom">Bathroom</TabsTrigger>
        <TabsTrigger value="cookware">Cookware</TabsTrigger>
        <TabsTrigger value="tableware">Tableware</TabsTrigger>
        <TabsTrigger value="serveware">Serveware</TabsTrigger>
        <TabsTrigger value="utensils">Utensils</TabsTrigger>
        <TabsTrigger value="outdoor">Outdoor</TabsTrigger>
        <TabsTrigger value="glassware">Glassware</TabsTrigger>
        <TabsTrigger value="bedding">Bedding</TabsTrigger>
        <TabsTrigger value="homedecor">Home Decor</TabsTrigger>
      </TabsList>

      {Object.entries(registryCategories).map(([key, items]) => (
        <TabsContent key={key} value={key}>
          {renderCategoryItems(key, items)}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default CategoryTabs;