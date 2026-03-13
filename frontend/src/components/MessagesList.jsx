import { useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'

function MessagesList() {
  const messages = useSelector(state => state.ui.messages || [])
  const currentChannelId = useSelector(state => state.channels.currentChannelId)
  const messagesEndRef = useRef(null)

  // Фильтруем сообщения по текущему каналу и сортируем по времени
  const currentMessages = messages
    .filter(msg => Number(msg.channelId) === Number(currentChannelId))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

  // Автоскролл к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages])

  return (
    <div className="messages-scrollable">
      {currentMessages.map(msg => (
        <div key={msg.id} className="message-item">
          <strong>
            {msg.username}
            :
          </strong>
          <span className="ms-1">{msg.text}</span>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessagesList
