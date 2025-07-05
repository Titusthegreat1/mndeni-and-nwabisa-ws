
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
            <p className="text-brown/80 text-lg max-w-2xl mx-auto">
              We've carefully selected these wonderful places for you to stay during our special celebration.
              Each offers unique charm and comfort for our guests.
            </p>
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
            <div className="flex flex-col md:flex-row justify-center gap-8">
              <div>
                <p className="text-brown font-medium">Amahle Makiwane</p>
                <p className="text-brown/80">+27 72 064 4631</p>
                <p className="text-brown/60 text-sm">Beach & Coastal Venues</p>
              </div>
              <div>
                <p className="text-brown font-medium">Sibabalwe Songca</p>
                <p className="text-brown/80">+27 76 739 6163</p>
                <p className="text-brown/60 text-sm">Inland & Lodge Venues</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accommodation;
