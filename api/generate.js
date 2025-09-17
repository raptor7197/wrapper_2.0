import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const customSystemPrompt = "You are a helpful AI assistant. Provide detailed, accurate, and engaging responses to user queries. Be creative and informative while maintaining a friendly tone.";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, customPrompt, language } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Enhanced system prompt with language instructions
    const systemPrompt = customPrompt || customSystemPrompt;
    const languageInstruction = language ? `\n\nIMPORTANT: Please respond in the same language as the user's question. If the user asks in Hindi, respond in Hindi. If in Punjabi, respond in Punjabi. If in Telugu, respond in Telugu. If in Tamil, respond in Tamil. If in English, respond in English. Maintain the same language throughout your response.` : '';
    
    const fullPrompt = `${systemPrompt}${languageInstruction}\n\nUser: ${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ 
      success: true, 
      response: text,
      prompt: prompt,
      language: language,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ 
      error: 'Failed to generate content',
      details: error.message 
    });
  }
}