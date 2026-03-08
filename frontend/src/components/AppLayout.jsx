import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import i18n from '../i18n.js';
import { fetchChannels, fetchMessages } from '../slices/uiSlice.js';
import ChannelsList from './ChannelsList.jsx';
import ChatHeader from './ChatHeader.jsx';
import MessagesList from './MessagesList.jsx';
import MessageForm from './MessageForm.jsx';
import ChannelModal from './ChannelModal.jsx';

function AppLayout() {
  const dispatch = useDispatch();

  const { channelsLoading, messagesLoading } = useSelector((state) => state.ui);
  const { loading: channelsLoadingChannels } = useSelector((state) => state.channels);

  // toast при потере / восстановлении сети
  useEffect(() => {
    const handleOffline = () => {
      toast.error(i18n.t('notifications.error.network'), {
        toastId: 'network-offline',
        position: 'top-right',
        autoClose: 5000,
      });
    };

    const handleOnline = () => {
      toast.success(
        i18n.t('notifications.network.connected', 'Сеть восстановлена'),
        {
          toastId: 'network-online',
          position: 'top-right',
          autoClose: 3000,
        },
      );
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // загрузка каналов и сообщений после проверки токена
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    dispatch(fetchChannels());
    dispatch(fetchMessages());
  }, [dispatch]);

  if (channelsLoading || messagesLoading || channelsLoadingChannels) {
    return (
      <div className="vw-100 vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="chat-container px-3">
        <div className="card h-100 border-0 shadow">
          <div className="card-body p-0 h-100 d-flex">
            {/* Левая колонка: каналы */}
            <aside className="channels-panel">
              <ChannelsList />
            </aside>

            {/* Правая часть: чат */}
            <section className="chat-main position-relative">
              <ChatHeader />

              <div className="messages-scrollable">
                <MessagesList />
              </div>

              <div className="message-form-container">
                <MessageForm />
              </div>
            </section>
          </div>
        </div>
      </div>

      <ChannelModal />
    </>
  );
}

export default AppLayout;
