
import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RegistryItem } from './types';
import GiftSelectionDialog from './GiftSelectionDialog';

interface ItemCardProps {
  item: RegistryItem;
  onPurchaseConfirm: (item: RegistryItem, buyerName: string, buyerSurname: string) => void;
  isItemUnavailable: (item: RegistryItem) => boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onPurchaseConfirm }) => {
  const [buyerName, setBuyerName] = useState('');
  const [buyerSurname, setBuyerSurname] = useState('');
  const [requestDelivery, setRequestDelivery] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleGiftSelection = () => {
    // If item has a website URL, just redirect after delivery confirmation
    if (item.websiteUrl) {
      window.open(item.websiteUrl, '_blank');
      onPurchaseConfirm(item, '', '');
      setRequestDelivery(false);
      setIsDialogOpen(false);
      return;
    }

    // For items without links, proceed with email process
    if (buyerName.trim() && buyerSurname.trim()) {
      const subject = encodeURIComponent(`Gift Selection: ${item.name} - Wedding Registry`);
      let body = '';
      
      if (requestDelivery) {
        body = encodeURIComponent(
          `Dear Dimpho Parkies / Zama Kunene,

I would like to purchase and have delivered the following item from Mndeni & Nwabisa's wedding registry:

Item: ${item.name}
Brand: ${item.brand}
Price: ${item.price}
${item.size ? `Size: ${item.size}` : ''}
${item.color ? `Color: ${item.color}` : ''}

Please provide the shipping address for delivery.

Buyer Details:
Name: ${buyerName} ${buyerSurname}

Best regards,
${buyerName} ${buyerSurname}`
        );
      } else {
        body = encodeURIComponent(
          `Dear Mndeni & Nwabisa,

I would like to select the following gift from your wedding registry:

Item: ${item.name}
Brand: ${item.brand}
Price: ${item.price}
${item.size ? `Size: ${item.size}` : ''}
${item.color ? `Color: ${item.color}` : ''}

I will arrange the purchase myself.

Gift Giver Details:
Name: ${buyerName} ${buyerSurname}

Best regards,
${buyerName} ${buyerSurname}`
        );
      }
      
      const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
      window.location.href = mailtoLink;
      
      onPurchaseConfirm(item, buyerName, buyerSurname);
      setBuyerName('');
      setBuyerSurname('');
      setRequestDelivery(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:scale-105">
      <div className="mb-4 h-40 bg-gray-100 rounded-lg overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-contain"
        />
      </div>
      <h3 className="font-playfair text-lg font-bold text-brown mb-2">{item.name}</h3>
      <p className="text-sm text-brown/70 mb-1">{item.brand}</p>
      {item.size && <p className="text-sm text-brown/60 mb-1">Size: {item.size}</p>}
      {item.color && <p className="text-sm text-brown/60 mb-2">Color: {item.color}</p>}
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-xl text-brown">{item.price}</span>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
          Available
        </span>
      </div>
      
      <div className="space-y-2">
        <GiftSelectionDialog
          item={item}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          buyerName={buyerName}
          buyerSurname={buyerSurname}
          requestDelivery={requestDelivery}
          setBuyerName={setBuyerName}
          setBuyerSurname={setBuyerSurname}
          setRequestDelivery={setRequestDelivery}
          onGiftSelection={handleGiftSelection}
        >
          <Button 
            className="w-full bg-terracotta hover:bg-terracotta/90 text-white"
          >
            <Gift className="w-4 h-4 mr-2" />
            Select Gift
          </Button>
        </GiftSelectionDialog>
      </div>
    </div>
  );
};

export default ItemCard;
