# Hexlet Chat

**Публичная ссылка:** [https://frontend-project-12-g9bt.onrender.com](https://frontend-project-12-g9bt.onrender.com)

### Hexlet tests and linter status:
[![Actions Status](https://github.com/ValeriaZherditskaia/frontend-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/ValeriaZherditskaia/frontend-project-12/actions)

[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=ValeriaZherditskaia_frontend-project-12&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=ValeriaZherditskaia_frontend-project-12)

## Описание

Hexlet Chat — это упрощённый аналог Slack-чата, разработанный в рамках дипломного проекта на Хекслете. Приложение позволяет общаться в реальном времени, создавать и управлять каналами, а также регистрироваться и авторизоваться.

**Основные возможности:**

- Авторизация и регистрация пользователей (JWT)
- Обмен сообщениями в реальном времени через WebSocket (Socket.IO)
- Создание, переименование и удаление каналов
- Фильтрация нецензурных слов в сообщениях и названиях каналов
- Уведомления о действиях и ошибках (toast-сообщения)
- Интернационализация (русский язык)
- Логирование ошибок через Rollbar
- Адаптивный интерфейс на React Bootstrap

Проект полностью повторяет функциональность и внешний вид [демо-приложения](https://frontend-chat-ru.hexlet.app/).

## Технологический стек

- **Frontend:** React, Redux Toolkit, React Router, Formik, Yup
- **Real-time:** Socket.IO (client)
- **UI:** React Bootstrap, Bootstrap 5, React Icons
- **HTTP-клиент:** Axios
- **Интернационализация:** i18next, react-i18next
- **Уведомления:** React Toastify
- **Фильтрация:** leo-profanity (с русским словарём)
- **Логирование ошибок:** Rollbar, @rollbar/react
- **Сборка и разработка:** Vite, ESLint
- **Деплой:** Render (PaaS)

## Установка и запуск

```
# Клонировать репозиторий
git clone https://github.com/ValeriaZherditskaia/frontend-project-12.git
cd frontend-project-12

# Установить зависимости (корневые и клиентские)
make install

# Собрать фронтенд
make build

# Запустить сервер (порт 5001) с раздачей статики
make start
```