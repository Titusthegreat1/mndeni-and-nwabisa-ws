import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface MilestoneBannerProps {
  daysLeft: number;
}

const MilestoneBanner: React.FC<MilestoneBannerProps> = ({ daysLeft }) => {
  if (daysLeft > 30) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b-2 border-amber-200 animate-fade-in">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center space-x-2 text-amber-800">
          <Sparkles className="w-5 h-5 animate-pulse text-amber-600" />
          <span className="font-semibold text-lg">
            🎉 Only {daysLeft} days until the big day! 
          </span>
          <Heart className="w-5 h-5 animate-pulse text-rose-500" />
        </div>
        <p className="text-center text-amber-700 text-sm mt-1">
          The countdown to forever has begun! ✨
        </p>
      </div>
    </div>
  );
};

export default MilestoneBanner;