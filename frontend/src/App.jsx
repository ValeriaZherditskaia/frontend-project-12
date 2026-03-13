import 'react-toastify/dist/ReactToastify.css'
import './styles/index.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Header from './components/Header'
import AppLayout from './components/AppLayout'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import NotFoundPage from './pages/NotFoundPage'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? <Navigate to="/" replace /> : children
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route
          path="/"
          element={(
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          )}
        />
        <Route
          path="/login"
          element={(
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          )}
        />
        <Route
          path="/signup"
          element={(
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          )}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  )
}

export default App
