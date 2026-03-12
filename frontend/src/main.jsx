import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import Profanity from 'leo-profanity';
import { Provider as RollbarProvider } from '@rollbar/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';
import App from './App.jsx';
import { store } from './store/index.js';
import './i18n.js';

// Загрузка словаря для фильтрации нецензурных слов
Profanity.loadDictionary('ru');

// Конфигурация Rollbar
const rollbarConfig = {
  accessToken: '50dadf468b9e4152be786f4f7394653f',
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: import.meta.env.MODE,
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RollbarProvider config={rollbarConfig}>
      <Provider store={store}>
        <Suspense fallback={null}>
          <App />
        </Suspense>
      </Provider>
    </RollbarProvider>
  </StrictMode>
);