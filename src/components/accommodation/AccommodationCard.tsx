
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
  distance?: string;
  fullyBooked?: boolean;
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
  const handleViewMore = () => {
    if (place.fullyBooked) {
      alert("This accommodation is fully booked and no longer available for reservations.");
      return;
    }
    window.open(place.website, '_blank');
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 ${
      place.fullyBooked 
        ? 'opacity-50 grayscale hover:shadow-md' 
        : 'hover:shadow-xl'
    }`}>
      <div className="lg:flex">
        {/* Image */}
        <div className="lg:w-1/3 relative">
          <img 
            src={place.image} 
            alt={place.name}
            className="w-full h-64 lg:h-full object-cover"
          />
          {place.fullyBooked && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
                FULLY BOOKED
              </span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <CardContent className="lg:w-2/3 p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className={`font-playfair text-2xl font-bold mb-1 ${
                place.fullyBooked ? 'text-brown/60' : 'text-brown'
              }`}>
                {place.name}
              </h3>
              {place.distance && (
                <p className={`text-sm font-medium mb-1 ${
                  place.fullyBooked ? 'text-brown/50' : 'text-brown/70'
                }`}>
                  {place.distance}
                </p>
              )}
              <p className={`font-medium ${
                place.fullyBooked ? 'text-terracotta/60' : 'text-terracotta'
              }`}>{place.type}</p>
              {place.fullyBooked && (
                <p className="text-red-600 font-semibold text-sm mt-1">
                  No longer available
                </p>
              )}
            </div>
          </div>

          <p className={`mb-6 leading-relaxed ${
            place.fullyBooked ? 'text-brown/50' : 'text-brown/80'
          }`}>
            {place.description}
          </p>

          {/* Features */}
          <div className="mb-6">
            <h4 className={`font-semibold mb-3 ${
              place.fullyBooked ? 'text-brown/60' : 'text-brown'
            }`}>Features:</h4>
            <div className="grid grid-cols-2 gap-2">
              {place.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    place.fullyBooked ? 'bg-terracotta/60' : 'bg-terracotta'
                  }`}></div>
                  <span className={`text-sm ${
                    place.fullyBooked ? 'text-brown/50' : 'text-brown/80'
                  }`}>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Contact Details */}
          <div className={`mb-6 p-4 rounded-lg ${
            place.fullyBooked ? 'bg-cream/30' : 'bg-cream/50'
          }`}>
            <h4 className={`font-semibold mb-2 ${
              place.fullyBooked ? 'text-brown/60' : 'text-brown'
            }`}>
              {place.fullyBooked ? 'Booking Status:' : 'Booking Contacts:'}
            </h4>
            {place.fullyBooked ? (
              <p className="text-red-600 font-medium text-sm">
                This accommodation is fully booked and no longer accepting reservations.
              </p>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Website Button */}
          <div className="border-t border-cream pt-4">
            <div className="flex justify-end">
              <Button 
                onClick={handleViewMore}
                className={`text-white ${
                  place.fullyBooked 
                    ? 'bg-gray-400 hover:bg-gray-500 cursor-pointer' 
                    : 'bg-terracotta hover:bg-terracotta/90'
                }`}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {place.fullyBooked ? 'Fully Booked' : 'View More'}
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default AccommodationCard;
