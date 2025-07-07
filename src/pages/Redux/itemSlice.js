// reportSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Source from '../../Source';

// اکشن برای دریافت آیتم‌ها از API
export const getItems = createAsyncThunk('items/getItems', async () => {
  const response = await axios.get(`${Source.getAddress()}/api/item`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
    params: {
      query: 'ok',
    },
  });
  // console.log(response);
  return response.data;
});

// تعریف سلایس آیتم‌ها
const itemSlice = createSlice({
  name: 'items',
  initialState: {
    items: [], // لیست آیتم‌ها
    loading: false, // وضعیت بارگذاری
    error: null, // خطا
    statusi: null
  },
  reducers: {
    // اکشن برای اضافه کردن آیتم به کش
    addItemToCache: (state, action) => {
      state.items.push(action.payload); // اضافه کردن آیتم جدید به لیست
    },
    // اکشن برای به‌روزرسانی آیتم در کش
    updateItemInCache: (state, action) => {
      const { updatedData } = action.payload; // آیتمی که باید به‌روزرسانی شود
      const index = state.items.findIndex((item) => item.id === updatedData.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updatedData };
      }
    },
    // اکشن برای حذف آیتم از کش
    deleteItemFromCache: (state, action) => {
      const id = action.payload; // آیتمی که باید حذف شود
      state.items = state.items.filter((item) => item.id !== id);
    },
    // اکشن برای خواندن یک آیتم (اختیاری)
    getItemFromCache: (state, action) => {
      const id = action.payload; // آیتمی که باید خوانده شود
      return state.items.find((item) => item.id === id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getItems.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.statusi = 'loading';
      })
      .addCase(getItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.statusi = 'succeeded'
      })
      .addCase(getItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.statusi = 'rejected'
      });
  },
});

// اکسپورت اکشن‌ها و ریدوسر
export const {
  addItemToCache,
  updateItemInCache,
  deleteItemFromCache,
  getItemFromCache,
} = itemSlice.actions;

export default itemSlice.reducer;