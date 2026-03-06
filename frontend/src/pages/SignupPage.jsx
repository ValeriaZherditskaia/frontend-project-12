import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const REGISTRATION_SCHEMA = yup.object({
  username: yup.string()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .matches(/^[a-zA-Z0-9_-]+$/, 'Только буквы, цифры, _, -')
    .required('Имя пользователя обязательно'),
  password: yup.string()
    .min(6, 'Не менее 6 символов')
    .required('Пароль обязателен'),
  passwordConfirm: yup.string()
    .oneOf([yup.ref('password')], 'Пароли должны совпадать')
    .required('Подтвердите пароль'),
});

function SignupPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const { t: translate } = useTranslation();

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
        setServerError(translate('signup.userExists'));
      } else {
        setServerError(translate('signup.serverError'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="vw-100 vh-100 bg-light d-flex align-items-center justify-content-center p-4" style={{ padding: '2rem' }}>
      <div style={{ width: '50vw', maxWidth: '500px', minWidth: '350px' }}>
        <div className="card shadow-lg border-0 h-100">
          <div className="card-body p-5 d-flex flex-column h-100 justify-content-center">
            <h2 className="h4 fw-normal mb-4 text-center text-dark">
              {translate('signup.title')}
            </h2>
            
            {serverError && <div className="alert alert-danger mb-4">{serverError}</div>}

            <Formik initialValues={{ username: '', password: '', passwordConfirm: '' }} validationSchema={REGISTRATION_SCHEMA} onSubmit={handleSubmit}>
              {({ isSubmitting, errors, touched }) => (
                <Form noValidate>
                  <div className="mb-4">
                    <label htmlFor="username" className="form-label fw-semibold mb-2">
                      {translate('signup.username')}
                    </label>
                    <Field
                      id="username"
                      name="username"
                      type="text"
                      className={`form-control form-control-lg ${touched.username && errors.username ? 'is-invalid' : ''}`}
                      autoComplete="username"
                      autoFocus
                      disabled={isSubmitting}
                    />
                    {touched.username && errors.username && <div className="invalid-feedback">{errors.username}</div>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold mb-2">
                      {translate('signup.password')}
                    </label>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      className={`form-control form-control-lg ${touched.password && errors.password ? 'is-invalid' : ''}`}
                      autoComplete="new-password"
                      disabled={isSubmitting}
                    />
                    {touched.password && errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="passwordConfirm" className="form-label fw-semibold mb-2">
                      {translate('signup.passwordConfirm')}
                    </label>
                    <Field
                      id="passwordConfirm"
                      name="passwordConfirm"
                      type="password"
                      className={`form-control form-control-lg ${touched.passwordConfirm && errors.passwordConfirm ? 'is-invalid' : ''}`}
                      autoComplete="new-password"
                      disabled={isSubmitting}
                    />
                    {touched.passwordConfirm && errors.passwordConfirm && <div className="invalid-feedback">{errors.passwordConfirm}</div>}
                  </div>

                  <button type="submit" className="btn btn-primary w-100 py-3 fw-semibold btn-lg" disabled={isSubmitting}>
                    {isSubmitting ? translate('signup.creating') : translate('signup.submit')}
                  </button>
                </Form>
              )}
            </Formik>

            <div className="text-center mt-4 pt-3 border-top">
              <Link to="/login" className="text-muted text-decoration-none fw-semibold">
                {translate('signup.loginLink')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
