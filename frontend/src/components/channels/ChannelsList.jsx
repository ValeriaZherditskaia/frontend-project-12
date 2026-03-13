import { useDispatch, useSelector } from 'react-redux'
import { setCurrentChannelId, openModal } from '../../slices/channelsSlice.js'
import ChannelsHeader from './ChannelsHeader.jsx'
import ChannelItem from './ChannelItem.jsx'

const ChannelsList = () => {
  const dispatch = useDispatch()
  const channels = useSelector(state => state.channels.entities)
  const activeChannelId = useSelector(state => state.channels.currentChannelId)

  const handleChannelClick = (channelId) => {
    dispatch(setCurrentChannelId(channelId))
  }

  const handleAddChannel = () => {
    dispatch(openModal({ type: 'add' }))
  }

  return (
    <div className="h-100 d-flex flex-column">
      <ChannelsHeader onAddClick={handleAddChannel} />
      <ul className="nav flex-column nav-pills p-2 flex-grow-1 overflow-auto">
        {channels.map(channel => (
          <li key={channel.id} className="nav-item w-100 mb-1">
            <ChannelItem
              channel={channel}
              isActive={channel.id === activeChannelId}
              onChannelClick={handleChannelClick}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ChannelsList
