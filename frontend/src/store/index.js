import { configureStore } from '@reduxjs/toolkit'
import { chatApi } from '../services/api'
import authReducer from '../slices/authSlice.js'
import uiReducer from '../slices/uiSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(chatApi.middleware),
})
