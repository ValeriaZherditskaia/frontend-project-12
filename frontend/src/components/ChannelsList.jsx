import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setCurrentChannelId, openModal } from '../slices/channelsSlice.js';

function ChannelsList() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    entities: channelsList,
    currentChannelId: activeChannelId,
    loading: channelsLoading,
  } = useSelector((state) => state.channels);

  const handleChannelClick = (e, channelId) => {
    e.stopPropagation();
    dispatch(setCurrentChannelId(channelId));
  };

  const handleMenuAction = (actionType, channelId) => {
    dispatch(openModal({ type: actionType, channelId }));
    // Закрываем открытые dropdown'ы (бутафорский фикс верстки)
    const dropdowns = document.querySelectorAll('.dropdown-menu.show');
    dropdowns.forEach((dropdown) => dropdown.classList.remove('show'));
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h6 className="mb-0 fw-bold text-primary">
          {t('channels.title') /* 'Каналы' */}
        </h6>
        <button
          type="button"
          className="btn btn-primary btn-sm px-2 py-1"
          onClick={() => dispatch(openModal({ type: 'add' }))}
          disabled={channelsLoading}
        >
          <i className="bi bi-plus me-1" />
          {t('channels.new') /* 'Новый канал' */}
        </button>
      </div>

      <ul
        className="nav flex-column nav-pills p-2"
        style={{ gap: '0.25rem' }}
      >
        {channelsList.map((channel) => (
          <li key={channel.id} className="nav-item w-100">
            <div className="dropdown w-100">
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
                <span
                  className="text-truncate d-inline-block flex-grow-1"
                  style={{ maxWidth: '85%' }}
                >
                  {channel.name}
                </span>
              </button>

              <ul className="dropdown-menu w-100 shadow border-0 mt-1">
                <li>
                  <button
                    type="button"
                    className="dropdown-item d-flex align-items-center"
                    onClick={() => handleMenuAction('rename', channel.id)}
                  >
                    <i className="bi bi-pencil-square me-2 text-primary" />
                    {t('channels.rename') /* 'Переименовать' */}
                  </button>
                </li>
                {channel.removable && (
                  <li>
                    <button
                      type="button"
                      className="dropdown-item d-flex align-items-center text-danger"
                      onClick={() => handleMenuAction('remove', channel.id)}
                    >
                      <i className="bi bi-trash3 me-2" />
                      {t('channels.remove') /* 'Удалить' */}
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default ChannelsList;
