async function getRecipe() {
  setLoading(true);

  try {
    const response = await fetchGPTResponse(ingredients());
    setRecipe(response);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    setErrorMessage('Failed to fetch recipe. Please check your ingredients and try again.');
  } finally {
    setLoading(false);
  }
}

<button onClick={getRecipe} disabled={loading}>
  {loading ? 'Loading...' : 'Get Recipe'}
</button>;

export async function fetchGPTResponse(prompt) {
  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.choices || data.choices.length === 0) {
        throw new Error('No choices returned from the API.');
    }
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching GPT response:', error);
    throw error;
  }
}
