import { configureStore } from '@reduxjs/toolkit';
import uiReducer from '../slices/uiSlice.js';
import channelsReducer from '../slices/channelsSlice.js';

export const store = configureStore({
  reducer: {
    ui: uiReducer,  // Только ui для шага 5
    channels: channelsReducer,
  },
});

export default store;
