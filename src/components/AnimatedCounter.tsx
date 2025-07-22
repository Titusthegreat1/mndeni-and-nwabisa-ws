import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  label: string;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  target, 
  duration = 2000, 
  label, 
  className = '' 
}) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(target * easeOutCubic));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [target, duration]);

  return (
    <div className={`animated-counter ${className}`}>
      <div className="counter-number">{current}</div>
      <div className="counter-label">{label}</div>
    </div>
  );
};

export default AnimatedCounter;