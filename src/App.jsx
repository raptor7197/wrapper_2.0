import { createSignal, createEffect } from 'solid-js';
import TextPage from './textpage';

function App() {
  // Initialize a signal to store the application state
  const [count, setCount] = createSignal(0);

  

  return (
    <div>
      <TextPage />
    </div>
  );
}

export default App;