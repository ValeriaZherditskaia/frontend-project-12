import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Profanity from 'leo-profanity'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const API_URL = '/api/v1/messages'

const useSendMessage = () => {
  const { t } = useTranslation()
  const [sending, setSending] = useState(false)

  const { currentChannelId: activeChannelId } = useSelector(
    state => state.channels,
  )

  const username = localStorage.getItem('username') || t('app.guest')
  const token = localStorage.getItem('token')

  const sendMessage = useCallback(
    async (text) => {
      const trimmedText = text.trim()
      if (!trimmedText || !activeChannelId) return false

      const cleanedText = Profanity.clean(trimmedText)

      try {
        setSending(true)
        await axios.post(
          API_URL,
          {
            text: cleanedText,
            channelId: activeChannelId,
            username,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        )
        toast.success(t('notifications.messages.added'))
        return true
      }
      catch (error) {
        const status = error.response?.status
        toast.error(
          t(`notifications.error.${status === 401 ? 'server' : 'network'}`),
        )
        return false
      }
      finally {
        setSending(false)
      }
    },
    [activeChannelId, username, token, t],
  )

  return { sendMessage, sending }
}

export default useSendMessage
