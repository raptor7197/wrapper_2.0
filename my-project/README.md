# 🌾 Multilingual Farm Assistant

This is a Gemini-powered GPT application designed to assist farmers with agricultural queries in their native language. It features a SolidJS frontend and an Express.js backend.

## ✨ Features

### Frontend
- 📱 **Responsive Design:** Works on both desktop and mobile devices.
- 🌍 **Multilingual Support:** Supports English, Hindi, Punjabi, Telugu, and Tamil.
- 💡 **Pre-built Questions:** Sample questions in each language to get started.
- 🔧 **Custom Prompts:** Advanced options for custom AI behavior.
- ⚡ **Real-time Responses:** Get instant answers from the AI.

### Backend
- 🤖 **Gemini 1.5 Flash Integration:** Powered by Google's latest AI model.
- 🌐 **CORS Configured:** Securely connects the frontend and backend.
- 📊 **Health Monitoring:** An endpoint to check the status of the backend server.
- 🔒 **Environment Variable Security:** Keeps your API key safe.

### AI Capabilities
- 🌾 **Agricultural Expertise:** Get advice on a wide range of farming topics.
- 🐛 **Pest Control:** Identify and manage pests in your crops.
- 🌧️ **Weather-based Recommendations:** Get advice tailored to your local weather conditions.
- 🌱 **Crop Management:** Guidance on planting, growing, and harvesting crops.
- 💧 **Water Conservation:** Tips for efficient water usage.
- 🌿 **Organic Farming:** Learn about sustainable and organic farming methods.

## 🛠️ Tech Stack

- **Frontend:** [SolidJS](https://www.solidjs.com/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** [Express.js](https://expressjs.com/), [Node.js](https://nodejs.org/)
- **AI:** [Google Gemini](https://deepmind.google/technologies/gemini/)

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- A [Google Gemini API key](https://makersuite.google.com/app/apikey)

## 🚀 Getting Started

### 1. Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
```

### 2. Environment Variables

Create a `.env` file in the root of the project and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 3. Running the Application

Start both the frontend and backend servers concurrently:

```bash
npm run dev:full
```

The application will be available at [http://localhost:5173](http://localhost:5173).

## 📜 Available Scripts

- `npm run dev`: Starts the frontend development server.
- `npm run server:dev`: Starts the backend server with auto-reloading.
- `npm run dev:full`: Starts both the frontend and backend servers.
- `npm run build`: Builds the application for production.
- `npm run serve`: Serves the production build locally.

## 📡 API Endpoints

- `POST /api/generate`: The main endpoint for generating AI responses.
- `GET /api/health`: A health check endpoint for the backend server.

## 📁 Project Structure

```
my-project/
├── src/
│   ├── App.jsx              # Main app component
│   ├── textpage.jsx         # Multilingual chat interface
│   ├── languages.js         # Language translations
│   └── index.jsx           # Entry point
├── server.js               # Express backend with Gemini
├── .env                    # Environment variables
├── package.json            # Dependencies and scripts
└── vite.config.js         # Frontend build config
```

## 🤔 Troubleshooting

- **API Key Error:** Ensure your `.env` file has the correct Gemini API key.
- **CORS Error:** Make sure the `FRONTEND_URL` in your `.env` file matches the URL of the running frontend application.
- **Port in Use:** If you get an `EADDRINUSE` error, change the `PORT` in your `.env` file to an unused port.

## 🚢 Deployment

Run the `npm run build` command to create a `dist` folder with the production-ready assets. You can then deploy this folder to any static hosting provider.