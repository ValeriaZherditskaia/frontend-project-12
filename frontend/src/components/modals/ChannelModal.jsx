import { useDispatch, useSelector } from 'react-redux'
import { Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { chatApi } from '../../services/api'
import {
  useAddChannelMutation,
  useRenameChannelMutation,
  useDeleteChannelMutation,
} from '../../services/api'
import { closeModal, setCurrentChannelId } from '../../slices/uiSlice'
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

  const { modal } = useSelector(state => state.ui)
  const { type, channelId, isOpen } = modal
  const currentChannelId = useSelector(state => state.ui.currentChannelId)

  const [addChannel, { isLoading: isAdding }] = useAddChannelMutation()
  const [renameChannel, { isLoading: isRenaming }] = useRenameChannelMutation()
  const [deleteChannel, { isLoading: isDeleting }] = useDeleteChannelMutation()

  // Получаем список каналов из кеша RTK Query
  const channels = useSelector((state) => {
    const queryData = state[chatApi.reducerPath]?.queries['getChannels(undefined)']
    return queryData?.data || []
  })

  const currentChannel = channels.find(c => c.id === channelId)

  const handleClose = () => {
    dispatch(closeModal())
  }

  const handleAdd = async (name) => {
    try {
      const newChannel = await addChannel(name).unwrap()
      dispatch(setCurrentChannelId(newChannel.id))
      toast.success(t('notifications.channels.created'))
      handleClose()
    }
    catch {
      toast.error(t('notifications.error.server'))
    }
  }

  const handleRename = async (name) => {
    try {
      await renameChannel({ id: channelId, name }).unwrap()
      toast.success(t('notifications.channels.renamed'))
      handleClose()
    }
    catch {
      toast.error(t('notifications.error.server'))
    }
  }

  const handleDelete = async () => {
    try {
      await deleteChannel(channelId).unwrap()
      if (currentChannelId === channelId) {
        dispatch(setCurrentChannelId(1)) // переключаем на general
      }
      toast.success(t('notifications.channels.removed'))
      handleClose()
    }
    catch {
      toast.error(t('notifications.error.server'))
    }
  }

  if (!isOpen) return null

  const modalTitle = type === 'remove'
    ? t('modals.remove')
    : t(MODAL_TITLES[type])

  const isLoading = isAdding || isRenaming || isDeleting

  return (
    <Modal show={isOpen} onHide={handleClose} centered size="sm">
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {type === 'add' && (
          <AddChannelForm
            onSubmit={handleAdd}
            onCancel={handleClose}
            isLoading={isLoading}
          />
        )}

        {type === 'rename' && (
          <RenameChannelForm
            channel={currentChannel}
            onSubmit={handleRename}
            onCancel={handleClose}
            isLoading={isLoading}
          />
        )}

        {type === 'remove' && (
          <DeleteChannelDialog
            channel={currentChannel}
            onConfirm={handleDelete}
            onCancel={handleClose}
            isLoading={isLoading}
          />
        )}
      </Modal.Body>
    </Modal>
  )
}

export default ChannelModal
