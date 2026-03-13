import { toast } from 'react-toastify'
import i18n from '../../i18n.js'

// Карта: тип экшена → ключ перевода
const TOAST_CONFIG = {
  // Успешные операции с каналами
  'channels/createChannel/fulfilled': 'notifications.channels.created',
  'channels/renameChannel/fulfilled': 'notifications.channels.renamed',
  'channels/deleteChannel/fulfilled': 'notifications.channels.removed',

  // Ошибки операций с каналами
  'channels/createChannel/rejected': 'notifications.error.server',
  'channels/renameChannel/rejected': 'notifications.error.server',
  'channels/deleteChannel/rejected': 'notifications.error.server',

  // Ошибки загрузки начальных данных
  'channels/fetchChannels/rejected': 'notifications.error.loadData',
  'ui/fetchMessages/rejected': 'notifications.error.loadData',
}

export const toastMiddleware = () => next => (action) => {
  const result = next(action)

  if (TOAST_CONFIG[action.type]) {
    const messageKey = TOAST_CONFIG[action.type]
    const isSuccess = action.type.endsWith('/fulfilled')

    const text = i18n.t(messageKey)

    toast[isSuccess ? 'success' : 'error'](text, {
      toastId: action.type,
      position: 'top-right',
      autoClose: isSuccess ? 3000 : 5000,
    })
  }

  return result
}
