import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import { useState } from 'react';

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">Вход</h3>
            </div>
            <div className="card-body">
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
                  } catch (err) {
                    setError('Неверное имя пользователя или пароль');
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    {error && (
                      <div className="alert alert-danger mb-3">{error}</div>
                    )}
                    
                    <div className="mb-4">
                      <label htmlFor="username" className="form-label">
                        Имя пользователя
                      </label>
                      <Field
                        id="username"
                        name="username"
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="admin"
                        autoComplete="username"
                        disabled={isSubmitting}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="password" className="form-label">
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
                        required
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg w-100"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Входим...' : 'Войти'}
                    </button>
                    
                    <div className="mt-3 text-center">
                      <small className="text-muted">
                        Для теста: admin / admin
                      </small>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
