import { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Profanity from 'leo-profanity';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { fetchMessages } from '../slices/uiSlice.js';

function MessageForm() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { currentChannelId: activeChannelId } = useSelector((state) => state.channels);

  const username = localStorage.getItem('username') || t('app.guest', 'Гость');
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const textareaRef = useRef(null);

  const sendMessage = useCallback(async (e) => {
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
      await axios.post('/api/v1/messages', {
        body: text,
        channelId: activeChannelId,
        username,
      }, { headers: { Authorization: `Bearer ${token}` } });

      setMessageText('');
      dispatch(fetchMessages());
    } catch (error) {
      const status = error.response?.status;
      toast.error(t(`notifications.error.${status === 401 ? 'server' : 'network'}`));
    } finally {
      setSending(false);
    }
  }, [activeChannelId, dispatch, messageText, username, t]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [messageText]);

  return (
    <form onSubmit={sendMessage} className="message-form-container">
      <div className="input-group">
        <textarea
          ref={textareaRef}
          className="form-control flex-grow-1"
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
          style={{ resize: 'none', overflow: 'hidden', minHeight: '38px', maxHeight: '120px' }}
        />
        <button
          type="submit"
          className="btn btn-primary flex-shrink-0 ms-2"
          disabled={sending || !messageText.trim()}
        >
          {sending ? (
            <span className="spinner-border spinner-border-sm me-1" />
          ) : (
            t('chat.send')
          )}
        </button>
      </div>
    </form>
  );
}

export default MessageForm;
