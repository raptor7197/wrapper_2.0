import { createSignal } from 'solid-js';

function App() {
  const [ingredients, setIngredients] = createSignal("");
  const [recipe,setRecipe]  = createSignal({
    preprationMethod:" ",
    nutrientInfo : ""
  });

  const [loading, setLoading] = createSignal(false);
  
  
  const getRecipe = async () => {
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
  
  return (
    <span className = "justify-center">
    <div class="bg-slate-400 shadow-md rounded-lg p-8 m-auto max-w-lg">
    <textarea
      value={ingredients()}
      onChange={(ev) => setIngredients(ev.target.value)}
      ></textarea>
    
    {!loading() && recipe().preparationMethod && (
      <>
        <p class="bg-gray-100">{recipe().preparationMethod}</p>
          <p class="bg-gray-100">{recipe().nutrientInfo}</p>

      </>
    )}
  </div>
  <div>
  <button onClick={getRecipe} disabled={loading()} className = "m-auto max-w-lg">
      Get
    </button>
  </div>
  </span>
);
}

export default App;
