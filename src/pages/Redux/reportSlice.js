import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Source from '../../Source';

// اکشن برای دریافت گزارش‌ها از API
export const getReports = createAsyncThunk('reports/getReports', async () => {
  const response = await axios.get(Source.getAddress() + '/api/belance', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access')}`,
    },
    params: { query: 'search' },
  });
  return response.data;
});

// تعریف سلایس گزارش‌ها
const reportSlice = createSlice({
  name: 'reports',
  initialState: {
    reports: [],
    loading: false,
    error: null,
    statusr:null,
  },
  reducers: {
    addReportToCache: (state, action) => {
      // اضافه کردن یک گزارش جدید به کش
      state.reports.push(action.payload);
    },
    updateReportInCache: (state, action) => {
      // به‌روزرسانی یک گزارش در کش
      const index = state.reports.findIndex((report) => report.id === action.payload.id);
      if (index !== -1) {
        state.reports[index] = action.payload;
      }
    },
    deleteReportFromCache: (state, action) => {
      // حذف یک گزارش از کش
      state.reports = state.reports.filter((report) => report.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReports.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.statusr='loading'
      })
      .addCase(getReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
        state.statusr='succeeded'
      })
      .addCase(getReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.statusr='rejected'
      });
  },
});

// اکشن‌های مربوط به عملیات CRUD
export const { addReportToCache, updateReportInCache, deleteReportFromCache } = reportSlice.actions;

// خروجی ردیوسر سلایس
export default reportSlice.reducer;
