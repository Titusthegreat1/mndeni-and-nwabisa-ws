
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RegistryItem } from './types';
import ItemDetails from './ItemDetails';
import BuyerForm from './BuyerForm';

interface GiftSelectionDialogProps {
  item: RegistryItem;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  buyerName: string;
  buyerSurname: string;
  buyerEmail: string;
  requestDelivery: boolean;
  isLoading: boolean;
  setBuyerName: (name: string) => void;
  setBuyerSurname: (surname: string) => void;
  setBuyerEmail: (email: string) => void;
  setRequestDelivery: (delivery: boolean) => void;
  onGiftSelection: () => void;
  children: React.ReactNode;
}

const GiftSelectionDialog: React.FC<GiftSelectionDialogProps> = ({
  item,
  isDialogOpen,
  setIsDialogOpen,
  buyerName,
  buyerSurname,
  buyerEmail,
  requestDelivery,
  isLoading,
  setBuyerName,
  setBuyerSurname,
  setBuyerEmail,
  setRequestDelivery,
  onGiftSelection,
  children
}) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Gift</DialogTitle>
          <DialogDescription>
            {item.websiteUrl 
              ? "Choose your delivery preference and we'll direct you to purchase this gift."
              : "Let Mndeni & Nwabisa know you'd like to give them this gift."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <ItemDetails item={item} />
          
          <BuyerForm
            buyerName={buyerName}
            buyerSurname={buyerSurname}
            buyerEmail={buyerEmail}
            requestDelivery={requestDelivery}
            setBuyerName={setBuyerName}
            setBuyerSurname={setBuyerSurname}
            setBuyerEmail={setBuyerEmail}
            setRequestDelivery={setRequestDelivery}
            showNameFields={true}
          />
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            className="bg-terracotta hover:bg-terracotta/90"
            disabled={isLoading || (!buyerName.trim() || !buyerSurname.trim())}
            onClick={onGiftSelection}
          >
            {isLoading ? 'Processing...' : (item.websiteUrl ? 'Proceed to Purchase' : 'Select Gift')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GiftSelectionDialog;
