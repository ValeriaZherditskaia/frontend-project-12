// Диалог удаления

import { useTranslation } from 'react-i18next'
import ModalButtons from './ModalButtons.jsx'

const DeleteChannelDialog = ({ onConfirm, onCancel, isLoading }) => {
  const { t } = useTranslation()

  return (
    <>
      <p className="mb-3">
        {t('modals.confirmDelete', 'Уверены?')}
      </p>
      <ModalButtons
        onCancel={onCancel}
        onConfirm={onConfirm}
        confirmVariant="danger"
        confirmText={t('channels.remove', 'Удалить')}
        cancelText="modals.cancel"
        isLoading={isLoading}
        loadingText="modals.deleting"
      />
    </>
  )
}

export default DeleteChannelDialog
