import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { fetchMessages, addMessage } from '../slices/uiSlice.js'
import { fetchChannels } from '../slices/channelsSlice.js'
import { initSocket, setConnected } from '../slices/socketSlice.js'
import ChannelsList from './channels/ChannelsList.jsx'
import ChatHeader from './ChatHeader.jsx'
import MessagesList from './MessagesList.jsx'
import MessageForm from './MessageForm.jsx'
import ChannelModal from './modals/ChannelModal.jsx'

function AppLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const socket = useSelector(state => state.socket.socket)
  // connected не используется, но можно оставить для возможного отображения статуса

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    dispatch(fetchChannels())
    dispatch(fetchMessages())
    dispatch(initSocket())
  }, [dispatch, navigate])

  useEffect(() => {
    if (!socket) return

    const handleConnect = () => {
      console.log('✅ Socket connected')
      dispatch(setConnected(true))
      toast.success(t('notifications.socket.connected'))
    }

    const handleDisconnect = () => {
      console.log('❌ Socket disconnected')
      dispatch(setConnected(false))
      toast.warn(t('notifications.socket.disconnected'))
    }

    const handleNewMessage = (message) => {
      console.log('📨 Новое сообщение через сокет:', message)
      dispatch(addMessage(message))
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('newMessage', handleNewMessage)

    if (socket.connected) {
      dispatch(setConnected(true))
    }

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('newMessage', handleNewMessage)
    }
  }, [socket, dispatch, t])

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
