import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchChannels, fetchMessages } from '../slices/uiSlice.js';

function AppLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    channels,
    messages,
    currentChannelId,
    channelsLoading,
    messagesLoading,
  } = useSelector((state) => state.ui);

  const username = localStorage.getItem('username') || 'Гость';
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = useCallback(async (e) => {
    e.preventDefault();
    const text = messageText.trim();
    if (!text || !currentChannelId) return;

    try {
      setSending(true);

      const token = localStorage.getItem('token');
      
      await axios.post('/api/v1/messages', {
        body: text,
        channelId: currentChannelId,
        username: username,  // ✅ Обязательно!
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessageText('');

      // 🔥 КЛЮЧЕВО: Обнови список после отправки!
      dispatch(fetchMessages());

    } catch (error) {
      console.error('POST error:', error.response);
      alert(`Ошибка: ${error.response?.statusText || error.message}`);
    } finally {
      setSending(false);
    }
  }, [currentChannelId, dispatch, navigate, messageText, username]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    dispatch(fetchChannels());
    dispatch(fetchMessages());
  }, [dispatch, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (channelsLoading || messagesLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  const currentChannel = channels.find((c) => c.id === currentChannelId) || channels[0];

  return (
    <div className="container-fluid h-100 py-3">
      <div className="row h-100">
        <div className="col-4 col-md-3 border-end">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Каналы</h5>
            <button type="button" className="btn btn-sm btn-outline-primary" disabled>+</button>
          </div>
          <ul className="nav flex-column nav-pills">
            {channels.map((channel) => (
              <li key={channel.id} className="nav-item mb-1">
                <button className={`w-100 text-start btn btn-sm rounded-0 ${
                  channel.id === currentChannelId ? 'btn-primary text-white' : 'btn-light'
                }`}>
                  <span className="me-1">#</span>{channel.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-8 col-md-9 d-flex flex-column">
          <header className="mb-3 border-bottom pb-2">
            <h4>{currentChannel ? `#${currentChannel.name}` : 'Канал'}</h4>
            <small className="text-muted">Вы вошли как <strong>{username}</strong></small>
          </header>

          <div className="flex-grow-1 mb-3 overflow-auto border rounded p-3 bg-light" style={{height: '400px'}}>
            {messages.length === 0 ? (
              <p className="text-muted mb-0">Сообщений пока нет</p>
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

          <form onSubmit={sendMessage} className="mt-auto p-3 border-top">
            <div className="input-group">
              <textarea
                className="form-control"
                rows="1"
                style={{resize: 'none', minHeight: '38px'}}
                placeholder="Введите сообщение... (Enter)"
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
                {sending ? '...' : 'Отправить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
