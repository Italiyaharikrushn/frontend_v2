import { createSlice } from '@reduxjs/toolkit';
import { getStoredItem, setStoredItem, removeStoredItem } from '../utils/storage';

const initialState = {
  isAuthenticated: getStoredItem('isAuthenticated') === 'true',
  role: getStoredItem('userRole'),
  token: getStoredItem('token'),
  name: getStoredItem('userName'),
  email: getStoredItem('userEmail'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.role = action.payload.role;
      state.token = action.payload.token;
      state.name = action.payload.name || null;
      state.email = action.payload.email || null;
      setStoredItem('isAuthenticated', 'true');
      setStoredItem('userRole', action.payload.role);
      if (action.payload.token) {
        setStoredItem('token', action.payload.token);
      }
      if (action.payload.name) {
        setStoredItem('userName', action.payload.name);
      }
      if (action.payload.email) {
        setStoredItem('userEmail', action.payload.email);
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.role = null;
      state.token = null;
      state.name = null;
      state.email = null;
      removeStoredItem('isAuthenticated');
      removeStoredItem('userRole');
      removeStoredItem('token');
      removeStoredItem('userName');
      removeStoredItem('userEmail');
      removeStoredItem('cartState');
    }
  }
});

export const { login, logout } = authSlice.actions;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.role;
export const selectUserName = (state) => state.auth.name;
export const selectUserEmail = (state) => state.auth.email;

export default authSlice.reducer;
