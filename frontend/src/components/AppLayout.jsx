// src/components/AppLayout.jsx
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

  const {
    channelsLoading,
    messagesLoading,
  } = useSelector((state) => state.ui);

  const {
    loading: channelsLoadingChannels,
  } = useSelector((state) => state.channels);

  // 🔥 Toast при потере/восстановлении сети
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

  // начальная загрузка каналов и сообщений + проверка токена
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    dispatch(fetchChannels());
    dispatch(fetchMessages());
  }, [dispatch]);

  // показ спиннера, пока что‑то грузится
  if (channelsLoading || messagesLoading || channelsLoadingChannels) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid h-100 py-3">
        <div className="row h-100">
          {/* Левый блок: список каналов */}
          <div className="col-4 col-md-3 border-end px-0">
            <ChannelsList />
          </div>

          {/* Правый блок: заголовок, список сообщений, форма отправки */}
          <div className="col-8 col-md-9 d-flex flex-column">
            <ChatHeader />
            <MessagesList />
            <MessageForm />
          </div>
        </div>
      </div>

      {/* Модальное окно для добавления/редактирования/удаления канала */}
      <ChannelModal />
    </>
  );
}

export default AppLayout;
