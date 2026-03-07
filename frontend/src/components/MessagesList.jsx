import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

function MessagesList() {
  const { t } = useTranslation();
  const { messages } = useSelector((state) => state.ui);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-grow-1 mb-3 overflow-auto border rounded p-3 bg-light h-100 position-relative">
      {messages.length === 0 ? (
        <p className="text-muted mb-0 text-center mt-5">
          {t('chat.noMessages', 'Сообщений пока нет')}
        </p>
      ) : (
        messages.map((message) => (
          <div key={message.id} className="mb-2 p-2 bg-white rounded shadow-sm">
            <strong className="text-primary me-2">{message.username}</strong>
            <span>{message.body}</span>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessagesList;
