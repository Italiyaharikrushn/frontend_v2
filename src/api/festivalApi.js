import { createApi } from '@reduxjs/toolkit/query/react';
import { customFetchBaseQuery } from '../utils/apiHelpers';

export const festivalApi = createApi({
  reducerPath: 'festivalApi',
  baseQuery: customFetchBaseQuery,
  tagTypes: ['Festival'],
  endpoints: (builder) => ({
    getFestivalSettings: builder.query({
      query: () => '/api/festival/get',
      providesTags: ['Festival'],
    }),
    getPublicFestivalSettings: builder.query({
      query: () => '/api/festival/public',
    }),
    updateFestivalSettings: builder.mutation({
      query: (settings) => ({
        url: '/api/festival/update',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['Festival'],
    }),
  }),
});

export const {
  useGetFestivalSettingsQuery,
  useGetPublicFestivalSettingsQuery,
  useUpdateFestivalSettingsMutation,
} = festivalApi;
