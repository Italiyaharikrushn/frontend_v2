import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  role: localStorage.getItem('userRole') || null,
  token: localStorage.getItem('token') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.role = action.payload.role;
      state.token = action.payload.token;
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', action.payload.role);
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.role = null;
      state.token = null;
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('token');
      localStorage.removeItem('cartState');
    }
  }
});

export const { login, logout } = authSlice.actions;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.role;

export default authSlice.reducer;
