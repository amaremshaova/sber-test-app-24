import './app.css';

import CurrenciesSelect from './lib/CurrenciesSelect.svelte';

// URL для запроса списка всех валют

const app = new CurrenciesSelect({
  target: document.getElementById('app'),
});

export default app;
