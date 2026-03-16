import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { Provider as RollbarProvider } from '@rollbar/react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/index.css'
import App from './App.jsx'
import { store } from './store/index.js'
import { rollbarConfig } from './init.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RollbarProvider config={rollbarConfig}>
      <Provider store={store}>
        <Suspense fallback={null}>
          <App />
        </Suspense>
      </Provider>
    </RollbarProvider>
  </StrictMode>,
)
