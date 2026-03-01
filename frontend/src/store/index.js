import { configureStore } from '@reduxjs/toolkit';
import uiReducer from '../slices/uiSlice.js';

export const store = configureStore({
  reducer: {
    ui: uiReducer,  // Только ui для шага 5
  },
});

export default store;
