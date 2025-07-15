
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface BuyerFormProps {
  buyerName: string;
  buyerSurname: string;
  buyerEmail: string;
  requestDelivery: boolean;
  setBuyerName: (name: string) => void;
  setBuyerSurname: (surname: string) => void;
  setBuyerEmail: (email: string) => void;
  setRequestDelivery: (delivery: boolean) => void;
  showNameFields: boolean;
}

const BuyerForm: React.FC<BuyerFormProps> = ({
  buyerName,
  buyerSurname,
  buyerEmail,
  requestDelivery,
  setBuyerName,
  setBuyerSurname,
  setBuyerEmail,
  setRequestDelivery,
  showNameFields
}) => {
  return (
    <div className="space-y-4">
      {showNameFields && (
        <>
          <div>
            <Label htmlFor="buyerName" className="text-brown font-semibold">
              Your Name *
            </Label>
            <Input
              id="buyerName"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className="mt-1 border-sand focus:border-terracotta"
              placeholder="Enter your first name"
            />
          </div>
          
          <div>
            <Label htmlFor="buyerSurname" className="text-brown font-semibold">
              Your Surname *
            </Label>
            <Input
              id="buyerSurname"
              value={buyerSurname}
              onChange={(e) => setBuyerSurname(e.target.value)}
              className="mt-1 border-sand focus:border-terracotta"
              placeholder="Enter your surname"
            />
          </div>
          
          <div>
            <Label htmlFor="buyerEmail" className="text-brown font-semibold">
              Your Email (Optional)
            </Label>
            <Input
              id="buyerEmail"
              type="email"
              value={buyerEmail}
              onChange={(e) => setBuyerEmail(e.target.value)}
              className="mt-1 border-sand focus:border-terracotta"
              placeholder="Enter your email for confirmation"
            />
            <p className="text-xs text-brown/60 mt-1">
              If provided, you'll receive a confirmation email with purchase instructions
            </p>
          </div>
        </>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="requestDelivery" 
          checked={requestDelivery}
          onCheckedChange={(checked) => setRequestDelivery(checked === true)}
        />
        <Label htmlFor="requestDelivery" className="text-brown text-sm">
          I would like delivery assistance from Dimpho Parkies or Zama Kunene
        </Label>
      </div>
    </div>
  );
};

export default BuyerForm;
