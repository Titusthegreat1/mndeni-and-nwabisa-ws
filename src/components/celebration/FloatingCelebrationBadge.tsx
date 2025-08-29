import React, { useState } from 'react';
import { Calendar, Sparkles } from 'lucide-react';

interface FloatingCelebrationBadgeProps {
  daysLeft: number;
}

const FloatingCelebrationBadge: React.FC<FloatingCelebrationBadgeProps> = ({ daysLeft }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  
  if (daysLeft > 30) return null;

  const handleClick = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-scale-in">
      <div 
        className={`bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-full shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer ${
          isMinimized ? 'p-1' : 'p-2'
        }`}
        onClick={handleClick}
      >
        {isMinimized ? (
          <div className="w-3 h-3 rounded-full bg-white/20" />
        ) : (
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <div className="text-center">
              <div className="font-bold text-sm">{daysLeft}</div>
              <div className="text-xs opacity-90">DAYS</div>
            </div>
            <Sparkles className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingCelebrationBadge;