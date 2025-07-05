
import React from 'react';

const AccommodationContact = () => {
  return (
    <div className="bg-white rounded-lg p-8 text-center shadow-lg">
      <h3 className="font-playfair text-2xl font-bold text-brown mb-4">
        Ready to Book Your Stay?
      </h3>
      <p className="text-brown/80 max-w-2xl mx-auto mb-6">
        For assistance with reservations and booking any of these accommodations, 
        please contact our helpful coordinators who will be happy to help you secure your perfect stay.
      </p>
      <div className="text-brown font-semibold mb-4">
        Booking Contacts:
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="text-brown">
          <p className="font-medium mb-2">For Beach & Coastal Venues:</p>
          <p>Amahle Makiwane: +27 72 064 4631</p>
        </div>
        <div className="text-brown">
          <p className="font-medium mb-2">For Inland & Lodge Venues:</p>
          <p>Sibabalwe Songca: +27 76 739 6163</p>
        </div>
      </div>
      <p className="text-brown/70 text-sm">
        Available to assist with reservations and booking inquiries.
      </p>
    </div>
  );
};

export default AccommodationContact;
