
import React, { useState, useEffect } from 'react';
import { WEDDING_DATE, isWithinMilestone } from '@/utils/dateUtils';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [isMilestone, setIsMilestone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = WEDDING_DATE.getTime() - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        setTimeLeft({
          days,
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
        setIsMilestone(isWithinMilestone());
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsMilestone(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg transition-all duration-500 ${
      isMilestone ? 'ring-4 ring-amber-400 shadow-2xl shadow-amber-200/50' : ''
    }`}>
      <h3 className={`font-playfair text-2xl font-bold text-center mb-4 transition-colors duration-500 ${
        isMilestone ? 'text-amber-800' : 'text-brown'
      }`}>
        {isMilestone ? '✨ Until We Say "I Do" ✨' : 'Until We Say "I Do"'}
      </h3>
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className={`rounded-lg p-3 transition-all duration-500 ${
          isMilestone 
            ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-200/50' 
            : 'bg-terracotta text-white'
        }`}>
          <div className={`text-2xl font-bold ${isMilestone ? 'animate-pulse' : ''}`}>
            {timeLeft.days}
          </div>
          <div className="text-sm">Days</div>
        </div>
        <div className={`rounded-lg p-3 transition-all duration-500 ${
          isMilestone 
            ? 'bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-lg shadow-rose-200/50' 
            : 'bg-sand text-brown'
        }`}>
          <div className="text-2xl font-bold">{timeLeft.hours}</div>
          <div className="text-sm">Hours</div>
        </div>
        <div className={`rounded-lg p-3 transition-all duration-500 ${
          isMilestone 
            ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-lg shadow-orange-200/50' 
            : 'bg-brown text-cream'
        }`}>
          <div className="text-2xl font-bold">{timeLeft.minutes}</div>
          <div className="text-sm">Minutes</div>
        </div>
        <div className={`rounded-lg p-3 transition-all duration-500 ${
          isMilestone 
            ? 'bg-gradient-to-br from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-200/50' 
            : 'bg-terracotta text-white'
        }`}>
          <div className={`text-2xl font-bold ${isMilestone ? 'animate-pulse' : ''}`}>
            {timeLeft.seconds}
          </div>
          <div className="text-sm">Seconds</div>
        </div>
      </div>
      {isMilestone && (
        <div className="mt-4 text-center">
          <p className="text-amber-700 font-semibold text-sm animate-fade-in">
            🎊 The big day is almost here! 🎊
          </p>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
