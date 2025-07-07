import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Source from '../../Source';
import { addMoneyToCache } from './moneysSlice';
import { useDispatch } from 'react-redux';

// اکشن برای دریافت بلانس‌ها از API
export const getBelances = createAsyncThunk('belances/getBelances', async () => {
  const response = await axios.get(Source.getAddress() + '/api/belance', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access')}`,
    },
    params: { delete: 'False' }, // دریافت بلانس‌های فعال
  });
  console.log(response);
  return response.data;
});
// یک thunk برای dispatch کردن چند اکشن
// const dispatch=useDispatch();
export const addMultipleDataToCache = (response) => (dispatch) => {
  Promise.all([
    dispatch(addMoneyToCache(response.money)),
    dispatch(addBelanceToCache(response.belance)),
  ]);
};

// تعریف سلایس بلانس‌ها
const belanceSlice = createSlice({
  name: 'belances',
  initialState: {
    belances: [],
    loading: false,
    errorb: null,
    statusb: null,  // وضعیت درخواست (loading, succeeded, rejected)
  },
  reducers: {
    addBelanceToCache: (state, action) => {
      // اضافه کردن یک آیتم جدید به کش
      const { updatedData } = action.payload;
      console.log('Adding to Cache:', updatedData);
      state.belances.push(updatedData);  // اضافه کردن داده به آرایه
    },

    updateBelanceInCache: (state, action) => {
      // به‌روزرسانی یک آیتم موجود در کش
      const index = state.belances.findIndex((belance) => belance.id === action.payload.id);
      if (index !== -1) {
        state.belances[index] = action.payload;  // به‌روزرسانی داده
      } else {
        state.belances.push(action.payload);  // اگر آیتم پیدا نشد، اضافه کردن به آرایه
      }
    },

    deleteBelanceFromCache: (state, action) => {
      // حذف یک آیتم از کش
      state.belances = state.belances.filter((belance) => belance.id !== action.payload);  // فیلتر کردن آرایه
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBelances.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.statusb = 'loading';  // تنظیم وضعیت به loading
      })
      .addCase(getBelances.fulfilled, (state, action) => {
        console.log('Data loaded:', action.payload);  // بررسی داده‌های بارگذاری شده
        state.loading = false;
        state.belances = action.payload;  // به‌روزرسانی داده‌های بلانس‌ها
        state.statusb = 'succeeded';  // تغییر وضعیت به succeeded
      })
      .addCase(getBelances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;  // ذخیره خطا
        state.statusb = 'rejected';  // تغییر وضعیت به rejected
      });
  },
});

// اکشن‌های تعریف شده در reducers
export const { addBelanceToCache, updateBelanceInCache, deleteBelanceFromCache } = belanceSlice.actions;

// خروجی ردیوسر سلایس
export default belanceSlice.reducer;
