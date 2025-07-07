import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Source from '../../Source';

// اکشن برای دریافت گزارش‌ها از API
export const getSettings = createAsyncThunk('settings/getSettings', async () => {
  const response = await axios.get(Source.getAddress() + '/api/settings', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access')}`,
    },
  });
  // console.log(response);
  return response.data;
});

// تعریف سلایس گزارش‌ها
const settingSlice = createSlice({
  name: 'settings',
  initialState: {
    settings: [{date:"en",language:"en"}],
    loading: false,
    error: null,
    statuss:null,
  },
  reducers: {
    addSettingToCache: (state, action) => {
      // اضافه کردن یک گزارش جدید به کش
      state.settings.push(action.payload);
    },
    updateSettingInCache: (state, action) => {
      // به‌روزرسانی یک گزارش در کش
      const index = state.settings.findIndex((setting) => setting.id === action.payload.id);
      if (index !== -1) {
        state.settings[index] = action.payload;
      }
    },
    deleteSettingFromCache: (state, action) => {
      // حذف یک گزارش از کش
      state.settings = state.settings.filter((setting) => setting.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.statuss = 'loading';
      })
      .addCase(getSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
        state.statuss='succeeded';
      })
      .addCase(getSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.statuss='rejected';
      });
  },
});

// اکشن‌های مربوط به عملیات CRUD
export const { addSettingToCache, updateSettingInCache, deleteSettingFromCache } = settingSlice.actions;

// خروجی ردیوسر سلایس
export default settingSlice.reducer;