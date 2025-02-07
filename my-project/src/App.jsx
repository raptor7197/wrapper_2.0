import { createSignal } from 'solid-js';

function App() {
  const [ingredients, setIngredients] = createSignal("");
  const [recipe,setRecipe]  = createSignal({
    preprationMethod:" ",
    nutrientInfo : ""
  });

  const [loading, setLoading] = createSignal(false);
  
}

return (
  <div class="bg-white shadow-md rounded-lg p-8 m-auto max-w-lg">
    <textarea
      value={ingredients()}
      onChange={(ev) => setIngredients(ev.target.value)}
    ></textarea>
    <button onClick={getRecipe} disabled={loading()}>
      Get
    </button>
    {!loading() && recipe().preparationMethod && (
      <>
        <p class="bg-gray-100">{recipe().preparationMethod}</p>
        <p class="bg-gray-100">{recipe().nutritionalInformations}</p>
      </>
    )}
    {/* and a container where the GPT response will be rendered. */}
  </div>
);

export default App;