import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ItemCard from './ItemCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RegistryItem } from './types';
import { appliancesCategory } from './categories/AppliancesCategory';
import { bathroomCategory } from './categories/BathroomCategory';
import { cookwareCategory } from './categories/CookwareCategory';
import { tablewareCategory } from './categories/TablewareCategory';
import { servewareCategory } from './categories/ServewareCategory';
import { utensilsCategory } from './categories/UtensilsCategory';
import { outdoorCategory } from './categories/OutdoorCategory';
import { glasswareCategory } from './categories/GlasswareCategory';
import { beddingCategory } from './categories/BeddingCategory';
import { homeDecorCategory } from './categories/HomeDecorCategory';
import { registryItems } from './RegistryItems';

interface CategoryTabsProps {
  highlightItemId: number | null;
  onPurchaseConfirm: (item: RegistryItem, buyerName: string, buyerSurname: string) => Promise<void>;
  isItemUnavailable: (item: RegistryItem) => boolean;
  getRemainingQuantity: (item: RegistryItem) => number;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  highlightItemId,
  onPurchaseConfirm,
  isItemUnavailable,
  getRemainingQuantity
}) => {
  const [currentPages, setCurrentPages] = useState<Record<string, number>>({
    all: 1,
    appliances: 1,
    bathroom: 1,
    cookware: 1,
    tableware: 1,
    serveware: 1,
    utensils: 1,
    outdoor: 1,
    glassware: 1,
    bedding: 1,
    homeDecor: 1
  });

  const itemsPerPage = 10;

  // All items (excluding gift items from registryItems)
  const allItems = registryItems.filter(item => item.id < 1000);

  const categories = {
    all: allItems,
    appliances: appliancesCategory,
    bathroom: bathroomCategory,
    cookware: cookwareCategory,
    tableware: tablewareCategory,
    serveware: servewareCategory,
    utensils: utensilsCategory,
    outdoor: outdoorCategory,
    glassware: glasswareCategory,
    bedding: beddingCategory,
    homeDecor: homeDecorCategory
  };

  const categoryLabels = {
    all: 'All',
    appliances: 'Appliances',
    bathroom: 'Bathroom',
    cookware: 'Cookware',
    tableware: 'Tableware',
    serveware: 'Serveware',
    utensils: 'Utensils',
    outdoor: 'Outdoor',
    glassware: 'Glassware',
    bedding: 'Bedding',
    homeDecor: 'Home Decor'
  };

  const handlePageChange = (category: string, direction: 'prev' | 'next') => {
    setCurrentPages(prev => {
      const categoryItems = categories[category as keyof typeof categories];
      const totalPages = Math.ceil(categoryItems.length / itemsPerPage);
      const currentPage = prev[category];
      
      let newPage = currentPage;
      if (direction === 'prev' && currentPage > 1) {
        newPage = currentPage - 1;
      } else if (direction === 'next' && currentPage < totalPages) {
        newPage = currentPage + 1;
      }
      
      return { ...prev, [category]: newPage };
    });
  };

  const renderCategoryContent = (categoryKey: string) => {
    const categoryItems = categories[categoryKey as keyof typeof categories];
    const currentPage = currentPages[categoryKey];
    const totalPages = Math.ceil(categoryItems.length / itemsPerPage);
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageItems = categoryItems.slice(startIndex, endIndex);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentPageItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onPurchaseConfirm={onPurchaseConfirm}
              isItemUnavailable={isItemUnavailable}
              getRemainingQuantity={getRemainingQuantity}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={() => handlePageChange(categoryKey, 'prev')}
              disabled={currentPage === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <span className="text-brown/80">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              onClick={() => handlePageChange(categoryKey, 'next')}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-8">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 xl:grid-cols-11 gap-1 mb-8">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <TabsTrigger 
              key={key} 
              value={key}
              className="text-xs px-2 py-1 data-[state=active]:bg-terracotta data-[state=active]:text-white"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {Object.keys(categories).map((categoryKey) => (
          <TabsContent key={categoryKey} value={categoryKey}>
            {renderCategoryContent(categoryKey)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CategoryTabs;