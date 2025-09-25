import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

interface Blessing {
  name: string | null;
  message: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [blessings, setBlessings] = useState<Blessing[]>([]);
  const [currentBlessingIndex, setCurrentBlessingIndex] = useState(0);
  const [showBlessing, setShowBlessing] = useState(true);

  // Fetch blessing messages
  useEffect(() => {
    const fetchBlessings = async () => {
      try {
        const { data } = await supabase
          .from('blessings')
          .select('name, message')
          .order('created_at', { ascending: false })
          .limit(6);
        
        if (data && data.length > 0) {
          setBlessings(data);
        }
      } catch (error) {
        console.error('Error fetching blessings:', error);
      }
    };

    fetchBlessings();
  }, []);

  // Rotate blessing messages every 2.5 seconds
  useEffect(() => {
    if (blessings.length <= 1) return;

    const rotationInterval = setInterval(() => {
      setShowBlessing(false);
      setTimeout(() => {
        setCurrentBlessingIndex(prev => (prev + 1) % blessings.length);
        setShowBlessing(true);
      }, 300); // Quick fade out before changing
    }, 2500);

    return () => clearInterval(rotationInterval);
  }, [blessings.length]);

  useEffect(() => {
    // Simulate loading progress - extended to 13 seconds
    const totalDuration = 13000; // 13 seconds total duration
    const intervalDelay = 150; // Slower progress updates
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            onLoadingComplete();
          }, 1000); // Extra time to read final message
          return 100;
        }
        return prev + (100 / (totalDuration / intervalDelay));
      });
    }, intervalDelay);

    // Show welcoming message after a short delay
    const messageTimeout = setTimeout(() => {
      setShowMessage(true);
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(messageTimeout);
    };
  }, [onLoadingComplete]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundImage: 'url(/lovable-uploads/b7524053-2a59-4e20-b6b4-0d4a86adb211.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 10%', // Moved up by 90% (from center 50% to 10%)
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-2xl mx-auto">
        {/* Heart icon with animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Heart 
              className="w-16 h-16 text-rose-400 animate-pulse" 
              fill="currentColor"
            />
            <div className="absolute inset-0 w-16 h-16 bg-rose-400/20 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Welcoming message */}
        <div className={`transition-all duration-1000 ${showMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Welcome to Our
            <span className="block text-rose-400">Wedding Website</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
            Thank you for being such an important part of our journey. Your presence in our lives means the world to us, and we're so grateful to have you celebrate this special moment with us.
          </p>

          {/* Rotating blessing messages or fallback */}
          <div className="min-h-[4rem] flex items-center justify-center">
            <div className={`transition-all duration-300 ${showBlessing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              {blessings.length > 0 ? (
                <div className="text-center">
                  <p className="text-base text-slate-300 italic mb-2 max-w-md mx-auto leading-relaxed">
                    "{blessings[currentBlessingIndex]?.message}"
                  </p>
                  <p className="text-sm text-rose-300 font-medium">
                    — {blessings[currentBlessingIndex]?.name || 'A loving friend'}
                  </p>
                </div>
              ) : (
                <p className="text-base text-slate-400 italic">
                  "Love is not just about finding the right person, but creating a right relationship with the people who matter most..."
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Loading progress */}
        <div className="mt-12">
          <div className="w-full bg-slate-700/50 rounded-full h-2 mb-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          
          <p className="text-slate-400 text-sm">
            Preparing our special day for you... {Math.round(Math.min(progress, 100))}%
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-8 -left-8 w-32 h-32 bg-rose-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-pink-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating hearts animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <Heart
            key={i}
            className="absolute w-4 h-4 text-rose-400/20 animate-pulse"
            fill="currentColor"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animation: `pulse 2s ease-in-out infinite`
            }}
          />
        ))}
      </div>

    </div>
  );
};

export default LoadingScreen;