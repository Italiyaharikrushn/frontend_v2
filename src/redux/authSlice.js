import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  role: localStorage.getItem('userRole') || null,
  token: localStorage.getItem('token') || null,
  name: localStorage.getItem('userName') || null,
  email: localStorage.getItem('userEmail') || null,
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
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', action.payload.role);
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
      if (action.payload.name) {
        localStorage.setItem('userName', action.payload.name);
      }
      if (action.payload.email) {
        localStorage.setItem('userEmail', action.payload.email);
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.role = null;
      state.token = null;
      state.name = null;
      state.email = null;
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('cartState');
    }
  }
});

export const { login, logout } = authSlice.actions;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.role;
export const selectUserName = (state) => state.auth.name;
export const selectUserEmail = (state) => state.auth.email;

export default authSlice.reducer;
