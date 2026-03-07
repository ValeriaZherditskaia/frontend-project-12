import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as yup from 'yup';

// Схема валидации имён каналов (ТЗ: 3-20 символов, уникальные)
const CHANNEL_NAME_SCHEMA = yup.string()
  .trim('Имя не может быть пустым')
  .min(3, 'От 3 до 20 символов')
  .max(20, 'От 3 до 20 символов')
  .matches(/^[a-zA-Zа-яёА-ЯЁ0-9\s\-_]+$/, 'Только буквы, цифры, пробелы, дефис, подчёркивание')
  .required('Название обязательно');

export const createChannel = createAsyncThunk(
  'channels/createChannel',
  async (name, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const _response = await axios.post('/api/v1/channels', 
        { name: name.trim() }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return _response.data;  // {id: 3, name: "новый", removable: true}
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка создания канала');
    }
  }
);

export const renameChannel = createAsyncThunk(
  'channels/renameChannel',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      await CHANNEL_NAME_SCHEMA.validate(name);
      const token = localStorage.getItem('token');
      const _response = await axios.patch(`/api/v1/channels/${id}`, 
        { name: name.trim() }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return _response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Ошибка переименования');
    }
  }
);

export const deleteChannel = createAsyncThunk(
  'channels/deleteChannel',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const _response = await axios.delete(`/api/v1/channels/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { id };  // Для reducer
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка удаления');
    }
  }
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    entities: [],           // [{id:1,name:"general",removable:false},...]
    currentChannelId: 1,    // Активный канал (General по умолчанию)
    loading: false,
    error: null,
    modal: {
      type: null,      // 'add' | 'rename' | 'remove'
      channelId: null,
      isOpen: false,
    },
    createStatus: 'idle',
    renameStatus: 'idle',
    deleteStatus: 'idle',
  },
  reducers: {
    // Переключение каналов
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload;
    },
    
    // Управление модалкой
    openModal: (state, action) => {
      state.modal = { 
        ...state.modal, 
        ...action.payload, 
        isOpen: true 
      };
      state.error = null;
    },
    closeModal: (state) => {
      state.modal = { type: null, channelId: null, isOpen: false };
      state.error = null;
    },
    
    // Очистка ошибок
    clearError: (state) => {
      state.error = null;
    },
  },
  // 🔥 extraReducers — обработка thunk'ов
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createChannel.pending, (state) => {
        state.loading = true;
        state.createStatus = 'pending'; 
        state.error = null;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.createStatus = 'fulfilled';
        state.entities.push(action.payload);  // Добавляем в список
        state.currentChannelId = action.payload.id;  // ТЗ: перейти в новый
        state.modal.isOpen = false;
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.loading = false;
        state.createStatus = 'rejected';
        state.error = action.payload;
      })

      // RENAME
      .addCase(renameChannel.pending, (state) => {
        state.loading = true;
        state.renameStatus = 'pending';
        state.error = null;
      })
      .addCase(renameChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.renameStatus = 'fulfilled';
        const index = state.entities.findIndex(c => c.id === action.payload.id);
        state.entities[index] = action.payload;  // Обновляем
        state.modal.isOpen = false;
      })
      .addCase(renameChannel.rejected, (state, action) => {
        state.loading = false;
        state.renameStatus = 'rejected'; 
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteChannel.pending, (state) => {
        state.loading = true;
        state.deleteStatus = 'pending';
        state.error = null;
      })
      .addCase(deleteChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteStatus = 'fulfilled';
        state.entities = state.entities.filter(c => c.id !== action.payload.id);
        // ТЗ: если удалён активный → в General (id:1)
        if (state.currentChannelId === action.payload.id) {
          state.currentChannelId = 1;
        }
        state.modal.isOpen = false;
      })
      .addCase(deleteChannel.rejected, (state, action) => {
        state.loading = false;
        state.deleteStatus = 'rejected';
        state.error = action.payload;
      });
  },
});

export const { 
  setCurrentChannelId, 
  openModal, 
  closeModal, 
  clearError 
} = channelsSlice.actions;
export default channelsSlice.reducer;
