import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AppLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const username = localStorage.getItem('username');

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h1 className="mb-0">Hexlet Chat</h1>
            </div>
            <div className="card-body text-center">
              <h2>Добро пожаловать!</h2>
              <p className="lead">
                Вы авторизованы как <strong>{username}</strong>
              </p>
              <hr />
              <p>Здесь будет чат.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
