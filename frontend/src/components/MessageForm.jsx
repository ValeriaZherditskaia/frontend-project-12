import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { fetchMessages } from '../slices/uiSlice.js';

function MessageForm() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { currentChannelId: activeChannelId } = useSelector(
    (state) => state.channels,
  );

  const username =
    localStorage.getItem('username') || t('app.guest', 'Гость');

  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);

  const sendMessage = useCallback(
    async (e) => {
      e.preventDefault();
      const text = messageText.trim();
      if (!text || !activeChannelId) return;

      try {
        setSending(true);
        const token = localStorage.getItem('token');

        await axios.post(
          '/api/v1/messages',
          {
            body: text,
            channelId: activeChannelId,
            username,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setMessageText('');
        dispatch(fetchMessages());
      } catch (error) {
        // здесь позже можно заменить alert на toast
        // notifications.error.server
        // eslint-disable-next-line no-alert
        alert(
          `Ошибка: ${error.response?.statusText || error.message}`,
        );
      } finally {
        setSending(false);
      }
    },
    [activeChannelId, dispatch, messageText, username],
  );

  return (
    <form onSubmit={sendMessage} className="mt-auto p-3 border-top">
      <div className="input-group">
        <textarea
          className="form-control"
          rows="1"
          style={{ resize: 'none', minHeight: '38px' }}
          placeholder={t('chat.enterMessage', 'Введите сообщение... (Enter)')}
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
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={sending || !messageText.trim()}
        >
          {sending ? '...' : t('chat.send', 'Отправить')}
        </button>
      </div>
    </form>
  );
}

export default MessageForm;
