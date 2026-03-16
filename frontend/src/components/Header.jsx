import { useTranslation } from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function Header() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  const handleLogoClick = (e) => {
    e.preventDefault()
    if (isAuthenticated) {
      window.location.href = '/'
    } else {
      navigate('/login')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="app-header">
      <Link
        to="/"
        className="h4 mb-0 text-decoration-none text-dark"
        onClick={handleLogoClick}
      >
        {t('app.name')}
      </Link>
      {isAuthenticated && (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleLogout}
        >
          {t('app.logout')}
        </button>
      )}
    </header>
  )
}

export default Header