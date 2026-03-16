import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { fetchMessages, addMessage } from '../slices/uiSlice.js'
import { fetchChannels } from '../slices/channelsSlice.js'
import { connectSocket, disconnectSocket } from '../services/socket.js'
import ChannelsList from './channels/ChannelsList.jsx'
import ChatHeader from './ChatHeader.jsx'
import MessagesList from './MessagesList.jsx'
import MessageForm from './MessageForm.jsx'
import ChannelModal from './modals/ChannelModal.jsx'

function AppLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    dispatch(fetchChannels())
    dispatch(fetchMessages())

    const socket = connectSocket(token)

    const handleConnect = () => {
      toast.success(t('notifications.socket.connected'))
    }

    const handleDisconnect = () => {
      toast.warn(t('notifications.socket.disconnected'))
    }

    const handleNewMessage = (message) => {
      dispatch(addMessage(message))
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('newMessage', handleNewMessage)

    if (socket.connected) {
      handleConnect()
    }

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('newMessage', handleNewMessage)
      disconnectSocket()
    }
  }, [dispatch, navigate, t])

  return (
    <div className="chat-container">
      <div className="card">
        <div className="card-body d-flex">
          <aside className="channels-panel">
            <ChannelsList />
          </aside>
          <section className="chat-main">
            <ChatHeader />
            <MessagesList />
            <MessageForm />
          </section>
        </div>
      </div>
      <ChannelModal />
    </div>
  )
}

export default AppLayout