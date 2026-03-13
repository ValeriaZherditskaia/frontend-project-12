// Общие кнопки

import { Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const ModalButtons = ({
  onCancel,
  onConfirm,
  confirmVariant = 'primary',
  confirmText,
  cancelText = 'modals.cancel',
  isLoading = false,
  loadingText = 'modals.saving',
}) => {
  const { t } = useTranslation()

  return (
    <div className="d-flex justify-content-end gap-2">
      <Button
        variant="secondary"
        onClick={onCancel}
        disabled={isLoading}
      >
        {t(cancelText)}
      </Button>
      <Button
        variant={confirmVariant}
        onClick={onConfirm}
        disabled={isLoading}
      >
        {isLoading ? t(loadingText) : confirmText}
      </Button>
    </div>
  )
}

export default ModalButtons
