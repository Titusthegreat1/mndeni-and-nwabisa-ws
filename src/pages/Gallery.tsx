
import React, { useState } from 'react';
import Navigation from '../components/Navigation';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryImages = {
    engagement: [
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
    ],
    preparation: [
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1594736797933-d0b22ce41bb4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=800&q=80',
    ],
    venue: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80',
    ]
  };

  const openLightbox = (image: string) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-5xl font-bold text-brown mb-4">
            Gallery
          </h1>
          <p className="text-lg text-brown/80">
            Capturing the beautiful moments of our journey together
          </p>
          <div className="geometric-divider w-24 mx-auto mt-6"></div>
        </div>

        {/* Engagement Photos */}
        <section className="mb-16">
          <h2 className="font-playfair text-3xl font-bold text-brown mb-8 text-center">
            Engagement Photos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.engagement.map((image, index) => (
              <div 
                key={index}
                className="aspect-square overflow-hidden rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => openLightbox(image)}
              >
                <img 
                  src={image} 
                  alt={`Engagement photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Traditional Ceremony Prep */}
        <section className="mb-16">
          <h2 className="font-playfair text-3xl font-bold text-brown mb-8 text-center">
            Traditional Ceremony Preparation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryImages.preparation.map((image, index) => (
              <div 
                key={index}
                className="aspect-square overflow-hidden rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => openLightbox(image)}
              >
                <img 
                  src={image} 
                  alt={`Preparation photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Venue Scenes */}
        <section className="mb-16">
          <h2 className="font-playfair text-3xl font-bold text-brown mb-8 text-center">
            Venue Scenes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {galleryImages.venue.map((image, index) => (
              <div 
                key={index}
                className="aspect-video overflow-hidden rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => openLightbox(image)}
              >
                <img 
                  src={image} 
                  alt={`Venue photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Lightbox */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <div className="relative max-w-4xl max-h-full">
              <img 
                src={selectedImage} 
                alt="Selected photo"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button 
                onClick={closeLightbox}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
