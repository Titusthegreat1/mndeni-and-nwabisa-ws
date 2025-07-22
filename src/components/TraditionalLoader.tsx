import React from 'react';

interface TraditionalLoaderProps {
  size?: number;
  className?: string;
}

const TraditionalLoader: React.FC<TraditionalLoaderProps> = ({ 
  size = 60, 
  className = '' 
}) => {
  return (
    <div className={`traditional-loader ${className}`} style={{ width: size, height: size }}>
      <div className="traditional-loader-inner">
        <div className="traditional-pattern-1"></div>
        <div className="traditional-pattern-2"></div>
        <div className="traditional-pattern-3"></div>
      </div>
    </div>
  );
};

export default TraditionalLoader;