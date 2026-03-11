import { useState, useCallback, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Profanity from 'leo-profanity';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

function MessageForm() {
  const { t } = useTranslation();
  const { currentChannelId: activeChannelId } = useSelector(
    (state) => state.channels
  );

  const username = localStorage.getItem('username') || t('app.guest', 'Гость');
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const textareaRef = useRef(null);

  const sendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      const text = messageText.trim();
      if (!text || !activeChannelId) return;

      if (Profanity.check(text)) {
        toast.error(t('notifications.error.profanity'));
        setMessageText('');
        return;
      }

      try {
        setSending(true);
        const token = localStorage.getItem('token');

        await axios.post(
          '/api/v1/messages',
          {
            text: text,
            channelId: activeChannelId,
            username,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMessageText('');
      } catch (error) {
        const status = error.response?.status;
        toast.error(
          t(`notifications.error.${status === 401 ? 'server' : 'network'}`)
        );
      } finally {
        setSending(false);
      }
    },
    [activeChannelId, messageText, username, t]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [messageText]);

  return (
    <div className="message-form-container">
      <form onSubmit={sendMessage}>
        <div className="input-group">
          <textarea
            ref={textareaRef}
            className="form-control"
            placeholder={t('chat.enterMessage')}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
            maxLength={500}
            disabled={sending}
            rows={1}
            style={{
              resize: 'none',
              overflow: 'hidden',
              minHeight: '38px',
              maxHeight: '120px',
              borderTopRightRadius: '0',
              borderBottomRightRadius: '0',
              borderRight: 'none'
            }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={sending || !messageText.trim()}
            style={{
              width: '38px',
              height: '38px',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderTopLeftRadius: '0',
              borderBottomLeftRadius: '0'
            }}
          >
            {sending ? (
              <span className="spinner-border spinner-border-sm" />
            ) : (
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M2 21L22 12L2 3V10L16 12L2 14V21Z" 
                  fill="currentColor"
                />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MessageForm;