import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Source from '../../Source';

// اکشن برای دریافت گزارش‌ها از API
export const getprimarysettings = createAsyncThunk('primarysettings/getprimarysettings', async () => {
  const response = await   axios.get(Source.getAddress() + '/api/first-setting');
  // console.log(response);
  return response.data;
});

// تعریف سلایس گزارش‌ها
const primarysettingsSlice = createSlice({
  name: 'primarysettings',
  initialState: {
    primarysettings: [],
    loading: false,
    error: null,
    statusp:null,
  },
  reducers: {
    addprimarysettingsToCache: (state, action) => {
      // اضافه کردن یک گزارش جدید به کش
      state.primarysettings.push(action.payload);
    },
    updateprimarysettingsInCache: (state, action) => {
      // به‌روزرسانی یک گزارش در کش
      const index = state.primarysettings.findIndex((setting) => setting.id === action.payload.id);
      if (index !== -1) {
        state.settings[index] = action.payload;
      }
    },
    deleteprimarysettingsFromCache: (state, action) => {
      // حذف یک گزارش از کش
      state.settings = state.settings.filter((setting) => setting.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getprimarysettings.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.statusp = 'loading';
      })
      .addCase(getprimarysettings.fulfilled, (state, action) => {
        state.loading = false;
        state.primarysettings = action.payload;
        state.statusp='succeeded';
      })
      .addCase(getprimarysettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.statusp='rejected';
      });
  },
});

// اکشن‌های مربوط به عملیات CRUD
export const { addprimarysettingsToCache, updateprimarysettingsInCache, deleteprimarysettingsFromCache } = primarysettingsSlice.actions;

// خروجی ردیوسر سلایس
export default primarysettingsSlice.reducer;