import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

/**
 * Хук для toast-уведомлений с i18n
 * @returns {Object} success, error, networkError, loadError
 */
export const useToast = () => {
  const { t } = useTranslation();

  // Success: зелёный toast (канал создан/удалён)
  const success = (key) => {
    toast.success(t(key), {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  // Error: красный toast (ошибки API/валидация)
  const error = (key, fallback = 'Неизвестная ошибка') => {
    toast.error(t(key) || fallback, {
      position: 'top-right',
      autoClose: 5000,
    });
  };

  // Специальные ошибки
  const networkError = () => error('notifications.error.network');
  const loadError = () => error('notifications.error.loadData');
  const serverError = () => error('notifications.error.server');

  return {
    success,
    error,
    networkError,
    loadError,
    serverError,
  };
};
