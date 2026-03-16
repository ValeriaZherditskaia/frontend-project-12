import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import Profanity from 'leo-profanity'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useSendMessageMutation } from '../services/api'

const useSendMessage = () => {
  const { t } = useTranslation()
  const [sendMessage, { isLoading }] = useSendMessageMutation()

  const activeChannelId = useSelector(state => state.ui.currentChannelId)
  const username = localStorage.getItem('username') || t('app.guest')

  const sendMessageFn = useCallback(
    async (text) => {
      const trimmedText = text.trim()
      if (!trimmedText || !activeChannelId) return false

      const cleanedText = Profanity.clean(trimmedText)

      try {
        await sendMessage({
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
    },
    [activeChannelId, username, t, sendMessage],
  )

  return { sendMessage: sendMessageFn, sending: isLoading }
}

export default useSendMessage
