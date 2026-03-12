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
        title: 'Войти',
        usernamePlaceholder: 'Ваш ник',
        passwordPlaceholder: 'Пароль',
        submit: 'Войти',
        noAccount: 'Нет аккаунта?',
        signupLink: 'Регистрация',
        error: 'ННеверные имя пользователя или пароль',
        loggingIn: 'Вход...',
        validation: {
          username: {
            required: 'Ник обязателен',
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
        usernamePlaceholder: 'Имя пользователя',
        passwordPlaceholder: 'Пароль',
        passwordConfirmPlaceholder: 'Подтвердите пароль',
        submit: 'Зарегистрироваться',
        creating: 'Создание аккаунта...',
        userExists: 'Такой пользователь уже существует',
        serverError: 'Ошибка сервера. Попробуйте позже',
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
        new: '+',
        add: '+',
        remove: 'Удалить',
        rename: 'Переименовать',
        confirmRemove: 'Уверены?',
        removed: 'Канал удалён',
        renamed: 'Канал переименован',
        created: 'Канал создан',
        general: 'general',
      },
      chat: {
        title: 'Сообщения',
        newMessage: 'Новое сообщение',
        send: 'Отправить',
        enterMessage: 'Введите сообщение...',
        messagesCount_zero: '{{count}} сообщений',
        messagesCount_one: '{{count}} сообщение',
        messagesCount_few: '{{count}} сообщения',
        messagesCount_many: '{{count}} сообщений',
        messagesCount_other: '{{count}} сообщений',
      },
      modals: {
        add: 'Добавить канал',
        rename: 'Переименовать канал',
        remove: 'Удалить канал',
        cancel: 'Отменить',
        save: 'Сохранить',
        saving: 'Сохранение...',
        deleting: 'Удаление...',
        channelNamePlaceholder: 'Имя канала',
        unique: 'Должно быть уникальным',
        confirmDelete: 'Уверены?',
        deleteWarning: 'Все сообщения будут удалены.',
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
          network: 'Ошибка соединения',
          loadData: 'Ошибка загрузки данных',
          server: 'Ошибка сервера',
          profanity: 'Нецензурные слова запрещены',
        },
        network: {
          connected: 'Сеть восстановлена',
        },
        socket: {
          connected: 'Подключено к чату',
          disconnected: 'Соединение с сервером потеряно',
        }
      },
      notFound: {
        message: 'Страница не найдена',
        home: 'На главную',
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
      escapeValue: false,
    },
  });

export default i18n;