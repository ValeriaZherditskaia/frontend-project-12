import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import Profanity from 'leo-profanity';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App.jsx';
import { store } from './store/index.js';
import './i18n';

Profanity.loadDictionary('ru'); // Загружает RU словарь
console.log('🔥 Profanity RU loaded:', Profanity.list().length, 'words');

console.log('🔥 STORE created:', store.getState());

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={null}>
      <Provider store={store}>
        <App />
      </Provider>
    </Suspense>
  </StrictMode>
);
