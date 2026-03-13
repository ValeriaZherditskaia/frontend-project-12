import { useTranslation } from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom'

function Header() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const handleLogoClick = (e) => {
    e.preventDefault()
    if (token) {
      // Если авторизован - перезагружаем главную
      window.location.href = '/'
    }
    else {
      // Если не авторизован - идём на логин
      navigate('/login')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
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
      {token && (
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
