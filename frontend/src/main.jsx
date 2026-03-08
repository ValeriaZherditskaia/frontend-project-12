import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import Profanity from 'leo-profanity';
import { Provider as RollbarProvider } from '@rollbar/react';
import Rollbar from 'rollbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App.jsx';
import { store } from './store/index.js';
import './i18n.js';

// 🔥 Profanity RU
Profanity.loadDictionary('ru');
console.log('🔥 Profanity RU loaded:', Profanity.list().length, 'words');

// 🔥 Redux store
console.log('🔥 STORE created:', store.getState());

// 🔥 Rollbar config (process.env.NODE_ENV)
const rollbarConfig = {
  accessToken: '50dadf468b9e4152be786f4f7394653f',
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: /* process.env.NODE_ENV || */ 'development',
};

// Создаём экземпляр (используется RollbarProvider)
const _rollbar = new Rollbar(rollbarConfig);

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
