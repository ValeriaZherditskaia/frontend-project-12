import { createAsyncThunk } from '@reduxjs/toolkit'

export const handlePending = (state) => {
  state.loading = true
  state.error = null
}

export const handleRejected = (state, action) => {
  state.loading = false
  state.error = action.payload || 'Произошла ошибка'
}

export const createAppThunk = (type, apiCall) => {
  return createAsyncThunk(
    type,
    async (arg, { rejectWithValue }) => {
      try {
        return await apiCall(arg)
      }
      catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Ошибка запроса')
      }
    },
  )
}
