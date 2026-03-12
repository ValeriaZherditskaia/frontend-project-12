import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="bg-light h-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card shadow-sm">
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
                  initialValues={{ username: '', password: '', passwordConfirm: '' }}
                  validationSchema={validationSchema}
                  validateOnMount={false}
                  validateOnBlur={true}
                  validateOnChange={false}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, errors, touched, submitCount }) => (
                    <Form noValidate>
                      <div className="form-floating mb-4">
                        <Field
                          id="username"
                          name="username"
                          type="text"
                          className={`form-control ${
                            ((touched.username && errors.username) || (submitCount > 0 && errors.username)) ? 'is-invalid' : ''
                          }`}
                          placeholder=" "
                          autoComplete="username"
                          autoFocus
                          disabled={isSubmitting}
                        />
                        <label htmlFor="username">{t('signup.usernamePlaceholder')}</label>
                        {((touched.username && errors.username) || (submitCount > 0 && errors.username)) && (
                          <div className="invalid-feedback">{errors.username}</div>
                        )}
                      </div>

                      <div className="form-floating mb-4">
                        <Field
                          id="password"
                          name="password"
                          type="password"
                          className={`form-control ${
                            ((touched.password && errors.password) || (submitCount > 0 && errors.password)) ? 'is-invalid' : ''
                          }`}
                          placeholder=" "
                          autoComplete="new-password"
                          disabled={isSubmitting}
                        />
                        <label htmlFor="password">{t('signup.passwordPlaceholder')}</label>
                        {((touched.password && errors.password) || (submitCount > 0 && errors.password)) && (
                          <div className="invalid-feedback">{errors.password}</div>
                        )}
                      </div>

                      <div className="form-floating mb-4">
                        <Field
                          id="passwordConfirm"
                          name="passwordConfirm"
                          type="password"
                          className={`form-control ${
                            ((touched.passwordConfirm && errors.passwordConfirm) || (submitCount > 0 && errors.passwordConfirm)) ? 'is-invalid' : ''
                          }`}
                          placeholder=" "
                          autoComplete="new-password"
                          disabled={isSubmitting}
                        />
                        <label htmlFor="passwordConfirm">{t('signup.passwordConfirmPlaceholder')}</label>
                        {((touched.passwordConfirm && errors.passwordConfirm) || (submitCount > 0 && errors.passwordConfirm)) && (
                          <div className="invalid-feedback">{errors.passwordConfirm}</div>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="btn btn-outline-primary w-100 py-3 fw-semibold btn-lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? t('signup.creating') : t('signup.submit')}
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;