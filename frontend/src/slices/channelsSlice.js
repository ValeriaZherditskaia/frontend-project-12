import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ---------- Thunks для работы с каналами ----------

// Загрузка списка каналов
export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('/api/v1/channels', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки каналов');
    }
  }
);

// Создание нового канала
export const createChannel = createAsyncThunk(
  'channels/createChannel',
  async (name, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        '/api/v1/channels',
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data; // сервер возвращает созданный канал
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка создания канала');
    }
  }
);

// Переименование канала
export const renameChannel = createAsyncThunk(
  'channels/renameChannel',
  async ({ id, name }, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.patch(
        `/api/v1/channels/${id}`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data; // сервер возвращает обновлённый канал
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка переименования канала');
    }
  }
);

// Удаление канала
export const deleteChannel = createAsyncThunk(
  'channels/deleteChannel',
  async (id, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/v1/channels/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id; // возвращаем id удалённого канала для обработки в редьюсере
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка удаления канала');
    }
  }
);

// ---------- Слайс ----------
const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    entities: [],                // список каналов
    currentChannelId: null,       // ID текущего канала
    loading: false,               // индикатор загрузки (для fetch и операций)
    error: null,                  // текст ошибки для отображения в модалке
    modal: {                      // состояние модального окна
      isOpen: false,
      type: null,                 // 'add', 'rename', 'remove'
      channelId: null,            // ID канала для rename/remove
    },
  },
  reducers: {
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload;
    },
    openModal: (state, action) => {
      state.modal.isOpen = true;
      state.modal.type = action.payload.type;
      state.modal.channelId = action.payload.channelId || null;
      state.error = null; // очищаем старую ошибку при открытии
    },
    closeModal: (state) => {
      state.modal.isOpen = false;
      state.modal.type = null;
      state.modal.channelId = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ----- fetchChannels -----
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload;
        // если текущий канал не выбран, устанавливаем первый (обычно general)
        if (!state.currentChannelId && action.payload?.length > 0) {
          state.currentChannelId = action.payload[0].id;
        }
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка загрузки каналов';
      })

      // ----- createChannel -----
      .addCase(createChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.entities.push(action.payload); // добавляем новый канал
        // переключаемся на созданный канал (по желанию)
        state.currentChannelId = action.payload.id;
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка создания канала';
      })

      // ----- renameChannel -----
      .addCase(renameChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(renameChannel.fulfilled, (state, action) => {
        state.loading = false;
        const updatedChannel = action.payload;
        const index = state.entities.findIndex(c => c.id === updatedChannel.id);
        if (index !== -1) {
          state.entities[index] = updatedChannel;
        }
      })
      .addCase(renameChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка переименования канала';
      })

      // ----- deleteChannel -----
      .addCase(deleteChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChannel.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload; // id удалённого канала
        state.entities = state.entities.filter(c => c.id !== deletedId);
        // если удалили текущий канал — переключаемся на general (id=1)
        if (state.currentChannelId === deletedId) {
          const general = state.entities.find(c => c.id === 1);
          state.currentChannelId = general ? general.id : (state.entities[0]?.id || null);
        }
      })
      .addCase(deleteChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка удаления канала';
      });
  },
});

export const {
  setCurrentChannelId,
  openModal,
  closeModal,
  clearError,
} = channelsSlice.actions;

export default channelsSlice.reducer;