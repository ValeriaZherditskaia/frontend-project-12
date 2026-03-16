import { useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import { useGetMessagesQuery } from '../services/api'

function MessagesList() {
  const { data: messages = [] } = useGetMessagesQuery()
  const currentChannelId = useSelector(state => state.ui.currentChannelId)
  const messagesEndRef = useRef(null)

  const currentMessages = messages
    .filter(msg => Number(msg.channelId) === Number(currentChannelId))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

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
