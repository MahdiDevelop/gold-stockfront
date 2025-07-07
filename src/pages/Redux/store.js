import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

import belanceReducer from './belanceSlice';
import customerReducer from './customerSlice';
import moneyReducer from './moneysSlice';
import itemReducer from './itemSlice';
import settingReducer from './settingSlice';
import stockReducer from './stockSlice';
import userReducer from './userSlice';
import sidebarReducer from './sidebarSlice';

const belancePersistConfig = { key: 'belances', storage };
const customerPersistConfig = { key: 'customers', storage };
const moneyPersistConfig = { key: 'moneys', storage };
const itemPersistConfig = { key: 'items', storage };
const settingPersistConfig = { key: 'settings', storage };
const stockPersistConfig = { key: 'stocks', storage };
const userPersistConfig = { key: 'users', storage };
const sidebarPersistConfig = { key: 'sidebars', storage };

const store = configureStore({
  reducer: {
    belances: persistReducer(belancePersistConfig, belanceReducer),
    customers: persistReducer(customerPersistConfig, customerReducer),
    moneys: persistReducer(moneyPersistConfig, moneyReducer),
    items: persistReducer(itemPersistConfig, itemReducer),
    settings: persistReducer(settingPersistConfig, settingReducer),
    stocks: persistReducer(stockPersistConfig, stockReducer),
    users: persistReducer(userPersistConfig, userReducer),
    sidebars: persistReducer(sidebarPersistConfig, sidebarReducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(thunk),
});

const persistor = persistStore(store);

export { store, persistor };
