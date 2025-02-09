import { createSignal, createResource } from 'solid-js';

const fetchAIText = async (inputText) => {
  try {
    const response = await fetch('');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching AI text:', error);
    throw error;
  }
};

const TextPage = () => {
  // Create signals for managing loading and error states
  // In SolidJS, signals are reactive values that trigger re-renders when changed
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal(null);
  
  // createResource is a special SolidJS hook for data fetching
  // It handles loading states and caching automatically
  // The first item in the array is the data signal
  // The second item contains utility functions like refetch
  const [responseText, setResponseText] = createSignal('');
  const [aiData, { refetch }] = createResource(fetchAIText);

  // This function handles the button click event
  // It resets any previous errors and triggers a new fetch
  const handleFetch = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setError(null);
    try {
      await refetch();
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className = "bg-gray-100 h-screen w-screen ">
      <div className = " flex justify-center items-center">
        <div className = "">
          <input type="text" className = "bg-gray-200 rounded-sm p-2" />
          <button className="bg-gray-400 rounded-sm p-2" type="submit">Go</button>
            {error() && <div className="text-gray-700">{error()}</div>}
          {responseText() && <div className="text-gray-800">{responseText()}</div>}
      </div>
      </div>
    </div>
  )
    
};

export default TextPage;
