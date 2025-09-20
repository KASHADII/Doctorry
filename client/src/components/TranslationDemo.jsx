import React, { useState } from 'react';
import { useGoogleTranslate } from '../hooks/useGoogleTranslate';

const TranslationDemo = () => {
  const { translateText, detectLanguage, isGoogleTranslateEnabled } = useGoogleTranslate();
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    try {
      const translated = await translateText(inputText, targetLanguage);
      setTranslatedText(translated);
    } catch (error) {
      console.error('Translation failed:', error);
      setTranslatedText('Translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleDetectLanguage = async () => {
    if (!inputText.trim()) return;
    
    try {
      const detected = await detectLanguage(inputText);
      setDetectedLanguage(detected);
    } catch (error) {
      console.error('Detection failed:', error);
      setDetectedLanguage('Detection failed');
    }
  };

  const sampleTexts = [
    "Hello, how are you today?",
    "I need to book an appointment with a doctor",
    "What are your symptoms?",
    "Thank you for your help",
    "The appointment is scheduled for tomorrow"
  ];

  const languages = [
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Google Translate API Demo</h2>
        <div className={`text-sm px-3 py-2 rounded ${
          isGoogleTranslateEnabled 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {isGoogleTranslateEnabled 
            ? '✅ Google Translate API is enabled' 
            : '⚠️ Google Translate API not configured - using fallback'
          }
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter text to translate:
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your text here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Language:
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleTranslate}
              disabled={!inputText.trim() || isTranslating}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTranslating ? 'Translating...' : 'Translate'}
            </button>
            <button
              onClick={handleDetectLanguage}
              disabled={!inputText.trim()}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Detect Language
            </button>
          </div>

          {detectedLanguage && (
            <div className="p-3 bg-blue-50 rounded-md">
              <div className="text-sm text-blue-800">
                <strong>Detected Language:</strong> {detectedLanguage}
              </div>
            </div>
          )}
        </div>

        {/* Output Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Translation Result:
          </label>
          <div className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
            {translatedText || 'Translation will appear here...'}
          </div>
        </div>
      </div>

      {/* Sample Texts */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Try these sample texts:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {sampleTexts.map((text, index) => (
            <button
              key={index}
              onClick={() => setInputText(text)}
              className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md text-sm transition-colors"
            >
              "{text}"
            </button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">How to enable Google Translate API:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Get a Google Cloud API key from <a href="https://console.cloud.google.com/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
          <li>Enable the Cloud Translation API</li>
          <li>Add your API key to <code className="bg-gray-200 px-1 rounded">.env.local</code> file</li>
          <li>Restart your development server</li>
        </ol>
      </div>
    </div>
  );
};

export default TranslationDemo;
