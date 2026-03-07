import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      app: {
        name: 'Hexlet Chat',
        logout: 'Выйти',
      },
      login: {
        title: 'Вход',
        username: 'Имя пользователя',
        password: 'Пароль',
        submit: 'Войти',
        signupLink: 'Нет аккаунта? Зарегистрироваться',
        error: 'Неверное имя пользователя или пароль',
        loggingIn: 'Вход...',
        validation: {
          username: {
            required: 'Имя пользователя обязательно',
            min: 'От 3 символов',
          },
          password: {
            required: 'Пароль обязателен',
            min: 'От 6 символов',
          },
        },
      },
      signup: {
        title: 'Регистрация',
        username: 'Имя пользователя',
        password: 'Пароль',
        passwordConfirm: 'Подтверждение пароля',
        submit: 'Зарегистрироваться',
        loginLink: 'Уже есть аккаунт? Войти',
        userExists: 'Пользователь с таким именем уже существует',
        serverError: 'Ошибка сервера. Попробуйте позже',
        creating: 'Создание аккаунта...',
        validation: {
          username: {
            min: 'От 3 до 20 символов',
            max: 'От 3 до 20 символов',
            pattern: 'Только буквы, цифры, _, -',
            required: 'Имя пользователя обязательно',
          },
          password: {
            min: 'Не менее 6 символов',
            required: 'Пароль обязателен',
          },
          passwordConfirm: {
            required: 'Подтвердите пароль',
            mismatch: 'Пароли должны совпадать',
          },
        },
      },
      channels: {
        title: 'Каналы',
        new: 'Новый канал',
        remove: 'Удалить канал',
        rename: 'Переименовать',
        confirmRemove: 'Уверены?',
        removed: 'Канал удалён',
        renamed: 'Канал переименован',
        general: 'general',
      },
      chat: {
        title: 'Сообщения',
        newMessage: 'Новое сообщение',
        send: 'Отправить',
        enterMessage: 'Введите сообщение...',
      },
      modals: {
        add: 'Добавить канал',
        errors: {
          required: 'Обязательное для заполнения',
          unique: 'Должно быть уникальным',
          min: 'Не менее 3 символов',
          max: 'Не более 20 символов',
        },
        submit: 'Отправить',
        cancel: 'Отменить',
      },
      notifications: {
        channels: {
          created: 'Канал создан',
          renamed: 'Канал переименован',
          removed: 'Канал удалён',
        },
        messages: {
          added: 'Сообщение добавлено',
        },
        error: {
          network: 'Нет сети. Подключитесь и обновите страницу',
          loadData: 'Ошибка загрузки данных',
          server: 'Ошибка сервера',
        },
        network: {
          connected: 'Сеть восстановлена',
        },
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru',
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false, // React сам экранирует
    },
  });

export default i18n;
