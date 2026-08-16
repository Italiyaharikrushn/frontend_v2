import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getStoredItem, isTokenValid } from './storage';
import { logout } from '../redux/authSlice';

export const prepareAuthHeaders = (headers, { getState }) => {
  let token = getState().auth?.token || getStoredItem('token');
  if (token && isTokenValid(token)) {
    let cleanToken = token.trim();
    if (cleanToken.startsWith('Bearer ')) {
      cleanToken = cleanToken.substring(7).trim();
    }
    if (cleanToken && cleanToken !== 'null' && cleanToken !== 'undefined') {
      headers.set('Authorization', `Bearer ${cleanToken}`);
    }
  }
  return headers;
};

export const createCustomBaseQuery = (pathPrefix = '') => {
  const baseUrl = `${import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8081'}${pathPrefix}`;
  const rawQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: prepareAuthHeaders,
  });

  return async (args, api, extraOptions) => {
    const result = await rawQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
      api.dispatch(logout());
    }
    return result;
  };
};

export const customFetchBaseQuery = createCustomBaseQuery('');

export const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8081'}${path}`;
};

