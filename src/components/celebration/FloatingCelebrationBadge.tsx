import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';

interface FloatingCelebrationBadgeProps {
  daysLeft: number;
}

const FloatingCelebrationBadge: React.FC<FloatingCelebrationBadgeProps> = ({ daysLeft }) => {
  if (daysLeft > 30) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-scale-in">
      <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform duration-300">
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <div className="text-center">
            <div className="font-bold text-sm">{daysLeft}</div>
            <div className="text-xs opacity-90">DAYS</div>
          </div>
          <Sparkles className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default FloatingCelebrationBadge;