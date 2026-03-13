import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchMessages = createAsyncThunk(
  'ui/fetchMessages',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get('/api/v1/messages', {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    }
    catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки сообщений')
    }
  },
)

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false
        state.messages = action.payload
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { addMessage } = uiSlice.actions
export default uiSlice.reducer
