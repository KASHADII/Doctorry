import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import translationService from '../services/translationService';

export const useGoogleTranslate = () => {
  const { i18n, t } = useTranslation();
  const [isGoogleTranslateEnabled, setIsGoogleTranslateEnabled] = useState(false);
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState(null);

  useEffect(() => {
    initializeGoogleTranslate();
  }, []);

  const initializeGoogleTranslate = async () => {
    try {
      const enabled = translationService.isConfigured();
      setIsGoogleTranslateEnabled(enabled);
      
      if (enabled) {
        const languages = await translationService.getSupportedLanguages();
        setSupportedLanguages(languages);
      } else {
        // Fallback to basic languages
        setSupportedLanguages([
          { code: 'en', name: 'English' },
          { code: 'hi', name: 'हिंदी' },
          { code: 'pa', name: 'ਪੰਜਾਬੀ' }
        ]);
      }
    } catch (error) {
      console.error('Failed to initialize Google Translate:', error);
      setTranslationError('Failed to initialize translation service');
    }
  };

  const translateToLanguage = async (targetLanguage) => {
    if (!targetLanguage) return;

    setIsTranslating(true);
    setTranslationError(null);

    try {
      // If it's a predefined language, use i18next
      if (['en', 'hi', 'pa'].includes(targetLanguage)) {
        await i18n.changeLanguage(targetLanguage);
        return;
      }

      // Check if we have cached translations
      const cachedTranslations = localStorage.getItem(`translations_${targetLanguage}`);
      if (cachedTranslations) {
        const translations = JSON.parse(cachedTranslations);
        i18n.addResourceBundle(targetLanguage, 'translation', translations);
        await i18n.changeLanguage(targetLanguage);
        return;
      }

      // Translate using Google Translate API
      if (!isGoogleTranslateEnabled) {
        throw new Error('Google Translate API not configured');
      }

      const currentTranslations = i18n.getResourceBundle(i18n.language, 'translation');
      const translatedTranslations = await translationService.translateObject(
        currentTranslations,
        targetLanguage,
        i18n.language
      );

      // Add to i18next and cache
      i18n.addResourceBundle(targetLanguage, 'translation', translatedTranslations);
      localStorage.setItem(`translations_${targetLanguage}`, JSON.stringify(translatedTranslations));
      
      await i18n.changeLanguage(targetLanguage);
    } catch (error) {
      console.error('Translation failed:', error);
      setTranslationError(error.message);
      // Fallback to English
      await i18n.changeLanguage('en');
    } finally {
      setIsTranslating(false);
    }
  };

  const detectLanguage = async (text) => {
    if (!text || !isGoogleTranslateEnabled) {
      return 'en';
    }

    try {
      return await translationService.detectLanguage(text);
    } catch (error) {
      console.error('Language detection failed:', error);
      return 'en';
    }
  };

  const translateText = async (text, targetLanguage, sourceLanguage = 'auto') => {
    if (!text || !targetLanguage) {
      return text;
    }

    try {
      return await translationService.translateText(text, targetLanguage, sourceLanguage);
    } catch (error) {
      console.error('Text translation failed:', error);
      return text;
    }
  };

  const clearTranslationCache = () => {
    translationService.clearCache();
    // Clear localStorage cache
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('translations_')) {
        localStorage.removeItem(key);
      }
    });
  };

  const getLanguageName = (code) => {
    return translationService.getLanguageName(code);
  };

  const getCurrentLanguageInfo = () => {
    const currentLang = supportedLanguages.find(lang => lang.code === i18n.language);
    return {
      code: i18n.language,
      name: currentLang ? currentLang.name : i18n.language.toUpperCase(),
      isGoogleTranslated: !['en', 'hi', 'pa'].includes(i18n.language)
    };
  };

  return {
    // State
    isGoogleTranslateEnabled,
    supportedLanguages,
    isTranslating,
    translationError,
    
    // Actions
    translateToLanguage,
    detectLanguage,
    translateText,
    clearTranslationCache,
    
    // Utilities
    getLanguageName,
    getCurrentLanguageInfo,
    
    // i18next integration
    t,
    i18n
  };
};

export default useGoogleTranslate;
