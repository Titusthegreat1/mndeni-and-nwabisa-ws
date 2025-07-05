
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
import { ExternalLink } from 'lucide-react';

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

          {/* Gift Cards Section */}
          <div className="mt-12 text-center p-8 bg-brown/5 rounded-lg border border-brown/10">
            <h3 className="font-playfair text-2xl font-bold text-brown mb-6">
              Gift Cards & Vouchers
            </h3>
            <p className="text-brown/80 mb-6">
              If you prefer to give a gift card, here are some wonderful options:
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <a
                href="https://bash.com/?utm_source=google&utm_medium=cpc&utm_campaign=SRCH_BR_Bash&gad_source=1&gad_campaignid=17758067887&gclid=Cj0KCQjwmqPDBhCAARIsADorxIZj65AOwUGh75AFcDXRREgOm86MjOVkwSor4KhDeLZ-j4qYI7FO4_gaAvYKEALw_wcB"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta/90 text-white px-6 py-3 rounded-lg transition-colors"
              >
                @home <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://www.woolworths.co.za"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta/90 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Woolworths <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://m.yuppiechef.com/gift-vouchers.htm?adgroupid=8093711083&campaignid=135890803&device=c&devm=&display=mobile&gad_campaignid=135890803&gad_source=1&gclid=Cj0KCQjwmqPDBhCAARIsADorxIY8hyow4hwIgPRHdWjsk9l_jPlVWef84vFlqPNuSWT0vP8b6DGIbgcaAtRREALw_wcB&keyword=le+creuset+voucher&network=g"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta/90 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Le Creuset <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <ThankYouMessage />
        </div>
      </div>
    </div>
  );
};

export default Registry;
