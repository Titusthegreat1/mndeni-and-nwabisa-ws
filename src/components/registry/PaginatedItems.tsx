
import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ItemCard from './ItemCard';
import { RegistryItem } from './types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { giftItems } from './items/GiftItems';
import { dinnerwareItems } from './items/DinnerwareItems';
import { kitchenwareItems } from './items/KitchenwareItems';
import { servewareItems } from './items/ServewareItems';
import { appliancesItems } from './items/AppliancesItems';
import { cookwareItems } from './items/CookwareItems';
import { homeDecorItems } from './items/HomeDecorItems';
import { bathroomItems } from './items/BathroomItems';
import { outdoorToolsItems } from './items/OutdoorToolsItems';

interface PaginatedItemsProps {
  items: RegistryItem[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  highlightItemId: number | null;
  onPurchaseConfirm: (item: RegistryItem, buyerName: string, buyerSurname: string) => void;
  isItemUnavailable: (item: RegistryItem) => boolean;
  getRemainingQuantity: (item: RegistryItem) => number;
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
  getRemainingQuantity,
  onPreviousPage,
  onNextPage
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [tabPages, setTabPages] = useState<Record<string, number>>({
    all: 1,
    gifts: 1,
    kitchen: 1,
    cookware: 1,
    dinnerware: 1,
    serveware: 1,
    appliances: 1,
    homeDecor: 1,
    bathroom: 1,
    outdoor: 1
  });

  // Categorize items
  const categorizedItems = useMemo(() => {
    const uniqueItems = items.filter((item, index, self) => 
      index === self.findIndex(i => i.id === item.id)
    );

    return {
      all: uniqueItems,
      gifts: uniqueItems.filter(item => giftItems.some(gi => gi.id === item.id)),
      kitchen: uniqueItems.filter(item => kitchenwareItems.some(ki => ki.id === item.id)),
      cookware: uniqueItems.filter(item => cookwareItems.some(ci => ci.id === item.id)),
      dinnerware: uniqueItems.filter(item => dinnerwareItems.some(di => di.id === item.id)),
      serveware: uniqueItems.filter(item => servewareItems.some(si => si.id === item.id)),
      appliances: uniqueItems.filter(item => appliancesItems.some(ai => ai.id === item.id)),
      homeDecor: uniqueItems.filter(item => homeDecorItems.some(hi => hi.id === item.id)),
      bathroom: uniqueItems.filter(item => bathroomItems.some(bi => bi.id === item.id)),
      outdoor: uniqueItems.filter(item => outdoorToolsItems.some(oi => oi.id === item.id))
    };
  }, [items]);

  // Get current tab's items and pagination
  const getCurrentTabItems = (tabKey: string) => {
    const tabItems = categorizedItems[tabKey as keyof typeof categorizedItems] || [];
    const currentTabPage = tabPages[tabKey];
    const startIndex = (currentTabPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return tabItems.slice(startIndex, endIndex);
  };

  const getCurrentTabPages = (tabKey: string) => {
    const tabItems = categorizedItems[tabKey as keyof typeof categorizedItems] || [];
    return Math.ceil(tabItems.length / itemsPerPage);
  };

  const handleTabPageChange = (tabKey: string, direction: 'prev' | 'next') => {
    const maxPages = getCurrentTabPages(tabKey);
    const currentTabPage = tabPages[tabKey];
    
    const newPage = direction === 'prev' 
      ? Math.max(currentTabPage - 1, 1)
      : Math.min(currentTabPage + 1, maxPages);
    
    setTabPages(prev => ({ ...prev, [tabKey]: newPage }));
  };

  const currentTabItems = getCurrentTabItems(activeTab);
  const currentTabTotalPages = getCurrentTabPages(activeTab);

  return (
    <div className="animate-fade-in">
      <h2 id="all-registry-items" className="font-playfair text-3xl font-bold text-brown mb-6 text-center">
        All Registry Items
      </h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 mb-8">
          <TabsTrigger value="all" className="text-xs lg:text-sm">All</TabsTrigger>
          <TabsTrigger value="gifts" className="text-xs lg:text-sm">Gifts</TabsTrigger>
          <TabsTrigger value="kitchen" className="text-xs lg:text-sm">Kitchen</TabsTrigger>
          <TabsTrigger value="cookware" className="text-xs lg:text-sm">Cookware</TabsTrigger>
          <TabsTrigger value="dinnerware" className="text-xs lg:text-sm">Dinnerware</TabsTrigger>
          <TabsTrigger value="serveware" className="text-xs lg:text-sm">Serveware</TabsTrigger>
          <TabsTrigger value="appliances" className="text-xs lg:text-sm">Appliances</TabsTrigger>
          <TabsTrigger value="homeDecor" className="text-xs lg:text-sm">Home Decor</TabsTrigger>
          <TabsTrigger value="bathroom" className="text-xs lg:text-sm">Bathroom</TabsTrigger>
          <TabsTrigger value="outdoor" className="text-xs lg:text-sm">Outdoor</TabsTrigger>
        </TabsList>

        {["all", "gifts", "kitchen", "cookware", "dinnerware", "serveware", "appliances", "homeDecor", "bathroom", "outdoor"].map((tabKey) => (
          <TabsContent key={tabKey} value={tabKey}>
            {/* Current Tab Items */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {getCurrentTabItems(tabKey).map((item) => (
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

            {/* Tab-specific Pagination Controls */}
            {getCurrentTabPages(tabKey) > 1 && (
              <div className="flex justify-center items-center gap-4 mb-8">
                <button
                  onClick={() => handleTabPageChange(tabKey, 'prev')}
                  disabled={tabPages[tabKey] === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-brown hover:bg-brown/90 text-cream rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <span className="text-brown font-semibold">
                  Page {tabPages[tabKey]} of {getCurrentTabPages(tabKey)}
                </span>
                
                <button
                  onClick={() => handleTabPageChange(tabKey, 'next')}
                  disabled={tabPages[tabKey] === getCurrentTabPages(tabKey)}
                  className="flex items-center gap-2 px-4 py-2 bg-brown hover:bg-brown/90 text-cream rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PaginatedItems;
