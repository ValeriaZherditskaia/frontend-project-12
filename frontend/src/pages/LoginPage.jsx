import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import { useState } from 'react';

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  return (
    <div className="vw-100 vh-100 bg-light d-flex align-items-center justify-content-center p-4" style={{padding: '2rem'}}>
      {/* 🔥 ФОРМА 50% ширины — ТОЧНО ПО ЦЕНТРУ */}
      <div style={{width: '50vw', maxWidth: '500px', minWidth: '350px'}}>
        <div className="card shadow-lg border-0 h-100">
          <div className="card-body p-5 d-flex flex-column h-100 justify-content-center">
            <h2 className="h4 fw-normal mb-4 text-center text-dark">Вход</h2>
            
            <Formik
              initialValues={{ username: '', password: '' }}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  setError('');
                  const response = await axios.post('/api/v1/login', {
                    username: values.username,
                    password: values.password,
                  });
                  localStorage.setItem('token', response.data.token);
                  localStorage.setItem('username', response.data.username);
                  navigate('/');
                } catch {
                  setError('Неверное имя пользователя или пароль');
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form noValidate>
                  {error && (
                    <div className="alert alert-danger mb-4">{error}</div>
                  )}
                  
                  <div className="mb-4">
                    <label htmlFor="username" className="form-label fw-semibold mb-2">
                      Имя пользователя
                    </label>
                    <Field
                      id="username"
                      name="username"
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="admin"
                      autoComplete="username"
                      autoFocus
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold mb-2">
                      Пароль
                    </label>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="admin"
                      autoComplete="current-password"
                      disabled={isSubmitting}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="btn btn-primary w-100 py-3 fw-semibold btn-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Вход...' : 'Войти'}
                  </button>

                  <div className="text-center mt-4 pt-3 border-top">
                    <a href="/signup" className="text-muted text-decoration-none fw-semibold">
                      <i className="bi bi-person-plus me-1"></i>
                      Нет аккаунта? Регистрация
                    </a>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
