import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Source from '../../Source';
// اکشن برای دریافت گزارش‌ها از API
export const getSidebars = createAsyncThunk('sidebars/geSidebars', async () => {
  const response = await axios.get(Source.getAddress() + '/api/sidebar', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access')}`,
    },
  });
  // console.log(response);
  return response.data;
}); 

// تعریف سلایس گزارش‌ها
const sidebarSlice = createSlice({
  name: 'sidebars',
  initialState: {
    sidebars: [{Accounts
      : 
      1,
      All_Draft_Group
      : 
      1,
      Cash
      : 
      1,
      Currency
      : 
      1,
      Customers
      : 
      1,
      Dashboard
      : 
      1,
      Deposite
      : 
      1,
      Draft_Accounts
      : 
      1,
      Draft_Currency
      : 
      1,
      Draft_Customers
      : 
      1,
      Draft_Transactions
      : 
      1,
      Item_Type
      : 
      1,
      Items
      : 
      1,
      Items_Group
      : 
      1,
      Purchase
      : 
      1,
      Purchase_Return
      : 
      1,
      Report_Customer
      : 
      1,
      Reports
      : 
      1,
      Sell
      : 
      1,
      Sell_Return
      : 
      1,
      Settings
      : 
      1,
      Stock
      : 
      1,
      Transactions_Group
      : 
      1,
      Transformation
      : 
      1,
      Withdraw
      : 
      1,
      benefit_report
      : 
      1,
      type
      : 
      "gold",
      created_at
      : 
      null,
      id
      : 
      1,
      updated_at
      : 
      null}],
    loading: false,
    error: null,
    statusSidebar:null,
  },
  reducers: {
    addSidebarToCache: (state, action) => {
      // اضافه کردن یک گزارش جدید به کش
      state.sidebars.push(action.payload);
    },
    updateSidebarInCache: (state, action) => {
      // به‌روزرسانی یک گزارش در کش
      const index = state.sidebars.findIndex((setting) => setting.id === action.payload.id);
      if (index !== -1) {
        state.sidebars[index] = action.payload;
      }
    },
    deleteSidebarFromCache: (state, action) => {
      // حذف یک گزارش از کش
      state.sidebars = state.sidebars.filter((setting) => setting.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSidebars.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.statusSidebar = 'loading';
      })
      .addCase(getSidebars.fulfilled, (state, action) => {
        state.loading = false;
        state.sidebars= action.payload;
        state.statusSidebar='succeeded';
      })
      .addCase(getSidebars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.statusSidebar='rejected';
      });
  },
});
// اکشن‌های مربوط به عملیات CRUD
export const { addSidebarToCache, updateSidebarInCache, deleteSidebarFromCache } = sidebarSlice.actions;
// خروجی ردیوسر سلایس
export default sidebarSlice.reducer;