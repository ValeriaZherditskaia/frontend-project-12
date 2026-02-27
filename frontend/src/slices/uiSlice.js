import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk: загрузка каналов
export const fetchChannels = createAsyncThunk(
  'ui/fetchChannels',
  async () => {
    const token = localStorage.getItem('token');
    const { data } = await axios.get('/api/v1/channels', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }
);

// Async Thunk: загрузка сообщений
export const fetchMessages = createAsyncThunk(
  'ui/fetchMessages',
  async () => {
    const token = localStorage.getItem('token');
    const { data } = await axios.get('/api/v1/messages', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }
);

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    channels: [],
    messages: [],
    currentChannelId: null,
    channelsLoading: false,
    messagesLoading: false,
  },
  reducers: {
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Каналы
      .addCase(fetchChannels.pending, (state) => {
        state.channelsLoading = true;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.channelsLoading = false;
        state.channels = action.payload;
        if (!state.currentChannelId) {
          state.currentChannelId = action.payload[0]?.id;
        }
      })
      .addCase(fetchChannels.rejected, (state) => {
        state.channelsLoading = false;
      })
      // Сообщения
      .addCase(fetchMessages.pending, (state) => {
        state.messagesLoading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messagesLoading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state) => {
        state.messagesLoading = false;
      });
  },
});

export const { setCurrentChannelId } = uiSlice.actions;
export default uiSlice.reducer;
