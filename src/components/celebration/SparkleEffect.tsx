import React from 'react';

interface SparkleEffectProps {
  daysLeft: number;
}

const SparkleEffect: React.FC<SparkleEffectProps> = ({ daysLeft }) => {
  if (daysLeft > 30) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Sparkle animations */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400 rounded-full animate-ping opacity-70"></div>
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-rose-400 rounded-full animate-pulse opacity-80"></div>
      <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-orange-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-amber-300 rounded-full animate-pulse opacity-75" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-1/4 right-1/2 w-2 h-2 bg-rose-300 rounded-full animate-ping opacity-50" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Additional sparkles for mobile */}
      <div className="absolute top-1/5 left-1/5 w-1 h-1 bg-yellow-400 rounded-full animate-pulse opacity-60 md:hidden"></div>
      <div className="absolute bottom-1/5 right-1/5 w-1 h-1 bg-orange-300 rounded-full animate-ping opacity-70 md:hidden" style={{ animationDelay: '1.5s' }}></div>
    </div>
  );
};

export default SparkleEffect;