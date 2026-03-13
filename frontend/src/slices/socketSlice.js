import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import io from 'socket.io-client'

export const initSocket = createAsyncThunk(
  'socket/initSocket',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token')
    if (!token) {
      return rejectWithValue('No token')
    }

    // Подключаемся к корневому пути, который будет проксирован на сервер
    const socket = io({
      auth: { token },
      reconnection: true,
      timeout: 20000,
    })

    return { socket }
  },
)

const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    socket: null,
    connected: false,
  },
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initSocket.fulfilled, (state, action) => {
        state.socket = action.payload.socket
      })
      .addCase(initSocket.rejected, (state, action) => {
        console.error('Socket initialization failed:', action.payload)
        state.connected = false
      })
  },
})

export const { setConnected } = socketSlice.actions
export default socketSlice.reducer
