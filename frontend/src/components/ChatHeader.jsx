import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useGetChannelsQuery, useGetMessagesQuery } from '../services/api'

function ChatHeader() {
  const { t } = useTranslation()
  const { data: channels = [] } = useGetChannelsQuery()
  const { data: messages = [] } = useGetMessagesQuery()
  const currentChannelId = useSelector(state => state.ui.currentChannelId)

  const currentChannel = channels.find(c => c.id === currentChannelId) || channels[0]
  const count = messages.filter(msg => msg.channelId === currentChannelId).length

  return (
    <header className="p-3 border-bottom d-flex justify-content-between align-items-center" style={{ background: '#f8f9fa' }}>
      <div>
        <h1 className="h5 mb-0 fw-normal" style={{ color: '#212529' }}>
          #
          {' '}
          {currentChannel?.name}
        </h1>
        <span className="small text-secondary d-block m-0">
          {t('chat.messagesCount', { count })}
        </span>
      </div>
    </header>
  )
}

export default ChatHeader
