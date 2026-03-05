import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ChannelModal from './ChannelModal.jsx';
import { fetchChannels, fetchMessages } from '../slices/uiSlice.js';
import { setCurrentChannelId, openModal } from '../slices/channelsSlice.js';

function AppLayout() {
  const dispatch = useDispatch();

  const {
    _channels,
    messages,
    currentChannelId: _uiCurrentChannelId,
    channelsLoading,
    messagesLoading,
  } = useSelector((state) => state.ui);

  const { 
    entities: channelsList,
    currentChannelId: activeChannelId,
    loading: channelsLoadingChannels 
  } = useSelector((state) => state.channels);

  const username = localStorage.getItem('username') || 'Гость';
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (activeChannelId) {
      dispatch(fetchMessages());
    }
  }, [activeChannelId, dispatch]);

  const sendMessage = useCallback(async (e) => {
    e.preventDefault();
    const text = messageText.trim();
    if (!text || !activeChannelId) return;

    try {
      setSending(true);
      const token = localStorage.getItem('token');
      
      await axios.post('/api/v1/messages', {
        body: text,
        channelId: activeChannelId,
        username: username,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessageText('');
      dispatch(fetchMessages());

    } catch (error) {
      console.error('POST error:', error.response);
      alert(`Ошибка: ${error.response?.statusText || error.message}`);
    } finally {
      setSending(false);
    }
  }, [activeChannelId, dispatch, messageText, username]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    dispatch(fetchChannels());
    dispatch(fetchMessages());
  }, [dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (channelsLoading || messagesLoading || channelsLoadingChannels) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  const currentChannel = channelsList.find((c) => c.id === activeChannelId) || channelsList[0];

  const handleChannelClick = (e, channelId) => {
    e.stopPropagation();  // 🔥 Предотвращаем закрытие dropdown
    dispatch(setCurrentChannelId(channelId));
  };

  const handleMenuAction = (actionType, channelId) => {
    dispatch(openModal({ type: actionType, channelId }));
    // Закрываем dropdown
    const dropdowns = document.querySelectorAll('.dropdown-menu.show');
    dropdowns.forEach(dropdown => dropdown.classList.remove('show'));
  };

  return (
    <>
      <div className="container-fluid h-100 py-3">
        <div className="row h-100">
          {/* 🔥 ЛЕВЫЙ БЛОК — ИСПРАВЛЕННЫЙ */}
          <div className="col-4 col-md-3 border-end px-0">
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
              <h6 className="mb-0 fw-bold text-primary">Каналы</h6>
              <button 
                type="button"
                className="btn btn-primary btn-sm px-2 py-1"
                onClick={() => dispatch(openModal({ type: 'add' }))}
                disabled={channelsLoadingChannels}
              >
                <i className="bi bi-plus me-1"></i>
                Новый
              </button>
            </div>

            {/* 🔥 СПИСОК КАНАЛОВ — нормальные отступы */}
            <ul className="nav flex-column nav-pills p-2" style={{gap: '0.25rem'}}>
              {channelsList.map((channel) => (
                <li key={channel.id} className="nav-item w-100">
                  <div className="dropdown w-100">
                    {/* 🔥 КНОПКА КАНАЛА */}
                    <button
                      className={`w-100 text-start btn btn-sm rounded-0 text-truncate py-2 px-3 ${
                        channel.id === activeChannelId
                          ? 'btn-primary text-white shadow-sm'
                          : 'btn-light border hover-shadow'
                      }`}
                      type="button"
                      onClick={(e) => handleChannelClick(e, channel.id)}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span className="me-2">#</span>
                      <span className="text-truncate d-inline-block flex-grow-1" style={{maxWidth: '85%'}}>
                        {channel.name}
                      </span>
                    </button>
                    
                    {/* 🔥 DROPDOWN МЕНЮ — ВОТ ОНО! */}
                    <ul className="dropdown-menu w-100 shadow border-0 mt-1">
                      <li>
                        <button 
                          type="button"
                          className="dropdown-item d-flex align-items-center"
                          onClick={() => handleMenuAction('rename', channel.id)}
                        >
                          <i className="bi bi-pencil-square me-2 text-primary"></i>
                          Переименовать
                        </button>
                      </li>
                      {channel.removable && (
                        <li>
                          <button 
                            type="button"
                            className="dropdown-item d-flex align-items-center text-danger"
                            onClick={() => handleMenuAction('remove', channel.id)}
                          >
                            <i className="bi bi-trash3 me-2"></i>
                            Удалить
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* ПРАВЫЙ БЛОК: ЧАТ */}
          <div className="col-8 col-md-9 d-flex flex-column">
            <header className="mb-3 border-bottom pb-2">
              <h4>{currentChannel ? `#${currentChannel.name}` : 'Канал'}</h4>
              <small className="text-muted">Вы вошли как <strong>{username}</strong></small>
            </header>

            {/* 🔥 ЧАТ — АДАПТИВНАЯ ВЫСОТА */}
            <div className="flex-grow-1 mb-3 overflow-auto border rounded p-3 bg-light h-100 position-relative">
              {messages.length === 0 ? (
                <p className="text-muted mb-0 text-center mt-5">Сообщений пока нет</p>
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
      <ChannelModal />
    </>
  );
}

export default AppLayout;
