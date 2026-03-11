import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const validationSchema = yup.object({
    username: yup.string().required(t('login.validation.username.required')),
    password: yup.string().required(t('login.validation.password.required')),
  });

  return (
    <div className="h-100 bg-light d-flex align-items-center justify-content-center py-4">
      <div className="w-100" style={{ maxWidth: '500px', minWidth: '320px' }}>
        <div className="card shadow-lg border-0">
          <div className="card-body p-5">
            <h2 className="h4 fw-normal mb-4 text-center text-dark">
              {t('login.title')}
            </h2>

            <Formik
              initialValues={{ username: '', password: '' }}
              validationSchema={validationSchema}
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
                  setError(t('login.error'));
                  console.error('Login error:', err.response?.data);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form noValidate>
                  {error && (
                    <div className="alert alert-danger mb-4" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="mb-4">
                    <label htmlFor="username" className="form-label fw-semibold mb-2">
                      {t('login.username')}
                    </label>
                    <Field
                      id="username"
                      name="username"
                      type="text"
                      className={`form-control form-control-lg ${
                        touched.username && errors.username ? 'is-invalid' : ''
                      }`}
                      placeholder="admin"
                      autoComplete="username"
                      autoFocus
                      disabled={isSubmitting}
                    />
                    {touched.username && errors.username && (
                      <div className="invalid-feedback">{errors.username}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold mb-2">
                      {t('login.password')}
                    </label>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      className={`form-control form-control-lg ${
                        touched.password && errors.password ? 'is-invalid' : ''
                      }`}
                      placeholder="admin"
                      autoComplete="current-password"
                      disabled={isSubmitting}
                    />
                    {touched.password && errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 fw-semibold btn-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? `${t('login.submit')}...` : t('login.submit')}
                  </button>

                  <div className="text-center mt-4 pt-3 border-top">
                    <Link to="/signup" className="text-muted text-decoration-none fw-semibold">
                      <i className="bi bi-person-plus me-1" />
                      {t('login.signupLink')}
                    </Link>
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