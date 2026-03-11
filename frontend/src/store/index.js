import { configureStore } from '@reduxjs/toolkit';
import uiReducer from '../slices/uiSlice.js';
import channelsReducer from '../slices/channelsSlice.js';
import socketReducer from '../slices/socketSlice.js';
import { toastMiddleware } from './middleware/toastMiddleware.js';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    channels: channelsReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['socket/initSocket/fulfilled'],
        ignoredPaths: ['socket.socket']
      }
    }).concat(toastMiddleware),
});

export default store;
