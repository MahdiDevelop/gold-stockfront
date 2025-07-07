// reportSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Source from '../../Source';

// اکشن برای دریافت آیتم‌ها از API
export const getStocks = createAsyncThunk('stocks/getStocks', async () => {
  const response = await axios.get(`${Source.getAddress()}/api/item`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
    params: {
      stock: 'true',
    },
  });
  console.log(response);
  return response.data;
});

// تعریف سلایس آیتم‌ها
const stockSlice = createSlice({
  name: 'stocks',
  initialState: {
    stocks: [], // لیست آیتم‌ها
    loading: false, // وضعیت بارگذاری
    error: null, // خطا
    statusStock: null
  },
  reducers: {
    // اکشن برای اضافه کردن آیتم به کش
    addStockToCache: (state, action) => {
      state.stocks.push(action.payload); // اضافه کردن آیتم جدید به لیست
    },
    // اکشن برای به‌روزرسانی آیتم در کش
    updateStockInCache: (state, action) => {
      const { updatedData } = action.payload; // آیتمی که باید به‌روزرسانی شود
      // console.log("Update Payload:", action.payload);
      const index = state.stocks.findIndex((stock) => stock.id === updatedData.id);
      if (index !== -1) {
        state.stocks[index] = { ...state.stocks[index], ...updatedData };
      }
    },
    // اکشن برای حذف آیتم از کش
    deleteStockFromCache: (state, action) => {
      const id = action.payload; // آیتمی که باید حذف شود
      state.stocks = state.stocks.filter((stock) => stock.id !== id);
    },
    // اکشن برای خواندن یک آیتم (اختیاری)
    getStockFromCache: (state, action) => {
      const id = action.payload; // آیتمی که باید خوانده شود
      return state.stocks.find((stock) => stock.id === id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.statusStock = 'loading';
      })
      .addCase(getStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.stocks = action.payload;
        state.statusStock = 'succeeded'
      })
      .addCase(getStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.statusStock = 'rejected'
      });
  },
});

// اکسپورت اکشن‌ها و ریدوسر
export const {
  addStockToCache,
  updateStockInCache,
  deleteStockFromCache,
  getStockFromCache,
} = stockSlice.actions;

export default stockSlice.reducer;
