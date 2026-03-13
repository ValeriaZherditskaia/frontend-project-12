// Основной

import { useDispatch, useSelector } from 'react-redux'
import { Modal, Alert } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import {
  closeModal,
  createChannel,
  renameChannel,
  deleteChannel,
  clearError,
} from '../../slices/channelsSlice.js'
import AddChannelForm from './AddChannelForm.jsx'
import RenameChannelForm from './RenameChannelForm.jsx'
import DeleteChannelDialog from './DeleteChannelDialog.jsx'

const MODAL_TITLES = {
  add: 'modals.add',
  rename: 'modals.rename',
  remove: 'modals.remove',
}

function ChannelModal() {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    modal: { type, channelId, isOpen },
    error,
    loading,
    entities: channels,
  } = useSelector(state => state.channels)

  const currentChannel = channels.find(c => c.id === channelId)

  const handleClose = () => {
    dispatch(closeModal())
  }

  const handleAdd = async (name) => {
    console.log('📤 Sending channel name to server:', name)
    try {
      const result = await dispatch(createChannel(name)).unwrap()
      console.log('📥 Channel created, received from server:', result)
      handleClose()
    }
    catch (err) {
      console.error('❌ Add error:', err)
    }
  }

  const handleRename = async (name) => {
    try {
      await dispatch(renameChannel({ id: channelId, name })).unwrap()
      handleClose()
    }
    catch (err) {
      console.error('Rename error:', err)
    }
  }

  const handleDelete = async () => {
    try {
      await dispatch(deleteChannel(channelId)).unwrap()
      handleClose()
    }
    catch (err) {
      console.error('Delete error:', err)
    }
  }

  if (!isOpen) return null

  const modalTitle = type === 'remove'
    ? t('modals.remove')
    : t(MODAL_TITLES[type])

  return (
    <Modal show={isOpen} onHide={handleClose} centered size="sm">
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && (
          <Alert
            variant="danger"
            dismissible
            onClose={() => dispatch(clearError())}
          >
            {error}
          </Alert>
        )}

        {type === 'add' && (
          <AddChannelForm
            onSubmit={handleAdd}
            onCancel={handleClose}
            isLoading={loading}
          />
        )}

        {type === 'rename' && (
          <RenameChannelForm
            channel={currentChannel}
            onSubmit={handleRename}
            onCancel={handleClose}
            isLoading={loading}
          />
        )}

        {type === 'remove' && (
          <DeleteChannelDialog
            channel={currentChannel}
            onConfirm={handleDelete}
            onCancel={handleClose}
            isLoading={loading}
          />
        )}
      </Modal.Body>
    </Modal>
  )
}

export default ChannelModal
