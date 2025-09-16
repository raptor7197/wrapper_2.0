# Gemini GPT App Setup Guide

## Overview
This is a full-stack application with a SolidJS frontend and Express.js backend that integrates with Google's Gemini AI API.

## Prerequisites
- Node.js (v16 or higher)
- npm or pnpm
- Google Gemini API key

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   - Copy `.env` file and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   ```

3. **Get Gemini API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy it to your `.env` file

## Running the Application

### Development Mode (Both Frontend and Backend)
```bash
npm run dev:full
```

### Run Frontend Only
```bash
npm run dev
```

### Run Backend Only
```bash
npm run server:dev
```

## Project Structure

```
├── src/
│   ├── App.jsx          # Main App component
│   ├── textpage.jsx     # Main chat interface
│   └── index.jsx        # Entry point
├── server.js            # Express backend server
├── .env                 # Environment variables
└── package.json         # Dependencies and scripts
```

## Features

- **Custom System Prompts**: Set custom behavior for the AI
- **Real-time Chat**: Interactive chat interface with Gemini AI
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Visual feedback during API calls
- **Responsive Design**: Works on desktop and mobile devices

## API Endpoints

- `POST /api/generate` - Generate AI responses
- `GET /api/health` - Health check endpoint

## Environment Variables

- `GEMINI_API_KEY` - Your Google Gemini API key (required)
- `PORT` - Backend server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)

## Troubleshooting

1. **API Key Issues**: Make sure your Gemini API key is valid and properly set in `.env`
2. **CORS Errors**: Ensure the frontend URL matches the CORS configuration
3. **Port Conflicts**: Change the PORT in `.env` if 3001 is already in use
4. **Connection Issues**: Make sure both frontend and backend are running

## Development Scripts

- `npm run dev` - Start frontend development server
- `npm run server` - Start backend server
- `npm run server:dev` - Start backend with nodemon (auto-restart)
- `npm run dev:full` - Start both frontend and backend concurrently
- `npm run build` - Build for production
- `npm run serve` - Preview production build