// RTK query


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';
import Source from '../../Source';
// اکشن برای دریافت گزارش‌ها از API
export const getUsers = createAsyncThunk('users/getUsers', async () => {
  const response = await axios.get(Source.getAddress() + '/api/user', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access')}`,
    },
  });
  // console.log(response);
  return response.data;
}); 

// تعریف سلایس گزارش‌ها
const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
    statusu:null,
  },
  reducers: {
    addUserToCache: (state, action) => {
      // اضافه کردن یک گزارش جدید به کش
      state.users.push(action.payload);
    },
    updateUserInCache: (state, action) => {
      // به‌روزرسانی یک گزارش در کش
      const index = state.users.findIndex((setting) => setting.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUserFromCache: (state, action) => {
      // حذف یک گزارش از کش
      state.users = state.users.filter((setting) => setting.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.statusu = 'loading';
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.statusu='succeeded';
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.statusu='rejected';
      });
  },
});
// اکشن‌های مربوط به عملیات CRUD
export const { addUserToCache, updateUserInCache, deleteUserFromCache } = userSlice.actions;
// خروجی ردیوسر سلایس
export default userSlice.reducer;