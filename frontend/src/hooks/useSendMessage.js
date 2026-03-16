import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import Profanity from 'leo-profanity'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useSendMessageMutation } from '../services/api'

const useSendMessage = () => {
  const { t } = useTranslation()
  const [sending, setSending] = useState(false)
  const [sendMessageMutation] = useSendMessageMutation()

  const activeChannelId = useSelector(state => state.ui.currentChannelId)
  const username = localStorage.getItem('username') || t('app.guest')

  const sendMessage = useCallback(
    async (text) => {
      const trimmedText = text.trim()
      if (!trimmedText || !activeChannelId) return false

      const cleanedText = Profanity.clean(trimmedText)

      try {
        setSending(true)
        await sendMessageMutation({
          text: cleanedText,
          channelId: activeChannelId,
          username,
        }).unwrap()
        toast.success(t('notifications.messages.added'))
        return true
      }
      catch {
        toast.error(t('notifications.error.network'))
        return false
      }
      finally {
        setSending(false)
      }
    },
    [activeChannelId, username, t, sendMessageMutation],
  )

  return { sendMessage, sending }
}

export default useSendMessage
