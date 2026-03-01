/*
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export const initSocket = createAsyncThunk(
  'socket/initSocket',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No token');
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      timeout: 20000,
    });

    return { socket };
  }
);

const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    socket: null,
    connected: false,
    newMessages: [],
  },
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    addNewMessage: (state, action) => {
      state.newMessages.push(action.payload);
    },
    clearNewMessages: (state) => {
      state.newMessages = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initSocket.fulfilled, (state, action) => {
      state.socket = action.payload.socket;
    });
  },
});

export const { setConnected, addNewMessage, clearNewMessages } = socketSlice.actions;
export default socketSlice.reducer;
*/