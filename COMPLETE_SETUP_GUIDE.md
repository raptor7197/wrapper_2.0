# 🌾 Complete Setup Guide - Multilingual Farm Assistant

## 📋 **What You Need to Configure**

### 1. **Get Your Gemini API Key** (MOST IMPORTANT)

**Step 1:** Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
**Step 2:** Sign in with your Google account
**Step 3:** Click "Create API Key"
**Step 4:** Copy the generated API key

**Step 5:** Edit the `.env` file:
```bash
# Open the .env file and replace 'your_gemini_api_key_here' with your actual key
GEMINI_API_KEY=AIzaSyD-9tC7oYXXXXXXXXXXXXXXXXXXXXXX  # Your actual key here
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 2. **Install Dependencies** (Already Done ✅)
```bash
# All packages are already installed
npm list --depth=0
```

### 3. **Start the Application**

**Option A: Start Both Frontend and Backend Together** (Recommended)
```bash
npm run dev:full
```

**Option B: Start Separately**
```bash
# Terminal 1 - Backend
npm run server:dev

# Terminal 2 - Frontend  
npm run dev
```

### 4. **Access the Application**
- **Frontend:** http://localhost:5173 (or http://localhost:3000)
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/api/health

---

## 🌍 **Available Languages**
- 🇬🇧 **English** - Global accessibility
- 🇮🇳 **हिंदी (Hindi)** - Default language
- 🇮🇳 **ਪੰਜਾਬੀ (Punjabi)** - Punjab farmers
- 🇮🇳 **తెలుగు (Telugu)** - Andhra Pradesh, Telangana
- 🇮🇳 **தமிழ் (Tamil)** - Tamil Nadu farmers

---

## 🚀 **Ready-to-Use Features**

### ✅ **Frontend Features**
- 📱 Mobile-responsive design
- 🌿 Green agricultural theme
- 🌍 5-language support with instant switching
- 💡 Pre-built farming questions in each language
- 🔧 Advanced custom prompt options
- ⚡ Real-time AI responses

### ✅ **Backend Features**
- 🤖 Gemini 1.5 Flash AI integration
- 🌐 CORS configured for frontend
- 🈳 Multilingual response handling
- 📊 Health monitoring endpoint
- 🔒 Environment variable security

### ✅ **AI Capabilities**
- 🌾 Agricultural expertise in all languages
- 🐛 Pest control advice
- 🌧️ Weather-based recommendations
- 🌱 Crop management guidance
- 💧 Water conservation tips
- 🌿 Organic farming methods

---

## 🛠️ **Troubleshooting**

### **Problem: API Key Error**
```
Error: Gemini API key not configured
```
**Solution:** Make sure your `.env` file has the correct API key:
```bash
GEMINI_API_KEY=your_actual_api_key_here
```

### **Problem: CORS Error**
```
Access to fetch blocked by CORS policy
```
**Solution:** Make sure both servers are running:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### **Problem: Port Already in Use**
```
Error: listen EADDRINUSE :::3001
```
**Solution:** Change port in `.env`:
```bash
PORT=3002  # Use different port
```

### **Problem: Dependencies Missing**
```
Cannot find module 'express'
```
**Solution:** Reinstall packages:
```bash
npm install
```

---

## 📁 **Project Structure**
```
my-project/
├── src/
│   ├── App.jsx              # Main app component
│   ├── textpage.jsx         # Multilingual chat interface
│   ├── languages.js         # Language translations
│   └── index.jsx           # Entry point
├── server.js               # Express backend with Gemini
├── .env                    # Environment variables (ADD YOUR API KEY HERE)
├── package.json            # Dependencies and scripts
├── vite.config.js         # Frontend build config
└── SETUP.md               # Basic setup guide
```

---

## 🎯 **Quick Start Commands**

```bash
# 1. Add your Gemini API key to .env file
# 2. Start the application
npm run dev:full

# 3. Open browser to http://localhost:5173
# 4. Select your language and start asking farming questions!
```

---

## 🌱 **Sample Questions to Try**

**Hindi:** मेरी फसल में कीड़े लग गए हैं, क्या करूं?
**Punjabi:** ਮੇਰੀ ਫਸਲ ਵਿੱਚ ਕੀੜੇ ਲੱਗ ਗਏ ਹਨ, ਕੀ ਕਰਾਂ?
**Telugu:** నా పంటలో తెగుళ్లు వచ్చాయి, ఏమి చేయాలి?
**Tamil:** என் பயிரில் பூச்சிகள் வந்துவிட்டன, என்ன செய்வது?
**English:** My crop has pests, what should I do?

---

## 📞 **Support**

If you encounter any issues:
1. Check the `.env` file has your correct API key
2. Ensure both servers are running on correct ports
3. Try restarting with `npm run dev:full`
4. Check browser console for detailed error messages

**Your multilingual farm assistant is ready to help farmers in their native language! 🚜🌾**