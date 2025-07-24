
import React, { useEffect, useState } from 'react';

const LoadingScreen = ({ onLoadingComplete }: { onLoadingComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  
  // Wedding date
  const weddingDate = new Date('2025-09-27T00:00:00');
  
  // Calculate countdown
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const difference = weddingDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

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
        return prev + 3;
      });
    }, 40);

    return () => {
      clearInterval(progressInterval);
      clearInterval(countdownInterval);
    };
  }, [onLoadingComplete]);

  return (
    <div 
      className={`fixed inset-0 bg-cream z-50 flex items-center justify-center transition-opacity duration-800 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center max-w-md mx-auto px-4">
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

        {/* Wedding Countdown */}
        <div className="mb-8 animate-fade-in-up delay-700">
          <p className="text-brown/60 text-sm mb-4">Counting down to our special day</p>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-white/80 rounded-lg p-3 shadow-sm">
              <div className="text-2xl font-bold text-terracotta font-playfair">{timeLeft.days}</div>
              <div className="text-xs text-brown/60 uppercase tracking-wide">Days</div>
            </div>
            <div className="bg-white/80 rounded-lg p-3 shadow-sm">
              <div className="text-2xl font-bold text-terracotta font-playfair">{timeLeft.hours}</div>
              <div className="text-xs text-brown/60 uppercase tracking-wide">Hours</div>
            </div>
            <div className="bg-white/80 rounded-lg p-3 shadow-sm">
              <div className="text-2xl font-bold text-terracotta font-playfair">{timeLeft.minutes}</div>
              <div className="text-xs text-brown/60 uppercase tracking-wide">Min</div>
            </div>
            <div className="bg-white/80 rounded-lg p-3 shadow-sm">
              <div className="text-2xl font-bold text-terracotta font-playfair">{timeLeft.seconds}</div>
              <div className="text-xs text-brown/60 uppercase tracking-wide">Sec</div>
            </div>
          </div>
        </div>

        {/* Traditional Pattern Loading Bar */}
        <div className="w-64 mx-auto animate-fade-in-up delay-1000">
          <div className="h-2 bg-sand rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-gradient-to-r from-terracotta to-brown transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-brown/60 text-sm">
            Preparing your celebration... {progress}%
          </p>
        </div>

        {/* Traditional Pattern Decoration */}
        <div className="mt-8 animate-fade-in delay-1000">
          <div className="ndebele-pattern h-6 w-24 mx-auto opacity-50 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
