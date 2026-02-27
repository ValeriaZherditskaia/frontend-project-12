import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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

  const username = localStorage.getItem('username');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Загружаем данные чата из API
    dispatch(fetchChannels());
    dispatch(fetchMessages());
  }, [dispatch, navigate]);

  if (channelsLoading || messagesLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка чата...</span>
        </div>
      </div>
    );
  }

  const currentChannel =
    channels.find((c) => c.id === currentChannelId) || channels[0];

  return (
    <div className="container-fluid h-100 py-3">
      <div className="row h-100">
        {/* Левый блок: каналы */}
        <div className="col-4 col-md-3 border-end">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Каналы</h5>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              disabled
            >
              +
            </button>
          </div>

          <ul className="nav flex-column nav-pills">
            {channels.map((channel) => (
              <li key={channel.id} className="nav-item mb-1">
                <button
                  type="button"
                  className={`w-100 text-start btn btn-sm ${
                    channel.id === currentChannelId
                      ? 'btn-primary text-white'
                      : 'btn-light'
                  }`}
                >
                  <span className="me-1">#</span>
                  {channel.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Правый блок: чат */}
        <div className="col-8 col-md-9 d-flex flex-column">
          <header className="mb-3 border-bottom pb-2">
            <h4 className="mb-1">
              {currentChannel ? `# ${currentChannel.name}` : 'Выберите канал'}
            </h4>
            <small className="text-muted">
              Вы вошли как <strong>{username}</strong>
            </small>
          </header>

          {/* Сообщения */}
          <div className="flex-grow-1 mb-3 overflow-auto border rounded p-3 bg-light">
            {messages.length === 0 ? (
              <p className="text-muted mb-0">Сообщений пока нет.</p>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="mb-2">
                  <strong>{message.username}</strong>
                  {': '}
                  {message.body}
                </div>
              ))
            )}
          </div>

          {/* Форма ввода (пока без логики отправки) */}
          <form className="mt-auto">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Введите сообщение..."
                disabled
              />
              <button type="submit" className="btn btn-primary" disabled>
                Отправить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
