import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

/**
 * Хук для toast-уведомлений с i18n
 * @returns {Object} success, error, networkError, loadError
 */
export const useToast = () => {
  const { t } = useTranslation()

  const success = (key) => {
    toast.success(t(key), {
      position: 'top-right',
      autoClose: 3000,
    })
  }

  const error = (key, fallback = 'Неизвестная ошибка') => {
    toast.error(t(key) || fallback, {
      position: 'top-right',
      autoClose: 5000,
    })
  }

  const networkError = () => error('notifications.error.network')
  const loadError = () => error('notifications.error.loadData')
  const serverError = () => error('notifications.error.server')

  return {
    success,
    error,
    networkError,
    loadError,
    serverError,
  }
}
