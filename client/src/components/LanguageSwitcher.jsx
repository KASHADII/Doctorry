import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => changeLanguage('en')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              i18n.language === 'en'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => changeLanguage('hi')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              i18n.language === 'hi'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            हिं
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
