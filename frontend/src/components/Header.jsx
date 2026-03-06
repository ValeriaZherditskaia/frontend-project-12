import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Header() {
  const navigate = useNavigate();
  const { t: translate } = useTranslation();

  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-white shadow-sm border-bottom">
      <div className="container">
        <nav className="navbar py-3">
          <Link to="/" className="navbar-brand fw-bold h4 mb-0 text-primary">
            {translate('app.name')}
          </Link>

          {isAuthenticated && (
            <div className="ms-auto">
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleLogout}
                aria-label={translate('app.logout')}
              >
                {translate('app.logout')}
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
