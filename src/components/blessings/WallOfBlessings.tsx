import React, { useState, useRef, useEffect } from 'react';
import BlessingForm from './BlessingForm';
import BlessingWall from './BlessingWall';

const WallOfBlessings: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const wallRef = useRef<HTMLDivElement>(null);

  const handleBlessingSubmitted = () => {
    setRefreshTrigger(prev => prev + 1);
    
    // Scroll to the wall after a brief delay to allow for re-render
    setTimeout(() => {
      if (wallRef.current) {
        wallRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 500);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-rose-50/30 to-pink-50/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-rose-800 mb-4">
            Wall of Blessings
          </h2>
          <p className="text-rose-600 text-lg">
            Share your love and well wishes for the happy couple
          </p>
        </div>
        
        <div className="space-y-12">
          <BlessingForm onBlessingSubmitted={handleBlessingSubmitted} />
          
          <div ref={wallRef}>
            <BlessingWall refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WallOfBlessings;