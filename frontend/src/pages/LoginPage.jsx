import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Formik, Form, Field } from 'formik'
import * as yup from 'yup'
import axios from 'axios'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { setCredentials } from '../slices/authSlice'

function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [error, setError] = useState('')
  const { t } = useTranslation()

  const validationSchema = yup.object({
    username: yup.string().required(t('login.validation.username.required')),
    password: yup.string().required(t('login.validation.password.required')),
  })

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body p-5">
              <h2 className="h4 fw-normal mb-4 text-center text-dark">
                {t('login.title')}
              </h2>

              <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={validationSchema}
                validateOnMount={false}
                validateOnBlur={true}
                validateOnChange={false}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    setError('')
                    const response = await axios.post('/api/v1/login', {
                      username: values.username,
                      password: values.password,
                    })

                    dispatch(setCredentials({
                      token: response.data.token,
                      username: response.data.username,
                    }))

                    navigate('/')
                  }
                  catch (err) {
                    setError(t('login.error'))
                    console.error('Login error:', err.response?.data)
                  }
                  finally {
                    setSubmitting(false)
                  }
                }}
              >
                {({ isSubmitting, errors, touched, submitCount }) => (
                  <Form noValidate>
                    {error && (
                      <div className="alert alert-danger mb-4" role="alert">
                        {error}
                      </div>
                    )}

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
                      <label htmlFor="username">{t('login.usernamePlaceholder')}</label>
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
                        autoComplete="current-password"
                        disabled={isSubmitting}
                      />
                      <label htmlFor="password">{t('login.passwordPlaceholder')}</label>
                      {((touched.password && errors.password) || (submitCount > 0 && errors.password)) && (
                        <div className="invalid-feedback">{errors.password}</div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="btn btn-outline-primary w-100 py-3 fw-semibold btn-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? `${t('login.submit')}...` : t('login.submit')}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>

            <div className="card-footer p-4 bg-light">
              <div className="text-center">
                <span className="text-muted">
                  {t('login.noAccount')}
                  {' '}
                </span>
                <Link to="/signup" className="text-primary text-decoration-none fw-semibold">
                  {t('login.signupLink')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
