// Voice Input Utility for Multilingual Farm Assistant

export const speechLanguages = {
  en: 'en-US',
  hi: 'hi-IN', 
  pa: 'pa-IN',
  te: 'te-IN',
  ta: 'ta-IN'
};

export class VoiceInputManager {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.currentLanguage = 'hi-IN';
    this.onResult = null;
    this.onError = null;
    this.onStart = null;
    this.onEnd = null;
    
    this.initializeRecognition();
  }

  initializeRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    // Configure recognition settings
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
    this.recognition.lang = this.currentLanguage;

    // Set up event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStart) this.onStart();
    };

    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (this.onResult) {
        this.onResult({
          final: finalTranscript,
          interim: interimTranscript,
          confidence: event.results[event.results.length - 1][0].confidence
        });
      }
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (this.onError) {
        this.onError(this.getErrorMessage(event.error));
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEnd) this.onEnd();
    };

    return true;
  }

  isSupported() {
    return this.recognition !== null;
  }

  setLanguage(langCode) {
    this.currentLanguage = speechLanguages[langCode] || 'hi-IN';
    if (this.recognition) {
      this.recognition.lang = this.currentLanguage;
    }
  }

  startListening() {
    if (!this.recognition) {
      if (this.onError) this.onError('Speech recognition not supported');
      return false;
    }

    if (this.isListening) {
      this.stopListening();
      return false;
    }

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      if (this.onError) this.onError('Failed to start voice recognition');
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  getErrorMessage(error) {
    const errorMessages = {
      'no-speech': 'कोई आवाज़ नहीं सुनाई दी / No speech detected',
      'audio-capture': 'माइक्रोफोन एक्सेस नहीं मिला / Microphone access denied',
      'not-allowed': 'माइक्रोफोन की अनुमति नहीं दी गई / Microphone permission denied',
      'network': 'नेटवर्क की समस्या / Network error',
      'language-not-supported': 'भाषा समर्थित नहीं है / Language not supported',
      'service-not-allowed': 'सेवा उपलब्ध नहीं है / Service not available'
    };

    return errorMessages[error] || `आवाज़ पहचान में समस्या / Voice recognition error: ${error}`;
  }
}

// Voice feedback utility
export const speakText = (text, language = 'hi-IN') => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    speechSynthesis.speak(utterance);
  }
};

// Get available voices for a language
export const getAvailableVoices = (language) => {
  if ('speechSynthesis' in window) {
    const voices = speechSynthesis.getVoices();
    return voices.filter(voice => voice.lang.startsWith(language.split('-')[0]));
  }
  return [];
};