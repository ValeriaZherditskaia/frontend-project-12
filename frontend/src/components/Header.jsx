import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  
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
          {/* 🔥 Hexlet Chat — ТЗ Hexlet */}
          <Link to="/" className="navbar-brand fw-bold h4 mb-0 text-primary">
            Hexlet Chat
          </Link>
          
          {/* 🔥 Кнопка "Выйти" для авторизованных */}
          {isAuthenticated && (
            <div className="ms-auto">
              <button 
                className="btn btn-outline-danger btn-sm"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                Выйти
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
