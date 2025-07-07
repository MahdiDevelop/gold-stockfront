import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Source from '../../Source';

// اکشن برای دریافت گزارش‌ها از API
export const getMoneys = createAsyncThunk('moneys/getMoneys', async () => {
  const response = await axios.get(Source.getAddress() + '/api/money', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access')}`,
    },
    params: {
      delete: 0,
    },
  });
  return response.data;
});

// تعریف سلایس گزارش‌ها
const moneysSlice = createSlice({
  name: 'moneys',
  initialState: {
    moneys: [],
    loadingm: false,
    error: null,
    statusm: null,
  },
  reducers: {
    addMoneyToCache: (state, action) => {
      const { updatedData } = action.payload;
      console.log('Adding to Cache:', updatedData); // بررسی داده‌ها

      if (updatedData) {
        state.moneys.push(updatedData);
        console.log('Adding to Cache:', JSON.stringify(state.moneys, null, 2));
      } else {
        console.log('No data provided for update');
      }
    },
    
    updateMoneyInCache: (state, action) => {
      const index = state.moneys.findIndex((money) => money.id === action.payload.id);
      if (index !== -1) {
        state.moneys[index] = action.payload;
      }
    },

    deleteMoneyFromCache: (state, action) => {
      state.moneys = state.moneys.filter((money) => money.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMoneys.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.statusm = 'loading';
      })
      .addCase(getMoneys.fulfilled, (state, action) => {
        state.loading = false;
        state.moneys = action.payload;
        state.statusm = 'success';
      })
      .addCase(getMoneys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.statusm = 'rejected';
      });
  },
});

// اکشن‌های تعریف شده در reducers
export const { addMoneyToCache, updateMoneyInCache, deleteMoneyFromCache } = moneysSlice.actions;

// خروجی ردیوسر سلایس
export default moneysSlice.reducer;
