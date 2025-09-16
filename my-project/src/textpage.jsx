import { createSignal } from 'solid-js';
import { getLanguageData, getSupportedLanguages } from './languages';

const API_BASE_URL = 'http://localhost:3001/api';

const fetchGeminiResponse = async (prompt, customPrompt = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt: prompt,
        customPrompt: customPrompt 
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error fetching Gemini response:', error);
    throw error;
  }
};

const TextPage = () => {
  const [currentLang, setCurrentLang] = createSignal('hi'); // Default to Hindi
  const [inputText, setInputText] = createSignal('');
  const [responseText, setResponseText] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal(null);
  const [showCustomPrompt, setShowCustomPrompt] = createSignal(false);
  
  // Get current language data
  const langData = () => getLanguageData(currentLang());
  const [customPrompt, setCustomPrompt] = createSignal(langData().systemPrompt);

  // Update custom prompt when language changes
  const changeLanguage = (langCode) => {
    setCurrentLang(langCode);
    const newLangData = getLanguageData(langCode);
    setCustomPrompt(newLangData.systemPrompt);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const prompt = inputText().trim();
    if (!prompt) {
      setError(langData().ui.enterQuestion);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponseText('');

    try {
      const response = await fetchGeminiResponse(prompt, customPrompt());
      setResponseText(response);
    } catch (err) {
      setError(err.message || langData().ui.somethingWrong);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setInputText('');
    setResponseText('');
    setError(null);
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 min-h-screen w-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-6 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-3">
            <div className="text-4xl">🌾</div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">कृषि सहायक / Farm Assistant</h1>
              <p className="text-green-100 text-sm md:text-base">किसानों के लिए AI सहायक • AI Assistant for Farmers</p>
            </div>
            <div className="text-4xl">🚜</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Quick Questions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-green-500">
          <h2 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
            <span className="text-2xl mr-2">💡</span>
            आम सवाल / Common Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInputText(question)}
                className="text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 hover:border-green-300 transition-all duration-200 text-sm md:text-base"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-200">
          <div className="bg-green-600 text-white p-4">
            <h3 className="font-semibold flex items-center text-lg">
              <span className="text-2xl mr-2">🤖</span>
              अपना सवाल पूछें / Ask Your Question
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-lg font-medium text-green-800 mb-3">
                आपका सवाल / Your Question
              </label>
              <textarea
                value={inputText()}
                onInput={(e) => setInputText(e.target.value)}
                placeholder="जैसे: मेरी टमाटर की फसल में पत्ते पीले हो रहे हैं, क्या करूं?
Example: My tomato crop leaves are turning yellow, what should I do?"
                className="w-full p-4 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-lg"
                rows="4"
                required
              />
            </div>

            {/* Advanced Options Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowCustomPrompt(!showCustomPrompt())}
                className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
              >
                ⚙️ उन्नत विकल्प / Advanced Options
                <span className="ml-1">{showCustomPrompt() ? '▼' : '▶'}</span>
              </button>
              
              {showCustomPrompt() && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    कस्टम निर्देश / Custom Instructions
                  </label>
                  <textarea
                    value={customPrompt()}
                    onInput={(e) => setCustomPrompt(e.target.value)}
                    className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-sm"
                    rows="3"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isLoading()}
                className="flex-1 bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors font-medium text-lg flex items-center justify-center space-x-2"
              >
                {isLoading() ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>जवाब तैयार कर रहे हैं...</span>
                  </>
                ) : (
                  <>
                    <span>🌱</span>
                    <span>जवाब पाएं / Get Answer</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={clearAll}
                className="bg-green-500 text-white py-4 px-6 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <span>🔄</span>
                <span>साफ़ करें / Clear</span>
              </button>
            </div>
          </form>

          {error() && (
            <div className="mx-6 mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
              <div className="flex items-center">
                <span className="text-xl mr-2">⚠️</span>
                <strong>समस्या / Error:</strong>
              </div>
              <p className="mt-1">{error()}</p>
            </div>
          )}

          {responseText() && (
            <div className="mx-6 mb-6">
              <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg overflow-hidden">
                <div className="bg-green-600 text-white p-3">
                  <h3 className="font-semibold flex items-center">
                    <span className="text-xl mr-2">🌾</span>
                    कृषि सलाह / Agricultural Advice
                  </h3>
                </div>
                <div className="p-4">
                  <pre className="whitespace-pre-wrap text-green-900 leading-relaxed font-sans text-base">
                    {responseText()}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {isLoading() && (
            <div className="mx-6 mb-6 p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-center space-x-3 text-green-600">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <div className="text-center">
                  <div className="font-medium">कृपया प्रतीक्षा करें...</div>
                  <div className="text-sm">Please wait while we prepare your answer</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-green-600 text-sm">
          <p>🌱 Made with ❤️ for Indian Farmers • भारतीय किसानों के लिए बनाया गया</p>
        </div>
      </div>
    </div>
  );
};

export default TextPage;
