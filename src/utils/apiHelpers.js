import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getStoredItem } from './storage';

export const prepareAuthHeaders = (headers, { getState }) => {
  const token = getState().auth?.token || getStoredItem('token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
};

export const customFetchBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  prepareHeaders: prepareAuthHeaders,
});
