
import React from 'react';
import { Gift, ChevronDown, ChevronUp } from 'lucide-react';

interface RegistryFiltersProps {
  showAllItems: boolean;
  onToggleShowAll: () => void;
}

const RegistryFilters: React.FC<RegistryFiltersProps> = ({ 
  showAllItems, 
  onToggleShowAll 
}) => {
  return (
    <div className="text-center mb-8">
      <button
        onClick={onToggleShowAll}
        className="inline-flex items-center gap-3 bg-terracotta hover:bg-terracotta/90 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
      >
        <Gift className="w-5 h-5" />
        <span>{showAllItems ? 'Show Less Items' : 'View All Registry Items'}</span>
        {showAllItems ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default RegistryFilters;
