import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from '../api/authApi';
import { couponApi } from '../api/couponApi';
import { orderApi } from '../api/orderApi';
import { productApi } from '../api/productApi';
import { profileApi } from '../api/profileApi';
import { contactApi } from '../api/contactApi';
import { settingsApi } from '../api/settingsApi';
import { festivalApi } from '../api/festivalApi';
import { policyApi } from '../api/policyApi';
import { returnApi } from '../api/returnApi';
import { favoriteApi } from '../api/favoriteApi';
import { paymentApi } from '../api/paymentApi';
import { reviewApi } from '../api/reviewApi';
import { aboutUsApi } from '../api/aboutUsApi';
import { costManagementApi } from '../api/costManagementApi';
import cartReducer from './cartSlice';
import authReducer from './authSlice';

const appReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  [authApi.reducerPath]: authApi.reducer,
  [couponApi.reducerPath]: couponApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [contactApi.reducerPath]: contactApi.reducer,
  [settingsApi.reducerPath]: settingsApi.reducer,
  [festivalApi.reducerPath]: festivalApi.reducer,
  [policyApi.reducerPath]: policyApi.reducer,
  [returnApi.reducerPath]: returnApi.reducer,
  [favoriteApi.reducerPath]: favoriteApi.reducer,
  [paymentApi.reducerPath]: paymentApi.reducer,
  [reviewApi.reducerPath]: reviewApi.reducer,
  [aboutUsApi.reducerPath]: aboutUsApi.reducer,
  [costManagementApi.reducerPath]: costManagementApi.reducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      couponApi.middleware,
      orderApi.middleware,
      productApi.middleware,
      profileApi.middleware,
      contactApi.middleware,
      settingsApi.middleware,
      festivalApi.middleware,
      policyApi.middleware,
      returnApi.middleware,
      favoriteApi.middleware,
      paymentApi.middleware,
      reviewApi.middleware,
      aboutUsApi.middleware,
      costManagementApi.middleware
    ),
});

setupListeners(store.dispatch);
