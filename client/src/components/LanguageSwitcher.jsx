import React, { useState, useEffect } from 'react';
import { useGoogleTranslate } from '../hooks/useGoogleTranslate';

const LanguageSwitcher = () => {
  const {
    isGoogleTranslateEnabled,
    supportedLanguages,
    isTranslating,
    translationError,
    translateToLanguage,
    getCurrentLanguageInfo,
    i18n
  } = useGoogleTranslate();
  
  const [showDropdown, setShowDropdown] = useState(false);

  const getLanguageFlag = (code) => {
    const flags = {
      'en': '🇺🇸',
      'hi': '🇮🇳',
      'es': '🇪🇸',
      'fr': '🇫🇷',
      'de': '🇩🇪',
      'it': '🇮🇹',
      'pt': '🇵🇹',
      'ru': '🇷🇺',
      'ja': '🇯🇵',
      'ko': '🇰🇷',
      'zh': '🇨🇳',
      'ar': '🇸🇦',
      'bn': '🇧🇩',
      'gu': '🇮🇳',
      'kn': '🇮🇳',
      'ml': '🇮🇳',
      'mr': '🇮🇳',
      'pa': '🇮🇳',
      'ta': '🇮🇳',
      'te': '🇮🇳',
      'ur': '🇵🇰'
    };
    return flags[code] || '🌐';
  };

  const handleLanguageChange = async (languageCode) => {
    setShowDropdown(false);
    await translateToLanguage(languageCode);
  };

  const currentLanguageInfo = getCurrentLanguageInfo();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            disabled={isTranslating}
            className={`flex items-center space-x-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
              isTranslating
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isTranslating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Translating...</span>
              </>
            ) : (
              <>
                <span>{getLanguageFlag(i18n.language)}</span>
                <span>{currentLanguageInfo.name}</span>
                {currentLanguageInfo.isGoogleTranslated && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded">GT</span>
                )}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>

          {showDropdown && !isTranslating && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs text-gray-500 mb-2 px-2">
                  {isGoogleTranslateEnabled ? 'Powered by Google Translate' : 'Basic Languages'}
                </div>
                
                {translationError && (
                  <div className="text-xs text-red-600 px-2 py-1 mb-2 bg-red-50 rounded">
                    Error: {translationError}
                  </div>
                )}
                
                {/* Predefined Languages */}
                <div className="mb-2">
                  <div className="text-xs font-semibold text-gray-700 px-2 py-1">Predefined</div>
                  {['en', 'hi'].map((lang) => {
                    const language = supportedLanguages.find(l => l.code === lang);
                    if (!language) return null;
                    
                    return (
                      <button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={`w-full flex items-center space-x-2 px-2 py-2 text-sm rounded hover:bg-gray-100 ${
                          i18n.language === lang ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        <span>{getLanguageFlag(lang)}</span>
                        <span>{language.name}</span>
                        {i18n.language === lang && (
                          <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Google Translate Languages */}
                {isGoogleTranslateEnabled && (
                  <div>
                    <div className="text-xs font-semibold text-gray-700 px-2 py-1">More Languages</div>
                    {supportedLanguages
                      .filter(lang => !['en', 'hi'].includes(lang.code))
                      .slice(0, 20) // Limit to first 20 for better UX
                      .map((language) => (
                        <button
                          key={language.code}
                          onClick={() => handleLanguageChange(language.code)}
                          className={`w-full flex items-center space-x-2 px-2 py-2 text-sm rounded hover:bg-gray-100 ${
                            i18n.language === language.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                          }`}
                        >
                          <span>{getLanguageFlag(language.code)}</span>
                          <span>{language.name}</span>
                          {i18n.language === language.code && (
                            <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                  </div>
                )}

                {!isGoogleTranslateEnabled && (
                  <div className="text-xs text-gray-500 px-2 py-2 border-t mt-2">
                    <div className="mb-1">💡 Enable Google Translate API for more languages</div>
                    <div className="text-xs">Add VITE_GOOGLE_TRANSLATE_API_KEY to your .env file</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
