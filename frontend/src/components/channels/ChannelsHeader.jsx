// Заголовок с кнопкой "+"

import { useTranslation } from 'react-i18next'

const ChannelsHeader = ({ onAddClick }) => {
  const { t } = useTranslation()

  return (
    <div className="d-flex align-items-center p-3" style={{ backgroundColor: '#f8f9fa' }}>
      <h6 className="mb-0 fw-bold flex-grow-1 text-start" style={{ color: '#212529' }}>
        {t('channels.title')}
      </h6>
      <button
        type="button"
        className="btn btn-sm p-0 btn-add-channel"
        onClick={onAddClick}
        title={t('channels.new')}
      >
        +
      </button>
    </div>
  )
}

export default ChannelsHeader
