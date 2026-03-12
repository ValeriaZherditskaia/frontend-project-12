import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { channelsApi } from './api/channelsApi.js';
import { handlePending, handleRejected } from './helpers/thunkHelpers.js';

// ---------- Thunks ----------
export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { rejectWithValue }) => {
    try {
      return await channelsApi.getAll();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки каналов');
    }
  }
);

export const createChannel = createAsyncThunk(
  'channels/createChannel',
  async (name, { rejectWithValue }) => {
    try {
      return await channelsApi.create(name);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка создания канала');
    }
  }
);

export const renameChannel = createAsyncThunk(
  'channels/renameChannel',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      return await channelsApi.rename(id, name);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка переименования канала');
    }
  }
);

export const deleteChannel = createAsyncThunk(
  'channels/deleteChannel',
  async (id, { rejectWithValue }) => {
    try {
      return await channelsApi.delete(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка удаления канала');
    }
  }
);

// ---------- Начальное состояние ----------
const initialState = {
  entities: [],
  currentChannelId: null,
  loading: false,
  error: null,
  modal: {
    isOpen: false,
    type: null,
    channelId: null,
  },
};

// ---------- Слайс ----------
const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload;
    },
    openModal: (state, action) => {
      state.modal.isOpen = true;
      state.modal.type = action.payload.type;
      state.modal.channelId = action.payload.channelId || null;
      state.error = null;
    },
    closeModal: (state) => {
      Object.assign(state.modal, {
        isOpen: false,
        type: null,
        channelId: null,
      });
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handleFulfilled = (state, action, options = {}) => {
      state.loading = false;
      if (options.setEntities) state.entities = action.payload;
      if (options.addEntity) state.entities.push(action.payload);
      if (options.updateEntity) {
        const index = state.entities.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.entities[index] = action.payload;
      }
      if (options.removeEntity) {
        state.entities = state.entities.filter(c => c.id !== action.payload);
      }
      if (options.setCurrentChannel) state.currentChannelId = action.payload.id;
      if (options.switchToGeneral && state.currentChannelId === action.payload) {
        const general = state.entities.find(c => c.id === 1);
        state.currentChannelId = general ? general.id : (state.entities[0]?.id || null);
      }
    };

    builder
      // fetchChannels
      .addCase(fetchChannels.pending, handlePending)
      .addCase(fetchChannels.fulfilled, (state, action) => {
        handleFulfilled(state, action, { setEntities: true });
        if (!state.currentChannelId && action.payload?.length > 0) {
          state.currentChannelId = action.payload[0].id;
        }
      })
      .addCase(fetchChannels.rejected, handleRejected)

      // createChannel
      .addCase(createChannel.pending, handlePending)
      .addCase(createChannel.fulfilled, (state, action) => {
        handleFulfilled(state, action, { addEntity: true, setCurrentChannel: true });
      })
      .addCase(createChannel.rejected, handleRejected)

      // renameChannel
      .addCase(renameChannel.pending, handlePending)
      .addCase(renameChannel.fulfilled, (state, action) => {
        handleFulfilled(state, action, { updateEntity: true });
      })
      .addCase(renameChannel.rejected, handleRejected)

      // deleteChannel
      .addCase(deleteChannel.pending, handlePending)
      .addCase(deleteChannel.fulfilled, (state, action) => {
        handleFulfilled(state, action, { removeEntity: true, switchToGeneral: true });
      })
      .addCase(deleteChannel.rejected, handleRejected);
  },
});

export const { setCurrentChannelId, openModal, closeModal, clearError } = channelsSlice.actions;
export default channelsSlice.reducer;