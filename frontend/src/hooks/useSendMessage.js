// Хук для отправки сообщений

import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Profanity from 'leo-profanity';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const API_URL = '/api/v1/messages';
const MAX_MESSAGE_LENGTH = 500;

const useSendMessage = () => {
  const { t } = useTranslation();
  const [sending, setSending] = useState(false);
  
  const { currentChannelId: activeChannelId } = useSelector(
    (state) => state.channels
  );
  
  const username = localStorage.getItem('username') || t('app.guest', 'Гость');
  const token = localStorage.getItem('token');

  const sendMessage = useCallback(
    async (text) => {
      const trimmedText = text.trim();
      if (!trimmedText || !activeChannelId) return false;

      if (Profanity.check(trimmedText)) {
        toast.error(t('notifications.error.profanity'));
        return false;
      }

      try {
        setSending(true);
        await axios.post(
          API_URL,
          {
            text: trimmedText,
            channelId: activeChannelId,
            username,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return true;
      } catch (error) {
        const status = error.response?.status;
        toast.error(
          t(`notifications.error.${status === 401 ? 'server' : 'network'}`)
        );
        return false;
      } finally {
        setSending(false);
      }
    },
    [activeChannelId, username, token, t]
  );

  return { sendMessage, sending };
};

export default useSendMessage;