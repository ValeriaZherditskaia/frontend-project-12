import { configureStore } from '@reduxjs/toolkit'
import uiReducer from '../slices/uiSlice.js'
import channelsReducer from '../slices/channelsSlice.js'
import authReducer from '../slices/authSlice.js'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    channels: channelsReducer,
    auth: authReducer,
  },
})

export default store
