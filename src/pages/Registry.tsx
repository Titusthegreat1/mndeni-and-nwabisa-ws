import React, { useState, useEffect, useCallback } from 'react';
import Navigation from '../components/Navigation';
import ScrollToTop from '@/components/ScrollToTop';
import RegistryHeader from '../components/registry/RegistryHeader';
import CategoryTabs from '../components/registry/CategoryTabs';
import { allRegistryItems, RegistryItem } from '../components/registry/RegistryItems';
import { supabase } from '@/integrations/supabase/client';
import PurchaseInfo from '../components/registry/PurchaseInfo';
import { useToast } from '@/hooks/use-toast';
import ThankYouMessage from '../components/registry/ThankYouMessage';
import { ExternalLink } from 'lucide-react';

const Registry = () => {
  const { toast } = useToast();
  const [itemQuantities, setItemQuantities] = useState<Record<number, number>>({});
  const [purchasedItems, setPurchasedItems] = useState(new Set());
  const [highlightItemId, setHighlightItemId] = useState<number | null>(null);

  // Load purchase data from Supabase
  const loadPurchaseDataFromSupabase = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('registry_items')
        .select('*');
      
      if (error) {
        console.error('Error loading purchase data:', error);
        return;
      }

      // Convert Supabase data to local state format
      const quantities: Record<number, number> = {};
      const purchased = new Set<number>();

      data?.forEach((dbItem) => {
        // Match database items to registry items by name and brand
        const registryItem = allRegistryItems.find(item => 
          item.name === dbItem.name && item.brand === dbItem.brand
        );
        
        if (registryItem) {
          quantities[registryItem.id] = dbItem.purchased_quantity || 0;
          
          // Mark as purchased if fully bought
          const totalQuantity = registryItem.quantity || 1;
          if ((dbItem.purchased_quantity || 0) >= totalQuantity) {
            purchased.add(registryItem.id);
          }
        }
      });

      setItemQuantities(quantities);
      setPurchasedItems(purchased);
      
      console.log('Loaded purchase data from Supabase:', { quantities, purchased: Array.from(purchased) });
    } catch (error) {
      console.error('Error in loadPurchaseDataFromSupabase:', error);
    }
  }, []);

  // Setup real-time subscription for cross-device synchronization
  const setupRealtimeSubscription = useCallback(() => {
    console.log('Setting up realtime subscription...');
    
    const channel = supabase
      .channel('registry-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'registry_items'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          // Reload data when changes occur
          loadPurchaseDataFromSupabase();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadPurchaseDataFromSupabase]);

  // Load purchased items and quantities from Supabase on component mount
  useEffect(() => {
    loadPurchaseDataFromSupabase();
    const cleanup = setupRealtimeSubscription();
    return cleanup;
  }, [loadPurchaseDataFromSupabase, setupRealtimeSubscription]);

  // Use the same featured items as homepage (items 118, 119, 120, 121, 122)
  const featuredItemIds = [118, 119, 120, 121, 122];
  const featuredItems = allRegistryItems.filter(item => featuredItemIds.includes(item.id));

  // Check for highlight parameter and show all items if coming from homepage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const highlightId = urlParams.get('highlight');
    
    if (highlightId) {
      const itemId = parseInt(highlightId);
      setHighlightItemId(itemId);
      setShowAllItems(true);
      
      // Clear highlight after 3 seconds
      setTimeout(() => {
        setHighlightItemId(null);
      }, 3000);
      
      // Find which page the highlighted item is on in the complete registry
      const allItems = registryItems;
      const itemIndex = allItems.findIndex(item => item.id === itemId);
      
      if (itemIndex !== -1) {
        // Check if item is in featured items first
        const isFeatured = featuredItemIds.includes(itemId);
        
        if (!isFeatured) {
          // For non-featured items, find the correct page in the "View All" section
          const rearrangedItems = [...registryItems.slice(20), ...registryItems.slice(4, 20)];
          const filteredItems = rearrangedItems.filter(item => !featuredItemIds.includes(item.id));
          const uniqueItems = filteredItems.filter((item, index, self) => 
            index === self.findIndex(i => i.id === item.id)
          );
          
          const highlightedItemIndex = uniqueItems.findIndex(item => item.id === itemId);
          if (highlightedItemIndex !== -1) {
            const pageIndex = Math.floor(highlightedItemIndex / itemsPerPage);
            setCurrentPage(pageIndex + 1);
          }
        }
        
        // Scroll to the highlighted item after a brief delay
        setTimeout(() => {
          if (isFeatured) {
            // Scroll to featured items section
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            // Scroll to all items section and then to the specific item
            const allItemsSection = document.getElementById('all-registry-items');
            if (allItemsSection) {
              allItemsSection.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }, 500);
      }
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
  
  // Rearrange items: move first 20 to pages 6 and 7, others move up
  // Also exclude featured items from the "View All" section
  const rearrangedItems = [...registryItems.slice(20), ...registryItems.slice(4, 20)];
  const remainingItems = rearrangedItems.filter(item => !featuredItemIds.includes(item.id));
  
  // Remove duplicates based on ID to prevent repetition
  const uniqueRemainingItems = remainingItems.filter((item, index, self) => 
    index === self.findIndex(i => i.id === item.id)
  );
  
  const totalPages = Math.ceil(uniqueRemainingItems.length / itemsPerPage);

  const handlePurchaseConfirm = async (item: RegistryItem, buyerName: string, buyerSurname: string) => {
    try {
      console.log('Processing purchase for:', item.name, 'by', buyerName, buyerSurname);
      
      // Update Supabase database to track purchase across all devices
      const { error } = await supabase.rpc('update_registry_item_quantity', {
        item_name: item.name,
        item_brand: item.brand,
        increment_amount: 1
      });

      if (error) {
        console.error('Error updating purchase in Supabase:', error);
        toast({
          title: "Error",
          description: "Failed to record purchase. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // The real-time subscription will automatically update the UI
      toast({
        title: "Gift Selected!",
        description: "Email client opened. Thank you for selecting this gift!",
      });
      
      console.log('Purchase recorded successfully in Supabase');
    } catch (error) {
      console.error('Error in handlePurchaseConfirm:', error);
      toast({
        title: "Error",
        description: "Failed to record purchase. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Check if item is unavailable (fully purchased)
  const isItemUnavailable = (item: RegistryItem) => {
    // Gift cards are always available
    if (item.id >= 9000) return false;
    
    // Check if item is fully purchased based on quantity
    const totalQuantity = item.quantity || 1;
    const purchasedQuantity = itemQuantities[item.id] || 0;
    const isUnavailable = purchasedQuantity >= totalQuantity;
    
    if (isUnavailable) {
      console.log(`Item ${item.id} (${item.name}) is unavailable: ${purchasedQuantity}/${totalQuantity} purchased`);
    }
    
    return isUnavailable;
  };

  // Get remaining quantity for an item
  const getRemainingQuantity = (item: RegistryItem) => {
    // Gift cards always have quantity of 1 available
    if (item.id >= 9000) return 1;
    
    const totalQuantity = item.quantity || 1;
    const purchasedQuantity = itemQuantities[item.id] || 0;
    return Math.max(0, totalQuantity - purchasedQuantity);
  };

  const scrollToAllItems = () => {
    const allItemsSection = document.getElementById('all-registry-items');
    if (allItemsSection) {
      allItemsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePreviousPage = () => {
    const newPage = Math.max(currentPage - 1, 1);
    setCurrentPage(newPage);
    setTimeout(() => {
      scrollToAllItems();
    }, 100);
  };

  const handleNextPage = () => {
    const newPage = Math.min(currentPage + 1, totalPages);
    setCurrentPage(newPage);
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
            getRemainingQuantity={getRemainingQuantity}
          />

          <CategoryTabs
            highlightItemId={highlightItemId}
            onPurchaseConfirm={handlePurchaseConfirm}
            isItemUnavailable={isItemUnavailable}
            getRemainingQuantity={getRemainingQuantity}
          />

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
              <button
                onClick={() => {
                  const confirmed = window.confirm("Do you want to select the @home gift card? This will redirect you to their website.");
                  if (confirmed) {
                    toast({
                      title: "Gift Card Selected!",
                      description: "Redirecting to @home website...",
                    });
                    setTimeout(() => {
                      window.open("https://bash.com/?utm_source=google&utm_medium=cpc&utm_campaign=SRCH_BR_Bash&gad_source=1&gad_campaignid=17758067887&gclid=Cj0KCQjwmqPDBhCAARIsADorxIZj65AOwUGh75AFcDXRREgOm86MjOVkwSor4KhDeLZ-j4qYI7FO4_gaAvYKEALw_wcB", "_blank");
                    }, 1000);
                  }
                }}
                className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta/90 text-white px-6 py-3 rounded-lg transition-colors"
              >
                @home <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const confirmed = window.confirm("Do you want to select the Woolworths gift card? This will redirect you to their website.");
                  if (confirmed) {
                    toast({
                      title: "Gift Card Selected!",
                      description: "Redirecting to Woolworths website...",
                    });
                    setTimeout(() => {
                      window.open("https://www.woolworths.co.za", "_blank");
                    }, 1000);
                  }
                }}
                className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta/90 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Woolworths <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const confirmed = window.confirm("Do you want to select the Le Creuset gift card? This will redirect you to their website.");
                  if (confirmed) {
                    toast({
                      title: "Gift Card Selected!",
                      description: "Redirecting to Le Creuset website...",
                    });
                    setTimeout(() => {
                      window.open("https://m.yuppiechef.com/gift-vouchers.htm?adgroupid=8093711083&campaignid=135890803&device=c&devm=&display=mobile&gad_campaignid=135890803&gad_source=1&gclid=Cj0KCQjwmqPDBhCAARIsADorxIY8hyow4hwIgPRHdWjsk9l_jPlVWef84vFlqPNuSWT0vP8b6DGIbgcaAtRREALw_wcB&keyword=le+creuset+voucher&network=g", "_blank");
                    }, 1000);
                  }
                }}
                className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta/90 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Le Creuset <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const confirmed = window.confirm("Do you want to select the Leroy Merlin gift voucher? This will redirect you to their website.");
                  if (confirmed) {
                    toast({
                      title: "Gift Voucher Selected!",
                      description: "Redirecting to Leroy Merlin website...",
                    });
                    setTimeout(() => {
                      window.open("https://leroymerlin.co.za/gifts-vouchers?srsltid=AfmBOooBQH6MT0-gS0IF8ve_MqBMRiCYgNsyyF_IGOxLMEoeFtqw17CS", "_blank");
                    }, 1000);
                  }
                }}
                className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta/90 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Leroy Merlin <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const confirmed = window.confirm("Do you want to select the Builders Warehouse gift card? This will redirect you to their website.");
                  if (confirmed) {
                    toast({
                      title: "Gift Card Selected!",
                      description: "Redirecting to Builders Warehouse website...",
                    });
                    setTimeout(() => {
                      window.open("https://www.builders.co.za/giftcard?srsltid=AfmBOopJleIoJegMrb6CWvuDRsHNjvIXpKpgkdvert3nbQOCnNMOm3N1", "_blank");
                    }, 1000);
                  }
                }}
                className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta/90 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Builders Warehouse <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          <ThankYouMessage />
        </div>
      </div>
    </div>
  );
};

export default Registry;
