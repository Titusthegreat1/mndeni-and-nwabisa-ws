
import React, { useEffect, useState } from 'react';

const LoadingScreen = ({ onLoadingComplete }: { onLoadingComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(onLoadingComplete, 800);
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div 
      className={`fixed inset-0 bg-cream z-50 flex items-center justify-center transition-opacity duration-800 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        {/* Wedding Logo Animation */}
        <div className="mb-8 animate-scale-in">
          <div className="w-24 h-24 mx-auto mb-4 bg-terracotta rounded-full flex items-center justify-center animate-pulse">
            <span className="text-cream font-playfair text-2xl font-bold">M&N</span>
          </div>
        </div>

        {/* Names with staggered animation */}
        <div className="mb-8">
          <h1 className="font-playfair text-4xl font-bold text-brown mb-2 animate-fade-in-up delay-300">
            Mndeni & Nwabisa
          </h1>
          <p className="text-brown/70 animate-fade-in-up delay-500">
            27 September 2025
          </p>
        </div>

        {/* Traditional Pattern Loading Bar */}
        <div className="w-64 mx-auto">
          <div className="h-1 bg-sand rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-terracotta to-brown transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-brown/60 text-sm mt-2 animate-fade-in delay-700">
            Preparing your celebration...
          </p>
        </div>

        {/* Traditional Pattern Decoration */}
        <div className="mt-8 animate-fade-in delay-1000">
          <div className="ndebele-pattern h-8 w-32 mx-auto opacity-50 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
