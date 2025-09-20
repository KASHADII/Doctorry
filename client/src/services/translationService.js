// Translation Service using Google Translate API
class TranslationService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
    this.baseUrl = 'https://translation.googleapis.com/language/translate/v2';
    this.cache = new Map(); // Simple in-memory cache
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
  }

  // Check if API key is configured
  isConfigured() {
    return !!this.apiKey;
  }

  // Get supported languages
  async getSupportedLanguages() {
    const cacheKey = 'supported_languages';
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    if (!this.isConfigured()) {
      return this.getFallbackLanguages();
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/languages?key=${this.apiKey}&target=en`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch supported languages');
      }

      const data = await response.json();
      const languages = data.data.languages.map(lang => ({
        code: lang.language,
        name: lang.name
      }));

      this.setCache(cacheKey, languages);
      return languages;
    } catch (error) {
      console.error('Error fetching supported languages:', error);
      return this.getFallbackLanguages();
    }
  }

  // Translate text
  async translateText(text, targetLanguage, sourceLanguage = 'auto') {
    if (!text || !targetLanguage) {
      return text;
    }

    // Check cache first
    const cacheKey = `${text}_${sourceLanguage}_${targetLanguage}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    // If API is not configured, return original text
    if (!this.isConfigured()) {
      return text;
    }

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          source: sourceLanguage === 'auto' ? undefined : sourceLanguage,
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.data.translations[0].translatedText;
      
      // Cache the result
      this.setCache(cacheKey, translatedText);
      
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text on error
    }
  }

  // Translate object with nested keys
  async translateObject(obj, targetLanguage, sourceLanguage = 'en') {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    const translatedObj = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        translatedObj[key] = await this.translateText(value, targetLanguage, sourceLanguage);
      } else if (typeof value === 'object' && value !== null) {
        translatedObj[key] = await this.translateObject(value, targetLanguage, sourceLanguage);
      } else {
        translatedObj[key] = value;
      }
    }

    return translatedObj;
  }

  // Detect language of text
  async detectLanguage(text) {
    if (!text || !this.isConfigured()) {
      return 'en';
    }

    try {
      const response = await fetch(`${this.baseUrl}/detect?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text
        })
      });

      if (!response.ok) {
        throw new Error('Language detection failed');
      }

      const data = await response.json();
      return data.data.detections[0][0].language;
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en';
    }
  }

  // Cache management
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
  }

  // Fallback languages when API is not available
  getFallbackLanguages() {
    return [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'Hindi' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'it', name: 'Italian' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ar', name: 'Arabic' },
      { code: 'bn', name: 'Bengali' },
      { code: 'gu', name: 'Gujarati' },
      { code: 'kn', name: 'Kannada' },
      { code: 'ml', name: 'Malayalam' },
      { code: 'mr', name: 'Marathi' },
      { code: 'pa', name: 'Punjabi' },
      { code: 'ta', name: 'Tamil' },
      { code: 'te', name: 'Telugu' },
      { code: 'ur', name: 'Urdu' }
    ];
  }

  // Get language name by code
  getLanguageName(code) {
    const languages = this.getFallbackLanguages();
    const language = languages.find(lang => lang.code === code);
    return language ? language.name : code.toUpperCase();
  }
}

// Create singleton instance
const translationService = new TranslationService();

export default translationService;
