import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentChannelId: 1,
  modal: {
    isOpen: false,
    type: null,
    channelId: null,
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload
    },
    openModal: (state, action) => {
      state.modal.isOpen = true
      state.modal.type = action.payload.type
      state.modal.channelId = action.payload.channelId || null
    },
    closeModal: (state) => {
      state.modal.isOpen = false
      state.modal.type = null
      state.modal.channelId = null
    },
  },
})

export const { setCurrentChannelId, openModal, closeModal } = uiSlice.actions
export default uiSlice.reducer
