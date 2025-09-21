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
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isTranslating}
        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
          isTranslating
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md'
        }`}
        style={{
          color: isTranslating ? 'var(--color-gray-500)' : 'var(--color-gray-700)',
          backgroundColor: isTranslating ? 'var(--color-gray-100)' : 'var(--color-white)',
          borderColor: isTranslating ? 'var(--color-gray-300)' : 'var(--color-gray-300)'
        }}
        onMouseEnter={(e) => {
          if (!isTranslating) {
            e.target.style.backgroundColor = 'var(--color-gray-50)';
            e.target.style.borderColor = 'var(--color-primary)';
            e.target.style.color = 'var(--color-primary)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isTranslating) {
            e.target.style.backgroundColor = 'var(--color-white)';
            e.target.style.borderColor = 'var(--color-gray-300)';
            e.target.style.color = 'var(--color-gray-700)';
          }
        }}
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
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 max-h-80 overflow-y-auto z-50" style={{
              backgroundColor: 'var(--color-white)',
              borderColor: 'var(--color-gray-200)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
              <div className="p-3">
                <div className="text-xs text-gray-500 mb-3 px-2 font-medium" style={{color: 'var(--color-gray-500)'}}>
                  {isGoogleTranslateEnabled ? 'Powered by Google Translate' : 'Basic Languages'}
                </div>
                
                {translationError && (
                  <div className="text-xs text-red-600 px-3 py-2 mb-3 bg-red-50 rounded-lg" style={{
                    color: 'var(--color-red-600)',
                    backgroundColor: 'var(--color-red-50)'
                  }}>
                    Error: {translationError}
                  </div>
                )}
                
                {/* Predefined Languages */}
                <div className="mb-3">
                  <div className="text-xs font-semibold text-gray-700 px-2 py-2 mb-2" style={{color: 'var(--color-gray-700)'}}>Predefined</div>
                  {['en', 'hi', 'pa'].map((lang) => {
                    const language = supportedLanguages.find(l => l.code === lang);
                    if (!language) return null;
                    
                    return (
                      <button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-50 transition-all duration-200 ${
                          i18n.language === lang ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                        style={{
                          backgroundColor: i18n.language === lang ? 'var(--color-blue-50)' : 'transparent',
                          color: i18n.language === lang ? 'var(--color-primary)' : 'var(--color-gray-700)'
                        }}
                        onMouseEnter={(e) => {
                          if (i18n.language !== lang) {
                            e.target.style.backgroundColor = 'var(--color-gray-50)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (i18n.language !== lang) {
                            e.target.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <span className="text-lg">{getLanguageFlag(lang)}</span>
                        <span className="flex-1 text-left">{language.name}</span>
                        {i18n.language === lang && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{color: 'var(--color-primary)'}}>
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
                    <div className="text-xs font-semibold text-gray-700 px-2 py-2 mb-2" style={{color: 'var(--color-gray-700)'}}>More Languages</div>
                    {supportedLanguages
                      .filter(lang => !['en', 'hi', 'pa'].includes(lang.code))
                      .slice(0, 20) // Limit to first 20 for better UX
                      .map((language) => (
                        <button
                          key={language.code}
                          onClick={() => handleLanguageChange(language.code)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-50 transition-all duration-200 ${
                            i18n.language === language.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                          }`}
                          style={{
                            backgroundColor: i18n.language === language.code ? 'var(--color-blue-50)' : 'transparent',
                            color: i18n.language === language.code ? 'var(--color-primary)' : 'var(--color-gray-700)'
                          }}
                          onMouseEnter={(e) => {
                            if (i18n.language !== language.code) {
                              e.target.style.backgroundColor = 'var(--color-gray-50)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (i18n.language !== language.code) {
                              e.target.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          <span className="text-lg">{getLanguageFlag(language.code)}</span>
                          <span className="flex-1 text-left">{language.name}</span>
                          {i18n.language === language.code && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{color: 'var(--color-primary)'}}>
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                  </div>
                )}

                {!isGoogleTranslateEnabled && (
                  <div className="text-xs text-gray-500 px-3 py-3 border-t mt-3 rounded-lg bg-gray-50" style={{
                    color: 'var(--color-gray-500)',
                    backgroundColor: 'var(--color-gray-50)',
                    borderTopColor: 'var(--color-gray-200)'
                  }}>
                    <div className="mb-2 font-medium">💡 Enable Google Translate API for more languages</div>
                    <div className="text-xs">Add VITE_GOOGLE_TRANSLATE_API_KEY to your .env file</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
  );
};

export default LanguageSwitcher;
