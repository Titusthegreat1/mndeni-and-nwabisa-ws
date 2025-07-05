
import React from 'react';

const PurchaseInfo = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
      <h3 className="font-playfair text-2xl font-bold text-brown mb-4">
        How to Purchase
      </h3>
      <p className="text-brown/80 mb-6 max-w-2xl mx-auto">
        For more information contact Dimpho at{' '}
        <a href="mailto:dimphoparkies@gmail.com" className="text-terracotta hover:underline">
          dimphoparkies@gmail.com
        </a>
      </p>
    </div>
  );
};

export default PurchaseInfo;
