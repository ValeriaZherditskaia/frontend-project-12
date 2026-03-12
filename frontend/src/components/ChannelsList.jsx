import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {
  setCurrentChannelId,
  openModal,
} from '../slices/channelsSlice.js';

function ChannelsList() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const channels = useSelector((state) => state.channels.entities);
  const activeChannelId = useSelector((state) => state.channels.currentChannelId);

  const handleChannelClick = (channelId) => {
    dispatch(setCurrentChannelId(channelId));
  };

  return (
    <div className="h-100 d-flex flex-column">
      {/* Заголовок панели каналов */}
      <div className="d-flex align-items-center p-3" style={{ backgroundColor: '#f8f9fa' }}>
        <h6 className="mb-0 fw-bold flex-grow-1 text-start" style={{ color: '#212529' }}>
          {t('channels.title')}
        </h6>
        <button
          type="button"
          className="btn btn-sm p-0 btn-add-channel"
          onClick={() => dispatch(openModal({ type: 'add' }))}
          title={t('channels.new')}
        >
          +
        </button>
      </div>

      {/* Список каналов */}
      <ul className="nav flex-column nav-pills p-2 flex-grow-1 overflow-auto">
        {channels.map((channel) => {
          const isActive = channel.id === activeChannelId;
          const isRemovable = channel.removable;

          return (
            <li key={channel.id} className="nav-item w-100 mb-1">
              {isRemovable ? (
                <ButtonGroup className="w-100">
                  <button
                    type="button"
                    className={`flex-grow-1 text-start btn btn-sm rounded-0 px-3 py-2 d-flex align-items-center ${
                      isActive ? 'btn-dark text-white' : 'btn-light border-0'
                    }`}
                    style={{
                      backgroundColor: isActive ? '#495057' : 'transparent',
                      border: 'none',
                    }}
                    onClick={() => handleChannelClick(channel.id)}
                  >
                    <span
                      className={`me-2 ${isActive ? 'text-white-50' : 'text-secondary'}`}
                    >
                      #
                    </span>
                    <span className="flex-grow-1 text-truncate">
                      {channel.name}
                    </span>
                  </button>

                  <Dropdown align="end">
                    <Dropdown.Toggle
                      variant={isActive ? 'dark' : 'light'}
                      size="sm"
                      className="rounded-0 border-0 px-2"
                      style={{
                        backgroundColor: isActive ? '#495057' : 'transparent',
                        color: isActive ? 'white' : '#495057',
                      }}
                    >
                      <span className="visually-hidden">
                        {t('channels.title')}
                      </span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() =>
                          dispatch(
                            openModal({ type: 'rename', channelId: channel.id })
                          )
                        }
                      >
                        {t('channels.rename')}
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="text-danger"
                        onClick={() =>
                          dispatch(
                            openModal({ type: 'remove', channelId: channel.id })
                          )
                        }
                      >
                        {t('channels.remove')}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </ButtonGroup>
              ) : (
                <button
                  type="button"
                  className={`w-100 text-start btn btn-sm rounded-0 px-3 py-2 d-flex align-items-center ${
                    isActive ? 'btn-dark text-white' : 'btn-light border-0'
                  }`}
                  style={{
                    backgroundColor: isActive ? '#495057' : 'transparent',
                    border: 'none',
                  }}
                  onClick={() => handleChannelClick(channel.id)}
                >
                  <span
                    className={`me-2 ${isActive ? 'text-white-50' : 'text-secondary'}`}
                  >
                    #
                  </span>
                  <span className="flex-grow-1 text-truncate">
                    {channel.name}
                  </span>
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ChannelsList;