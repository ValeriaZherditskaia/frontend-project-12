import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import useAutoResize from '../hooks/useAutoResize.js'
import useSendMessage from '../hooks/useSendMessage.js'
import FormTextarea from './FormTextarea.jsx'
import SendIcon from './SendIcon.jsx'

function MessageForm() {
  const { t } = useTranslation()
  const [messageText, setMessageText] = useState('')
  const { sendMessage, sending } = useSendMessage()

  const textareaRef = useAutoResize(messageText)

  const handleChange = useCallback((e) => {
    setMessageText(e.target.value)
  }, [])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      const success = await sendMessage(messageText)
      if (success) {
        setMessageText('')
        setTimeout(() => textareaRef.current?.focus(), 0)
      }
    },
    [sendMessage, messageText, textareaRef],
  )

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit(e)
      }
    },
    [handleSubmit],
  )

  const isDisabled = sending || !messageText.trim()

  return (
    <div className="message-form-container">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <FormTextarea
            ref={textareaRef}
            value={messageText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={sending}
            placeholder={t('chat.enterMessage')}
            aria-label={t('chat.newMessage')}
          />
          <button
            type="submit"
            className="btn btn-primary send-button"
            disabled={isDisabled}
          >
            {sending
              ? (
                  <span className="spinner-border spinner-border-sm" />
                )
              : (
                  <SendIcon />
                )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MessageForm
