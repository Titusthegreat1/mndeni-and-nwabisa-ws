
import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import CountdownTimer from '../components/CountdownTimer';
import { MapPin, Calendar, ExternalLink, Gift } from 'lucide-react';
import { registryItems } from '../components/registry/RegistryItems';

const Index = () => {
  const previewImages = [
    '/lovable-uploads/d0daea06-f034-4959-8fec-504591a3275e.png', // Couple dining with mountain view
    '/lovable-uploads/e7ea9398-fb87-47e1-8391-e451b1810821.png', // Casual selfie together
    '/lovable-uploads/9b4c51f3-5e08-4d18-9aa6-fe689dcdb0f6.png', // Art activity together
    '/lovable-uploads/bc46896f-7af8-40b4-a567-9c720eeb5fb3.png'  // Yellow shirts outdoor photo
  ];

  // Get purchased items from localStorage to filter out unavailable items
  const getPurchasedItems = () => {
    const storedPurchasedItems = localStorage.getItem('purchasedRegistryItems');
    return storedPurchasedItems ? new Set(JSON.parse(storedPurchasedItems)) : new Set();
  };

  // Get featured items with the new specified items
  const getFeaturedItems = () => {
    const featuredIds = [118, 119, 120, 121, 122]; // New featured items: Large Fragrance Diffuser, Serenity Fragrance Diffuser, Stainless Steel Casserole Pot, Striped Scalloped Napkins, Striped Cotton Napkins
    return registryItems.filter(item => featuredIds.includes(item.id));
  };

  // Filter out purchased items and get featured items
  const purchasedItems = getPurchasedItems();
  const featuredRegistryItems = getFeaturedItems().filter(item => !purchasedItems.has(item.id));

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-no-repeat bg-center"
          style={{
            backgroundImage: 'url(/lovable-uploads/b7524053-2a59-4e20-b6b4-0d4a86adb211.png)',
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Custom CSS for background positioning */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 768px) {
              .absolute.inset-0.bg-cover {
                background-position: calc(50% - 25%) center !important;
              }
            }
            @media (min-width: 769px) {
              .absolute.inset-0.bg-cover {
                background-position: calc(50% + 0%) calc(50% - 50%) !important;
              }
            }
          `
        }} />
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="font-playfair text-6xl md:text-8xl font-bold mb-6 animate-fade-in">
            Mndeni & Nwabisa
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in">
            Join Us for Our Traditional Wedding Celebration
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8 text-lg animate-fade-in">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>27 September 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Mtubatuba</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <Link 
              to="/rsvp" 
              className="bg-terracotta hover:bg-terracotta/90 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
            >
              RSVP Here
            </Link>
            <Link 
              to="/registry" 
              className="bg-brown hover:bg-brown/90 text-cream px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
            >
              View Registry
            </Link>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-sand">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-playfair text-4xl font-bold text-brown mb-6">
            Find Us at Mtubatuba
          </h2>
          <p className="text-lg text-brown/80 mb-8">
            Join us at this beautiful location for our special day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="https://maps.google.com/?q=-28.279469,32.148525"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-brown hover:bg-brown/90 text-cream px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <MapPin className="w-5 h-5" />
              <span>View Location on Google Maps</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <Link 
              to="/accommodation"
              className="inline-flex items-center gap-3 bg-cream hover:bg-cream/90 text-brown border-2 border-brown px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <span>View Accommodation Options</span>
            </Link>
          </div>
          <p className="text-brown/70 mt-6 text-sm">
            Need a place to stay? Check out our recommended accommodations in the area.
          </p>
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-playfair text-4xl font-bold text-brown mb-6">
                Schedule of the Day
              </h2>
              <div className="space-y-4 text-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-terracotta rounded-full"></div>
                  <span><strong>Isigcawu:</strong> 09:00 - 11:00</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-sand rounded-full"></div>
                  <span><strong>Umambo:</strong> 11:00 - 13:00</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-brown rounded-full"></div>
                  <span><strong>Reception:</strong> 13:00 - Late</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-terracotta rounded-full"></div>
                  <span><strong>Dress Code:</strong> Traditional attire</span>
                </div>
              </div>
            </div>
            <div>
              <CountdownTimer />
            </div>
          </div>
        </div>
      </section>

      {/* Photo Preview Section */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair text-4xl font-bold text-brown text-center mb-12">
            Our Love Story in Pictures
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {previewImages.map((img, index) => (
              <div 
                key={index} 
                className="aspect-square overflow-hidden rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <img 
                  src={img} 
                  alt={`Love story moment ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Registry Items Section */}
      <section className="py-16 bg-sand">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-playfair text-4xl font-bold text-brown mb-6">
            Featured Registry Items
          </h2>
          <p className="text-lg text-brown/80 mb-8">
            Help us start our new journey together with these special gifts
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {featuredRegistryItems.map((item, index) => {
              const isPurchased = purchasedItems.has(item.id);
              return (
                <Link 
                  key={index} 
                  to={`/registry?highlight=${item.id}`}
                  className={`bg-white rounded-lg p-3 shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer ${
                    isPurchased ? 'opacity-50 grayscale' : ''
                  }`}
                >
                  <div className="aspect-square mb-2 overflow-hidden rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xs font-semibold text-brown mb-1 line-clamp-2">{item.name}</h3>
                  <p className="text-xs text-brown/70 mb-1">{item.brand}</p>
                  <p className="text-sm font-bold text-terracotta">{item.price}</p>
                  {isPurchased && (
                    <p className="text-xs text-gray-500 mt-1">Selected</p>
                  )}
                </Link>
              );
            })}
          </div>
          <Link 
            to="/registry"
            className="inline-flex items-center gap-3 bg-brown hover:bg-brown/90 text-cream px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <Gift className="w-5 h-5" />
            <span>View Full Registry</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Traditional Elements Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-playfair text-4xl font-bold text-brown mb-6">
              A Celebration of Love and Unity
            </h2>
            <p className="text-lg text-brown/80 mb-8">
              Mndeni and Nwabisa invite you to witness their love story as it unfolds into forever. 
              Your presence will make their special day complete as they celebrate the beginning of 
              their journey together surrounded by family, friends, and cherished traditions. 
              They can't wait to share this joyous moment with you!
            </p>
            <div className="ndebele-pattern h-16 rounded-lg opacity-30"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brown text-cream py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="font-playfair text-2xl mb-2">Mndeni & Nwabisa</p>
          <p className="text-cream/80">27 September 2025 • Mtubatuba</p>
          <div className="geometric-divider bg-cream/30 mt-4"></div>
          <p className="text-sm text-cream/60 mt-4">Made with love for our special day</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
