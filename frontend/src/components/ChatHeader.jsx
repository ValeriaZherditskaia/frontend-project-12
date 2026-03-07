import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

function ChatHeader() {
  const { t } = useTranslation();

  const username = localStorage.getItem('username') || t('app.guest', 'Гость');

  const { entities: channelsList, currentChannelId } = useSelector(
    (state) => state.channels,
  );

  const currentChannel =
    channelsList.find((c) => c.id === currentChannelId) || channelsList[0];

  return (
    <header className="mb-3 border-bottom pb-2">
      <h4>
        {currentChannel ? `#${currentChannel.name}` : t('chat.title', 'Канал')}
      </h4>
      <small className="text-muted">
        {t('chat.loggedAs', 'Вы вошли как')}{' '}
        <strong>{username}</strong>
      </small>
    </header>
  );
}

export default ChatHeader;
