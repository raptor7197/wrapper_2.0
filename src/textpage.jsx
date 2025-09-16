import { createSignal, onMount, onCleanup } from 'solid-js';
import { getLanguageData, getSupportedLanguages } from './languages';
import { VoiceInputManager, speechLanguages, speakText } from './voiceInput';

const API_BASE_URL = 'http://localhost:3001/api';

const fetchGeminiResponse = async (prompt, customPrompt = '', language = 'hi') => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt: prompt,
        customPrompt: customPrompt,
        language: language
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
  
  // Voice input states
  const [isListening, setIsListening] = createSignal(false);
  const [voiceSupported, setVoiceSupported] = createSignal(false);
  const [interimText, setInterimText] = createSignal('');
  const [voiceError, setVoiceError] = createSignal(null);
  
  // Get current language data
  const langData = () => getLanguageData(currentLang());
  const [customPrompt, setCustomPrompt] = createSignal(langData().systemPrompt);
  
  // Voice input manager
  let voiceManager = null;

  // Initialize voice input
  onMount(() => {
    voiceManager = new VoiceInputManager();
    setVoiceSupported(voiceManager.isSupported());
    
    if (voiceManager.isSupported()) {
      voiceManager.onStart = () => {
        setIsListening(true);
        setVoiceError(null);
        setInterimText('');
      };
      
      voiceManager.onResult = (result) => {
        setInterimText(result.interim);
        if (result.final) {
          const currentInput = inputText();
          const newText = currentInput ? `${currentInput} ${result.final}` : result.final;
          setInputText(newText);
          setInterimText('');
        }
      };
      
      voiceManager.onError = (errorMsg) => {
        setVoiceError(errorMsg);
        setIsListening(false);
        setInterimText('');
      };
      
      voiceManager.onEnd = () => {
        setIsListening(false);
        setInterimText('');
      };
      
      // Set initial language
      voiceManager.setLanguage(currentLang());
    }
  });

  onCleanup(() => {
    if (voiceManager) {
      voiceManager.stopListening();
    }
  });

  // Update custom prompt when language changes
  const changeLanguage = (langCode) => {
    setCurrentLang(langCode);
    const newLangData = getLanguageData(langCode);
    setCustomPrompt(newLangData.systemPrompt);
    
    // Update voice recognition language
    if (voiceManager) {
      voiceManager.setLanguage(langCode);
    }
  };

  // Voice input controls
  const toggleVoiceInput = () => {
    if (!voiceManager || !voiceSupported()) {
      setVoiceError('आवाज़ पहचान समर्थित नहीं है / Voice recognition not supported');
      return;
    }

    if (isListening()) {
      voiceManager.stopListening();
    } else {
      voiceManager.startListening();
    }
  };

  const clearVoiceInput = () => {
    setInputText('');
    setInterimText('');
    setVoiceError(null);
    if (voiceManager && isListening()) {
      voiceManager.stopListening();
    }
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
      const response = await fetchGeminiResponse(prompt, customPrompt(), currentLang());
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
    clearVoiceInput();
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 min-h-screen w-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-6 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">🌾</div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{langData().ui.title}</h1>
                <p className="text-green-100 text-sm md:text-base">{langData().ui.subtitle}</p>
              </div>
              <div className="text-4xl">🚜</div>
            </div>
            
            {/* Language Selector */}
            <div className="relative">
              <select
                value={currentLang()}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-green-500 text-white border border-green-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 cursor-pointer"
              >
                {getSupportedLanguages().map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-white text-gray-800">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Quick Questions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-green-500">
          <h2 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
            <span className="text-2xl mr-2">💡</span>
            {langData().ui.commonQuestions}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {langData().questions.map((question, index) => (
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
              {langData().ui.askQuestion}
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-lg font-medium text-green-800 mb-3">
                {langData().ui.yourQuestion}
              </label>
              
              {/* Voice Input Controls */}
              {voiceSupported() && (
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isListening() 
                        ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    <span className="text-lg">
                      {isListening() ? '🔴' : '🎤'}
                    </span>
                    <span>
                      {isListening() 
                        ? `${langData().ui.stopListening || 'रोकें / Stop'}` 
                        : `${langData().ui.startVoice || 'आवाज़ से बोलें / Voice Input'}`
                      }
                    </span>
                  </button>
                  
                  {(inputText() || interimText()) && (
                    <button
                      type="button"
                      onClick={clearVoiceInput}
                      className="flex items-center space-x-1 px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium"
                    >
                      <span>🗑️</span>
                      <span>{langData().ui.clear}</span>
                    </button>
                  )}
                </div>
              )}

              {/* Voice Status Indicators */}
              {isListening() && (
                <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-700">
                    <div className="animate-pulse">🎤</div>
                    <span className="font-medium">
                      {langData().ui.listening || 'सुन रहे हैं... / Listening...'}
                    </span>
                  </div>
                  {interimText() && (
                    <div className="mt-2 text-gray-600 italic">
                      "{interimText()}"
                    </div>
                  )}
                </div>
              )}

              {voiceError() && (
                <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-yellow-700">
                    <span>⚠️</span>
                    <span className="text-sm">{voiceError()}</span>
                  </div>
                </div>
              )}

              <textarea
                value={inputText()}
                onInput={(e) => setInputText(e.target.value)}
                placeholder={langData().ui.placeholder}
                className="w-full p-4 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-lg"
                rows="4"
                required
              />
              
              {/* Voice input hint */}
              {voiceSupported() && !inputText() && (
                <div className="mt-2 text-sm text-green-600 flex items-center space-x-1">
                  <span>💡</span>
                  <span>
                    {langData().ui.voiceHint || 'माइक बटन दबाकर अपनी आवाज़ में सवाल पूछें / Press mic button to ask in your voice'}
                  </span>
                </div>
              )}
            </div>

            {/* Advanced Options Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowCustomPrompt(!showCustomPrompt())}
                className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
              >
                ⚙️ {langData().ui.advancedOptions}
                <span className="ml-1">{showCustomPrompt() ? '▼' : '▶'}</span>
              </button>
              
              {showCustomPrompt() && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    {langData().ui.customInstructions}
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
                    <span>{langData().ui.preparing}</span>
                  </>
                ) : (
                  <>
                    <span>🌱</span>
                    <span>{langData().ui.getAnswer}</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={clearAll}
                className="bg-green-500 text-white py-4 px-6 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <span>🔄</span>
                <span>{langData().ui.clear}</span>
              </button>
            </div>
          </form>

          {error() && (
            <div className="mx-6 mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
              <div className="flex items-center">
                <span className="text-xl mr-2">⚠️</span>
                <strong>{langData().ui.error}:</strong>
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
                    {langData().ui.advice}
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
                  <div className="font-medium">{langData().ui.pleaseWait}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-green-600 text-sm">
          <p>🌱 {langData().ui.footer}</p>
        </div>
      </div>
    </div>
  );
};

export default TextPage;
