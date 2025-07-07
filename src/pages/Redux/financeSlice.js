import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Source from '../../Source';

// اکشن‌های API برای moneys
export const getMoneys = createAsyncThunk('finance/getMoneys', async () => {
  const response = await axios.get(Source.getAddress() + '/api/money', {
    headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
    params: { delete: 0 },
  });
  return response.data;
});

// اکشن‌های API برای belances
export const getBelances = createAsyncThunk('finance/getBelances', async () => {
  const response = await axios.get(Source.getAddress() + '/api/belance', {
    headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
    params: { delete: 'False' },
  });
  return response.data;
});

// ایجاد سلایس ترکیبی
const financeSlice = createSlice({
  name: 'finance',
  initialState: {
    moneys: [],
    belances: [],
    loading: false,
    error: null,
    status: null,
  },
  reducers: {
    addMoneyToCache: (state, action) => {
      // console.log(action.payload);
      console.log('message')
      state.moneys.push(action.payload);
    },
    updateMoneyInCache: (state, action) => {
      const index = state.moneys.findIndex((money) => money.id === action.payload.id);
      if (index !== -1) state.moneys[index] = action.payload;
    },
    deleteMoneyFromCache: (state, action) => {
      state.moneys = state.moneys.filter((money) => money.id !== action.payload);
    },
    addBelanceToCache: (state, action) => {
      state.belances.push(action.payload);
    },
    updateBelanceInCache: (state, action) => {
      const index = state.belances.findIndex((belance) => belance.id === action.payload.id);
      if (index !== -1) state.belances[index] = action.payload;
    },
    deleteBelanceFromCache: (state, action) => {
      state.belances = state.belances.filter((belance) => belance.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMoneys.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(getMoneys.fulfilled, (state, action) => {
        state.moneys = action.payload;
        state.loading = false;
        state.status = 'succeeded';
      })
      .addCase(getMoneys.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
        state.status = 'failed';
      })
      .addCase(getBelances.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(getBelances.fulfilled, (state, action) => {
        state.belances = action.payload;
        state.loading = false;
        state.status = 'succeeded';
      })
      .addCase(getBelances.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
        state.status = 'failed';
      });
  },
});

export const {
  addMoneyToCache,
  updateMoneyInCache,
  deleteMoneyFromCache,
  addBelanceToCache,
  updateBelanceInCache,
  deleteBelanceFromCache,
} = financeSlice.actions;

export default financeSlice.reducer;
