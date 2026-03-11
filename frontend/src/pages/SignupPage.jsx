import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

function SignupPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const { t } = useTranslation();

  const validationSchema = yup.object({
    username: yup
      .string()
      .min(3, t('signup.validation.username.min'))
      .max(20, t('signup.validation.username.max'))
      .matches(/^[a-zA-Z0-9_-]+$/, t('signup.validation.username.pattern'))
      .required(t('signup.validation.username.required')),
    password: yup
      .string()
      .min(6, t('signup.validation.password.min'))
      .required(t('signup.validation.password.required')),
    passwordConfirm: yup
      .string()
      .oneOf([yup.ref('password')], t('signup.validation.passwordConfirm.mismatch'))
      .required(t('signup.validation.passwordConfirm.required')),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setServerError('');
      const response = await axios.post('/api/v1/signup', {
        username: values.username,
        password: values.password,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      navigate('/');
    } catch (error) {
      if (error.response?.status === 409) {
        setServerError(t('signup.userExists'));
      } else {
        setServerError(t('signup.serverError'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-100 bg-light d-flex align-items-center justify-content-center py-4">
      <div className="w-100" style={{ maxWidth: '500px', minWidth: '320px' }}>
        <div className="card shadow-lg border-0">
          <div className="card-body p-5">
            <h2 className="h4 fw-normal mb-4 text-center text-dark">
              {t('signup.title')}
            </h2>

            {serverError && (
              <div className="alert alert-danger mb-4" role="alert">
                {serverError}
              </div>
            )}

            <Formik
              initialValues={{
                username: '',
                password: '',
                passwordConfirm: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form noValidate>
                  <div className="mb-4">
                    <label htmlFor="username" className="form-label fw-semibold mb-2">
                      {t('signup.username')}
                    </label>
                    <Field
                      id="username"
                      name="username"
                      type="text"
                      className={`form-control form-control-lg ${
                        touched.username && errors.username ? 'is-invalid' : ''
                      }`}
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
                      {t('signup.password')}
                    </label>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      className={`form-control form-control-lg ${
                        touched.password && errors.password ? 'is-invalid' : ''
                      }`}
                      autoComplete="new-password"
                      disabled={isSubmitting}
                    />
                    {touched.password && errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="passwordConfirm" className="form-label fw-semibold mb-2">
                      {t('signup.passwordConfirm')}
                    </label>
                    <Field
                      id="passwordConfirm"
                      name="passwordConfirm"
                      type="password"
                      className={`form-control form-control-lg ${
                        touched.passwordConfirm && errors.passwordConfirm ? 'is-invalid' : ''
                      }`}
                      autoComplete="new-password"
                      disabled={isSubmitting}
                    />
                    {touched.passwordConfirm && errors.passwordConfirm && (
                      <div className="invalid-feedback">{errors.passwordConfirm}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 fw-semibold btn-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('signup.creating') : t('signup.submit')}
                  </button>
                </Form>
              )}
            </Formik>

            <div className="text-center mt-4 pt-3 border-top">
              <Link to="/login" className="text-muted text-decoration-none fw-semibold">
                {t('signup.loginLink')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;