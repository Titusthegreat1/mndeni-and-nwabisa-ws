
import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { useToast } from '@/hooks/use-toast';
import RegistryHeader from '../components/registry/RegistryHeader';
import RegistryFilters from '../components/registry/RegistryFilters';
import FeaturedItems from '../components/registry/FeaturedItems';
import PaginatedItems from '../components/registry/PaginatedItems';
import { registryItems, RegistryItem } from '../components/registry/RegistryItems';
import PurchaseInfo from '../components/registry/PurchaseInfo';
import ThankYouMessage from '../components/registry/ThankYouMessage';

const Registry = () => {
  const { toast } = useToast();
  const [showAllItems, setShowAllItems] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightItemId, setHighlightItemId] = useState<number | null>(null);
  const itemsPerPage = 6;

  // Load purchased items from localStorage on component mount
  useEffect(() => {
    const storedPurchasedItems = localStorage.getItem('purchasedRegistryItems');
    if (storedPurchasedItems) {
      setPurchasedItems(new Set(JSON.parse(storedPurchasedItems)));
    }
  }, []);

  // Save purchased items to localStorage whenever purchasedItems changes
  useEffect(() => {
    localStorage.setItem('purchasedRegistryItems', JSON.stringify(Array.from(purchasedItems)));
  }, [purchasedItems]);

  // Check for highlight parameter and show all items if coming from homepage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const highlightId = urlParams.get('highlight');
    
    if (highlightId) {
      const itemId = parseInt(highlightId);
      setHighlightItemId(itemId);
      setShowAllItems(true);
      
      // Find which page the highlighted item is on
      const itemIndex = registryItems.findIndex(item => item.id === itemId);
      if (itemIndex > 3) { // If not in featured items (first 4)
        // Rearrange items: move first 20 to end, others move up
        const rearrangedItems = [...registryItems.slice(20), ...registryItems.slice(0, 20)];
        const newItemIndex = rearrangedItems.findIndex(item => item.id === itemId);
        const pageIndex = Math.floor((newItemIndex - 4) / itemsPerPage);
        setCurrentPage(pageIndex + 1);
      }
      
      // Scroll to top after a brief delay
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else if (window.location.hash === '#all-registry-items') {
      setShowAllItems(true);
      setTimeout(() => {
        const allItemsSection = document.getElementById('all-registry-items');
        if (allItemsSection) {
          allItemsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Scroll to top when just visiting registry
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Use page 9 items as featured items (items 49-52)
  const featuredItems = registryItems.filter(item => [49, 50, 51, 52].includes(item.id));
  
  // Rearrange items: move first 20 to pages 6 and 7, others move up
  const rearrangedItems = [...registryItems.slice(20), ...registryItems.slice(4, 20)];
  const remainingItems = rearrangedItems;
  const totalPages = Math.ceil(remainingItems.length / itemsPerPage);

  const handlePurchaseConfirm = (item: RegistryItem, buyerName: string, buyerSurname: string) => {
    // Mark item as purchased locally
    setPurchasedItems(prev => new Set([...prev, item.id]));
    
    toast({
      title: "Gift Selected!",
      description: "Email client opened. Thank you for selecting this gift!",
    });
  };

  // Check if item is unavailable (purchased)
  const isItemUnavailable = (item: RegistryItem) => {
    return purchasedItems.has(item.id);
  };

  const scrollToAllItems = () => {
    const allItemsSection = document.getElementById('all-registry-items');
    if (allItemsSection) {
      allItemsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
    setTimeout(() => {
      scrollToAllItems();
    }, 100);
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
    setTimeout(() => {
      scrollToAllItems();
    }, 100);
  };

  return (
    <div id="top" className="min-h-screen bg-cream">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <RegistryHeader />

          <FeaturedItems 
            items={featuredItems}
            highlightItemId={highlightItemId}
            onPurchaseConfirm={handlePurchaseConfirm}
            isItemUnavailable={isItemUnavailable}
          />

          <RegistryFilters 
            showAllItems={showAllItems}
            onToggleShowAll={() => setShowAllItems(!showAllItems)}
          />

          {showAllItems && (
            <PaginatedItems 
              items={remainingItems}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              highlightItemId={highlightItemId}
              onPurchaseConfirm={handlePurchaseConfirm}
              isItemUnavailable={isItemUnavailable}
              onPreviousPage={handlePreviousPage}
              onNextPage={handleNextPage}
            />
          )}

          <PurchaseInfo />
          <ThankYouMessage />
        </div>
      </div>
    </div>
  );
};

export default Registry;
