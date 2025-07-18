
import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RegistryItem } from './types';
import GiftSelectionDialog from './GiftSelectionDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ItemCardProps {
  item: RegistryItem;
  onPurchaseConfirm: (item: RegistryItem, buyerName: string, buyerSurname: string) => void;
  isItemUnavailable: (item: RegistryItem) => boolean;
  getRemainingQuantity: (item: RegistryItem) => number;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onPurchaseConfirm, isItemUnavailable, getRemainingQuantity }) => {
  const [buyerName, setBuyerName] = useState('');
  const [buyerSurname, setBuyerSurname] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [requestDelivery, setRequestDelivery] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const isUnavailable = isItemUnavailable(item);
  const remainingQuantity = getRemainingQuantity(item);
  const hasQuantity = (item.quantity && item.quantity > 1) || item.color?.includes('Qty:');

  const handleGiftSelection = async () => {
    // Always require name/surname
    if (!buyerName.trim() || !buyerSurname.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your name and surname.",
        variant: "destructive",
      });
      return;
    }

    // Require email if delivery is requested
    if (requestDelivery && !buyerEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address for delivery coordination.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call the enhanced email function
      const { data, error } = await supabase.functions.invoke('send-registry-email', {
        body: {
          itemId: item.id,
          itemName: item.name,
          itemBrand: item.brand,
          itemPrice: item.price,
          itemSize: item.size,
          itemColor: item.color,
          itemWebsiteUrl: item.websiteUrl,
          buyerName: buyerName.trim(),
          buyerSurname: buyerSurname.trim(),
          buyerEmail: buyerEmail.trim() || undefined,
          requestDelivery,
        },
      });

      if (error) {
        console.error('Email function error:', error);
        throw new Error(error.message || 'Failed to send email');
      }

      onPurchaseConfirm(item, buyerName, buyerSurname);
      
      // Clear form
      setBuyerName('');
      setBuyerSurname('');
      setBuyerEmail('');
      setRequestDelivery(false);
      setIsDialogOpen(false);

      // Show success message with redirect info
      if (buyerEmail.trim()) {
        toast({
          title: "Gift Selected!",
          description: "Check your email for confirmation link to complete your purchase.",
        });
      } else {
        toast({
          title: "Gift Selected!",
          description: "Registry owners have been notified. Please contact them directly to arrange purchase.",
        });
      }

      // If direct URL is available, show redirect message and open it
      if (item.websiteUrl) {
        // Show redirect message immediately
        toast({
          title: "Redirecting...",
          description: "Taking you to the product page. Please wait a moment.",
          duration: 2000,
        });

        // Shorter delay for better mobile experience
        setTimeout(() => {
          // Enhanced for better mobile and desktop compatibility
          try {
            // For mobile devices, use location.href as fallback
            const newWindow = window.open(item.websiteUrl, '_blank', 'noopener,noreferrer');
            
            // Fallback for mobile devices that might block popups
            if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
              // Show additional message for mobile redirect
              toast({
                title: "Redirecting in same tab",
                description: "Opening product page...",
                duration: 1000,
              });
              setTimeout(() => {
                window.location.href = item.websiteUrl;
              }, 500);
            }
          } catch (error) {
            // Final fallback with user notification
            toast({
              title: "Opening product page",
              description: "Redirecting to complete your purchase...",
              duration: 1000,
            });
            setTimeout(() => {
              window.location.href = item.websiteUrl;
            }, 500);
          }
        }, 800); // Reduced from 1500ms to 800ms for faster experience
      }

    } catch (error: any) {
      console.error('Error selecting gift:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to select gift. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:scale-105 ${isUnavailable ? 'opacity-50' : ''}`}>
      <div className="mb-4 h-40 bg-gray-100 rounded-lg overflow-hidden relative">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-contain"
        />
        {isUnavailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">UNAVAILABLE</span>
          </div>
        )}
      </div>
      <h3 className="font-playfair text-lg font-bold text-brown mb-2">{item.name}</h3>
      <p className="text-sm text-brown/70 mb-1">{item.brand}</p>
      {item.size && <p className="text-sm text-brown/60 mb-1">Size: {item.size}</p>}
      {item.color && (
        <p className="text-sm text-brown/60 mb-2">
          Color: {item.color.replace(/,\s*Qty:\s*\d+/, '')}
        </p>
      )}
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-xl text-brown">{item.price}</span>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          isUnavailable 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {isUnavailable 
            ? 'Unavailable' 
            : hasQuantity 
              ? `${remainingQuantity} Available` 
              : 'Available'
          }
        </span>
      </div>
      
      <div className="space-y-2">
        <GiftSelectionDialog
          item={item}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          buyerName={buyerName}
          buyerSurname={buyerSurname}
          buyerEmail={buyerEmail}
          requestDelivery={requestDelivery}
          isLoading={isLoading}
          setBuyerName={setBuyerName}
          setBuyerSurname={setBuyerSurname}
          setBuyerEmail={setBuyerEmail}
          setRequestDelivery={setRequestDelivery}
          onGiftSelection={handleGiftSelection}
        >
          <Button 
            className="w-full bg-terracotta hover:bg-terracotta/90 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isUnavailable}
          >
            <Gift className="w-4 h-4 mr-2" />
            {isUnavailable ? 'Unavailable' : 'Select Gift'}
          </Button>
        </GiftSelectionDialog>
      </div>
    </div>
  );
};

export default ItemCard;
