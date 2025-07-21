
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import AccommodationCard from '../components/accommodation/AccommodationCard';
import AccommodationPagination from '../components/accommodation/AccommodationPagination';
import { accommodations } from '../components/accommodation/AccommodationData';

const Accommodation = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(accommodations.length / itemsPerPage);

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return accommodations.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16" id="accommodation-section">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-brown mb-4">
              Accommodation
            </h1>
            <p className="text-brown/80 text-lg max-w-2xl mx-auto mb-6">
              We've carefully selected these wonderful places for you to stay during our special celebration.
              Each offers unique charm and comfort for our guests.
            </p>
            {/* Deposit Notice */}
            <div className="bg-terracotta/10 border border-terracotta/20 rounded-lg p-4 max-w-3xl mx-auto">
              <p className="text-brown font-medium">
                <strong>Important:</strong> All places require a deposit as soon as possible to make reservations due to the limited time before our special day.
              </p>
            </div>
          </div>

          {/* Accommodations Grid - Current Page Items */}
          <div className="grid lg:grid-cols-1 gap-8 mb-8">
            {getCurrentPageItems().map((place) => (
              <AccommodationCard key={place.id} place={place} />
            ))}
          </div>

          {/* Pagination */}
          <AccommodationPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          {/* Contact Information Footer */}
          <div className="mt-12 text-center p-6 bg-brown/5 rounded-lg">
            <h3 className="font-playfair text-2xl font-bold text-brown mb-4">
              For More Information
            </h3>
            <div className="flex flex-col md:flex-row justify-center gap-8 mb-6">
              <div>
                <p className="text-brown font-medium">Amahle Makiwane</p>
                <p className="text-brown/80">+27 72 064 4631</p>
              </div>
              <div>
                <p className="text-brown font-medium">Sibabalwe Songca</p>
                <p className="text-brown/80">+27 76 739 6163</p>
              </div>
            </div>
            
            {/* Travel Notes */}
            <div className="border-t border-brown/20 pt-6">
              <h4 className="font-playfair text-lg font-semibold text-brown mb-3">
                Travel Times to Lindo's
              </h4>
              <div className="text-brown/80 space-y-1">
                <p>• Mtubatuba to Lindo's is about 35min</p>
                <p>• St Lucia to Lindo's is about 55min</p>
                <p>• Richard's bay to Lindo's is about 1hr 15min</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accommodation;
