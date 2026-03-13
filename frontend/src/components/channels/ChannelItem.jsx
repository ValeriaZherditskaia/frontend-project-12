import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Dropdown from 'react-bootstrap/Dropdown'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { openModal } from '../../slices/channelsSlice.js'

const ChannelItem = ({ channel, isActive, onChannelClick }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const handleRename = () => {
    dispatch(openModal({ type: 'rename', channelId: channel.id }))
  }

  const handleRemove = () => {
    dispatch(openModal({ type: 'remove', channelId: channel.id }))
  }

  const buttonClasses = `w-100 text-start btn btn-sm rounded-0 px-3 py-2 d-flex align-items-center ${
    isActive ? 'btn-dark text-white' : 'btn-light border-0'
  }`

  const buttonStyle = {
    backgroundColor: isActive ? '#495057' : 'transparent',
    border: 'none',
  }

  const prefixClass = `me-2 ${isActive ? 'text-white-50' : 'text-secondary'}`

  const content = (
    <>
      <span className={prefixClass}>#</span>
      <span className="flex-grow-1 text-truncate">{channel.name}</span>
    </>
  )

  if (!channel.removable) {
    return (
      <button
        type="button"
        className={buttonClasses}
        style={buttonStyle}
        onClick={() => onChannelClick(channel.id)}
        aria-label={channel.name} // ← добавлено для точного совпадения в тестах
      >
        {content}
      </button>
    )
  }

  return (
    <ButtonGroup className="w-100">
      <button
        type="button"
        className={`flex-grow-1 text-start btn btn-sm rounded-0 px-3 py-2 d-flex align-items-center ${
          isActive ? 'btn-dark text-white' : 'btn-light border-0'
        }`}
        style={buttonStyle}
        onClick={() => onChannelClick(channel.id)}
        aria-label={channel.name} // ← добавлено для точного совпадения в тестах
      >
        {content}
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
          <span className="visually-hidden">{t('channels.management')}</span>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={handleRename}>
            {t('channels.rename')}
          </Dropdown.Item>
          <Dropdown.Item className="text-danger" onClick={handleRemove}>
            {t('channels.remove')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </ButtonGroup>
  )
}

export default ChannelItem
