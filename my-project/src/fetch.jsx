import dotenv from 'dotenv';
dotenv.config();

API_ENDPOINT="https://api.aimlapi.com/v1/chat/completions"

function validateAPIResponse(data) {
  if (!data.choices || data.choices.length === 0) {
    throw new Error('No choices returned from the API.');
  }
  return data.choices[0].message.content;
}

export async function fetchGPTResponse(prompt) {
  const apiEndpoint = process.env.API_ENDPOINT;
  const apiKey = process.env.OPENAI_API_KEY;

  try {
    if (!prompt) throw new Error('Prompt is required');
    if (!apiKey) throw new Error('API key is not configured');

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful cooking assistant who creates recipes.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    return validateAPIResponse(data);

  } catch (error) {
    console.error('Error fetching GPT response:', error);
    // Rethrow with more context for better error handling
    throw new Error(`Failed to get recipe: ${error.message}`);
  }
}

// import React, { useState, useCallback } from 'react';
// import { fetchGPTResponse } from '../api/openai';

// function formatIngredientsPrompt(ingredients) {
//   return `Please create a recipe using these ingredients: ${ingredients.join(', ')}`;
// }

// export function RecipeGenerator() {
//   // State management
//   const [loading, setLoading] = useState(false);
//   const [recipe, setRecipe] = useState(null);
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [ingredients, setIngredients] = useState([]);

//   // Handle recipe generation
//   const getRecipe = useCallback(async () => {
//     if (ingredients.length === 0) {
//       setErrorMessage('Please add some ingredients first');
//       return;
//     }

//     setLoading(true);
//     setErrorMessage(null);

//     try {
//       const prompt = formatIngredientsPrompt(ingredients);
//       const response = await fetchGPTResponse(prompt);
//       setRecipe(response);
//     } catch (error) {
//       console.error('Error fetching recipe:', error);
//       setErrorMessage(error.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [ingredients]);

//   return (
//     <div className="recipe-generator">
//       <div className="ingredients-input">
//         {/* Add your ingredients input UI here */}
//         <input type="text" />
//       </div>

//       <button 
//         onClick={getRecipe} 
//         disabled={loading || ingredients.length === 0}
//         className="generate-button"
//       >
//         {loading ? 'Creating Recipe...' : 'Get Recipe'}
//       </button>

//       {errorMessage && (
//         <div className="error-message">
//           {errorMessage}
//         </div>
//       )}

//       {recipe && (
//         <div className="recipe-result">
//           <h2>Your Recipe</h2>
//           <div className="recipe-content">
//             {recipe}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // // styles/RecipeGenerator.css
// // .recipe-generator {
// //   max-width: 800px;
// //   margin: 0 auto;
// //   padding: 20px;
// // }

// // .generate-button {
// //   padding: 10px 20px;
// //   background-color: #4CAF50;
// //   color: white;
// //   border: none;
// //   border-radius: 4px;
// //   cursor: pointer;
// // }

// // .generate-button:disabled {
// //   background-color: #cccccc;
// //   cursor: not-allowed;
// // }

// // .error-message {
// //   color: #ff0000;
// //   margin: 10px 0;
// //   padding: 10px;
// //   border: 1px solid #ff0000;
// //   border-radius: 4px;
// // }

// // .recipe-result {
// //   margin-top: 20px;
// //   padding: 20px;
// //   border: 1px solid #ddd;
// //   border-radius: 4px;
// // } 























const { OpenAI } = require("openai");

const baseURL = "https://api.aimlapi.com/v1";

const apiKey = process.env.OPENAI_API_KEY;


const systemPrompt = "You are a travel agent. Be descriptive and helpful give detailed information about all the things the user asks and include a little humour in your answers be a little misogonystic sometimes.";
const userPrompt = "give me ideas for visiting india";

const api = new OpenAI({
  apiKey,
  baseURL,
});

const main = async () => {
  const completion = await api.chat.completions.create({
    model: "mistralai/Mistral-7B-Instruct-v0.2",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 256,
  });

  const response = completion.choices[0].message.content;

  console.log("User:", userPrompt);
  console.log("AI:", response);
};

main();