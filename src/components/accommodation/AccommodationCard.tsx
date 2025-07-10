
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

export interface AccommodationPlace {
  id: number;
  name: string;
  type: string;
  description: string;
  features: string[];
  image: string;
  website: string;
  contact: {
    name: string;
    phone: string;
    note: string;
  };
}

interface AccommodationCardProps {
  place: AccommodationPlace;
}

const AccommodationCard = ({ place }: AccommodationCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="lg:flex">
        {/* Image */}
        <div className="lg:w-1/3">
          <img 
            src={place.image} 
            alt={place.name}
            className="w-full h-64 lg:h-full object-cover"
          />
        </div>
        
        {/* Content */}
        <CardContent className="lg:w-2/3 p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-playfair text-2xl font-bold text-brown mb-1">
                {place.name}
              </h3>
              <p className="text-terracotta font-medium">{place.type}</p>
            </div>
          </div>

          <p className="text-brown/80 mb-6 leading-relaxed">
            {place.description}
          </p>

          {/* Features */}
          <div className="mb-6">
            <h4 className="font-semibold text-brown mb-3">Features:</h4>
            <div className="grid grid-cols-2 gap-2">
              {place.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-terracotta rounded-full"></div>
                  <span className="text-brown/80 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Contact Details */}
          <div className="mb-6 p-4 bg-cream/50 rounded-lg">
            <h4 className="font-semibold text-brown mb-2">Booking Contacts:</h4>
            <p className="text-brown/70 text-sm mb-3 italic">
              These contacts are to assist with family/friend group bookings.
            </p>
            <div className="space-y-2">
              <div>
                <p className="text-brown font-medium">Amahle Makiwane</p>
                <p className="text-brown/80 text-sm">+27 72 064 4631</p>
              </div>
              <div>
                <p className="text-brown font-medium">Sibabalwe Songca</p>
                <p className="text-brown/80 text-sm">+27 76 739 6163</p>
              </div>
            </div>
          </div>

          {/* Website Button */}
          <div className="border-t border-cream pt-4">
            <div className="flex justify-end">
              <Button 
                onClick={() => window.open(place.website, '_blank')}
                className="bg-terracotta hover:bg-terracotta/90 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View More
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default AccommodationCard;
