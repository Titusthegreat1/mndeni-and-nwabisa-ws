
import React, { useEffect, useState } from 'react';

const LoadingScreen = ({ onLoadingComplete }: { onLoadingComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(onLoadingComplete, 800);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => {
      clearInterval(progressInterval);
    };
  }, [onLoadingComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-800 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-no-repeat bg-center"
        style={{
          backgroundImage: 'url(/lovable-uploads/b7524053-2a59-4e20-b6b4-0d4a86adb211.png)',
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Background positioning styles */}
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
      
      <div className="relative z-10 text-center max-w-md mx-auto px-4 text-white">
        {/* Couple's Initials with elegant animation */}
        <div className="mb-8 animate-scale-in">
          <div className="w-32 h-32 mx-auto mb-6 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white font-playfair text-4xl font-bold">M&N</span>
          </div>
        </div>

        {/* Heartwarming Message */}
        <div className="mb-8 animate-fade-in delay-300">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to Our Love Story
          </h1>
          <p className="text-white/90 text-lg leading-relaxed">
            We're so grateful you're here to celebrate this beautiful journey with us. 
            Your presence makes our special day complete.
          </p>
        </div>

        {/* Names and Date */}
        <div className="mb-8 animate-fade-in delay-500">
          <h2 className="font-playfair text-2xl font-semibold text-white mb-2">
            Mndeni & Nwabisa
          </h2>
          <p className="text-white/80">
            27 September 2025
          </p>
        </div>

        {/* Elegant Loading Bar */}
        <div className="w-72 mx-auto animate-fade-in delay-700">
          <div className="h-1 bg-white/20 rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-gradient-to-r from-white/70 to-white transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/70 text-sm font-light">
            Preparing your celebration experience...
          </p>
        </div>

        {/* Decorative Element */}
        <div className="mt-8 animate-fade-in delay-1000">
          <div className="w-16 h-0.5 bg-white/40 mx-auto rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
