import { createSignal, createEffect } from 'solid-js';


function App() {
  const [ingredients, setIngredients] = createSignal("");
  const [recipe, setRecipe] = createSignal({
    preparationMethod: "",
    nutrientInfo: ""
  });

  const [loading, setLoading] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal("");

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

  createEffect(() => {
    if (errorMessage()) {
      console.error(errorMessage());
      setErrorMessage("");
    }
  });

  return (
    <div className="justify-center bg-blue-400 w-screen h-screen pt-5">
      <div class="bg-slate-400 shadow-md rounded-lg p-8 m-auto max-w-lg ">
        <textarea className = "align-text-bottom"
          value={ingredients()}
          onChange={(ev) => setIngredients(ev.target.value)}
          placeholder="Enter ingredients"
        />
        {errorMessage() && (
          <p class="bg-red-100">{errorMessage()}</p>
        )}
        {!loading() && recipe().preparationMethod && (
          <>
            <p class="bg-gray-100">{recipe().preparationMethod}</p>
            <p class="bg-gray-100">{recipe().nutrientInfo}</p>
          </>
        )}
        {loading() && (
          <p>Loading...</p>
        )}
      </div>
      <div>
        <button onClick={getRecipe} disabled={loading()} className="bg-amber-300 border-1 rounded-lg align-items ml-230 mt-3.5 p-3">
          Get Recipe
        </button>
      </div>
    </div>
  );
}

export default App;