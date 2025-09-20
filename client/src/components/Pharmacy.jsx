import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './Navbar';
import PharmacyMap from './PharmacyMap';

const Pharmacy = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Pharmacy Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find and order your medications from our trusted pharmacy partners in Nabha district, Punjab.
          </p>
        </div>
        
        <PharmacyMap />
      </div>
    </div>
  );
};

export default Pharmacy;
