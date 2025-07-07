import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Source from '../../Source';

// اکشن برای دریافت مشتریان از API
export const getCustomers = createAsyncThunk('customers/getCustomers', async () => {
  const response = await axios.get(Source.getAddress() + '/api/customers', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access')}`,
    },
    params: {
      delete: 0,
    },
  });
  return response.data;
});

// تعریف سلایس مشتریان
const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    customers: [],
    loading: false,
    error: null,
    statusc: null,
  },
  reducers: {
    addCustomerToCache: (state, action) => {
      // اضافه کردن یک مشتری جدید به کش
      state.customers.push(action.payload);
    },
    updateCustomerInCache: (state, action) => {
      // به‌روزرسانی یک مشتری در کش
      const index = state.customers.findIndex((customer) => customer.id === action.payload.id);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    },
    deleteCustomerFromCache: (state, action) => {
      // حذف یک مشتری از کش
      state.customers = state.customers.filter((customer) => customer.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.statusc='loading'
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
        state.statusc='succeeded';
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.statusc='rejected';
      });
  },
});

// اکشن‌های مربوط به عملیات CRUD
export const { addCustomerToCache, updateCustomerInCache, deleteCustomerFromCache } = customerSlice.actions;

// خروجی ردیوسر سلایس
export default customerSlice.reducer;
