import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import CountdownTimer from '../components/CountdownTimer';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Calendar, ExternalLink, Gift, Heart } from 'lucide-react';
import { registryItems } from '../components/registry/RegistryItems';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [contentLoaded, setContentLoaded] = useState({
    hero: false,
    location: false,
    schedule: false,
    photos: false,
    registry: false,
    celebration: false
  });

  useEffect(() => {
    // Loading sequence with progress
    const totalDuration = 3000;
    const progressInterval = totalDuration / 100;
    
    const progressTimer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, progressInterval);

    // Progressive loading with realistic delays
    const loadSection = (section: keyof typeof contentLoaded, delay: number) => {
      setTimeout(() => {
        setContentLoaded(prev => ({ ...prev, [section]: true }));
      }, delay + totalDuration);
    };

    loadSection('hero', 200);
    loadSection('location', 400);
    loadSection('schedule', 600);
    loadSection('photos', 800);
    loadSection('registry', 1000);
    loadSection('celebration', 1200);

    return () => clearInterval(progressTimer);
  }, []);

  const previewImages = [
    '/lovable-uploads/d0daea06-f034-4959-8fec-504591a3275e.png',
    '/lovable-uploads/e7ea9398-fb87-47e1-8391-e451b1810821.png',
    '/lovable-uploads/9b4c51f3-5e08-4d18-9aa6-fe689dcdb0f6.png',
    '/lovable-uploads/bc46896f-7af8-40b4-a567-9c720eeb5fb3.png'
  ];

  const getPurchasedItems = () => {
    const storedPurchasedItems = localStorage.getItem('purchasedRegistryItems');
    return storedPurchasedItems ? new Set(JSON.parse(storedPurchasedItems)) : new Set();
  };

  const getFeaturedItems = () => {
    const featuredIds = [118, 119, 120, 121, 122];
    return registryItems.filter(item => featuredIds.includes(item.id));
  };

  const purchasedItems = getPurchasedItems();
  const featuredRegistryItems = getFeaturedItems().filter(item => !purchasedItems.has(item.id));

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-cream via-sand to-terracotta flex items-center justify-center z-50">
        {/* Floating elements */}
        <div className="floating-hearts">
          {[...Array(8)].map((_, i) => (
            <Heart 
              key={`heart-${i}`}
              className={`floating-element heart-${i + 1} text-terracotta/30`}
              size={20 + Math.random() * 20}
            />
          ))}
        </div>
        
        <div className="floating-sparkles">
          {[...Array(12)].map((_, i) => (
            <div 
              key={`sparkle-${i}`}
              className={`floating-element sparkle-${i + 1} w-2 h-2 bg-brown/20 rounded-full`}
            />
          ))}
        </div>

        <div className="floating-petals">
          {[...Array(6)].map((_, i) => (
            <div 
              key={`petal-${i}`}
              className={`floating-element petal-${i + 1} w-4 h-4 bg-sand/40 rounded-full`}
            />
          ))}
        </div>

        {/* Loading content */}
        <div className="text-center relative z-10">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
              <div className="text-4xl font-playfair text-brown font-bold">M&N</div>
            </div>
            <h1 className="font-playfair text-4xl md:text-6xl font-bold text-brown mb-4 animate-fade-in-up">
              Mndeni & Nwabisa
            </h1>
            <p className="text-xl text-brown/80 mb-2 animate-fade-in-up delay-300">
              27 September 2025
            </p>
            <p className="text-lg text-brown/70 animate-fade-in-up delay-500">
              Preparing something beautiful...
            </p>
          </div>
          
          {/* Progress bar */}
          <div className="w-80 max-w-full mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-full h-2 overflow-hidden shadow-lg">
              <div 
                className="h-full bg-gradient-to-r from-terracotta to-brown transition-all duration-300 ease-out rounded-full"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="text-brown/60 text-sm mt-3 font-medium">
              {loadingProgress}% Complete
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden">
      {/* Persistent floating elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="persistent-floating">
          {[...Array(5)].map((_, i) => (
            <Heart 
              key={`persistent-heart-${i}`}
              className={`persistent-heart-${i + 1} text-terracotta/10`}
              size={16}
            />
          ))}
          {[...Array(8)].map((_, i) => (
            <div 
              key={`persistent-sparkle-${i}`}
              className={`persistent-sparkle-${i + 1} w-1 h-1 bg-brown/10 rounded-full`}
            />
          ))}
        </div>
      </div>
      
      <div className="relative z-10">
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
          {contentLoaded.hero ? (
            <div className="animate-fade-in">
              <h1 className="font-playfair text-6xl md:text-8xl font-bold mb-6">
                Mndeni & Nwabisa
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Join Us for Our Traditional Wedding Celebration
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8 text-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>27 September 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>Mtubatuba</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
          ) : (
            <div className="space-y-6">
              <Skeleton className="h-20 w-96 mx-auto bg-white/20" />
              <Skeleton className="h-8 w-80 mx-auto bg-white/20" />
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Skeleton className="h-6 w-40 mx-auto bg-white/20" />
                <Skeleton className="h-6 w-32 mx-auto bg-white/20" />
              </div>
              <div className="flex gap-4 justify-center">
                <Skeleton className="h-12 w-32 bg-white/20" />
                <Skeleton className="h-12 w-36 bg-white/20" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-sand">
        <div className="container mx-auto px-4 text-center">
          {contentLoaded.location ? (
            <div className="animate-scale-in">
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
          ) : (
            <div className="space-y-8">
              <Skeleton className="h-10 w-72 mx-auto bg-sand/60" />
              <Skeleton className="h-6 w-96 mx-auto bg-sand/60" />
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Skeleton className="h-12 w-80 bg-sand/60" />
                <Skeleton className="h-12 w-64 bg-sand/60" />
              </div>
              <Skeleton className="h-4 w-80 mx-auto bg-sand/60" />
            </div>
          )}
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {contentLoaded.schedule ? (
            <div className="grid md:grid-cols-2 gap-12 items-center animate-slide-in-right">
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
          ) : (
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <Skeleton className="h-10 w-64 bg-muted" />
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="w-3 h-3 rounded-full bg-muted" />
                      <Skeleton className="h-6 w-48 bg-muted" />
                    </div>
                  ))}
                </div>
              </div>
              <Skeleton className="h-48 w-full bg-muted rounded-lg" />
            </div>
          )}
        </div>
      </section>

      {/* Photo Preview Section */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          {contentLoaded.photos ? (
            <div className="animate-fade-in">
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
          ) : (
            <div className="space-y-12">
              <Skeleton className="h-10 w-80 mx-auto bg-sand/40" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="aspect-square bg-sand/40 rounded-lg" />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Registry Items Section */}
      <section className="py-16 bg-sand">
        <div className="container mx-auto px-4 text-center">
          {contentLoaded.registry ? (
            <div className="animate-scale-in">
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
          ) : (
            <div className="space-y-8">
              <Skeleton className="h-10 w-80 mx-auto bg-sand/60" />
              <Skeleton className="h-6 w-96 mx-auto bg-sand/60" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="bg-white rounded-lg p-3 space-y-2">
                    <Skeleton className="aspect-square bg-sand/40 rounded-lg" />
                    <Skeleton className="h-4 w-full bg-sand/40" />
                    <Skeleton className="h-3 w-16 bg-sand/40" />
                    <Skeleton className="h-4 w-12 bg-sand/40" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-12 w-48 mx-auto bg-sand/60" />
            </div>
          )}
        </div>
      </section>

      {/* Traditional Elements Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {contentLoaded.celebration ? (
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
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
          ) : (
            <div className="text-center max-w-3xl mx-auto space-y-8">
              <Skeleton className="h-10 w-96 mx-auto bg-muted" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-full bg-muted" />
                <Skeleton className="h-6 w-full bg-muted" />
                <Skeleton className="h-6 w-3/4 mx-auto bg-muted" />
              </div>
              <Skeleton className="h-16 w-full bg-muted rounded-lg" />
            </div>
          )}
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
    </div>
  );
};

export default Index;