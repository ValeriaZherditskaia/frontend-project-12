import { Formik, Form, Field } from 'formik';

function LoginPage() {
  return (
    <div className="h-100 bg-light">
      {/* Центрирующий контейнер */}
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-12 col-md-6 col-lg-4">
            
            {/* Карточка формы */}
            <div className="card shadow">
              <div className="card-body p-5">
                <h1 className="h3 mb-4 text-center">Вход</h1>
                
                {/* Formik форма */}
                <Formik
                  initialValues={{ username: '', password: '' }}
                  onSubmit={(values) => {
                    console.log('Login form submitted:', values);
                  }}
                >
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">
                        Имя пользователя
                      </label>
                      <Field
                        id="username"
                        name="username"
                        type="text"
                        className="form-control"
                        autoComplete="username"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Пароль
                      </label>
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        className="form-control"
                        autoComplete="current-password"
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                      Войти
                    </button>
                  </Form>
                </Formik>

                <div className="text-center mt-4">
                  <a href="/" className="text-decoration-none">
                    На главную
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
