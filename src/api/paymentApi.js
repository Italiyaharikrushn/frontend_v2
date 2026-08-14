import { createApi } from '@reduxjs/toolkit/query/react';
import { customFetchBaseQuery } from '../utils/apiHelpers';

export const paymentApi = createApi({
    reducerPath: 'paymentApi',
    baseQuery: customFetchBaseQuery,
    tagTypes: ['Payment'],
    endpoints: (builder) => ({
        getSellerPayments: builder.query({
            query: ({ page = 0, size = 10, year, month, day } = {}) => {
                let url = `/api/payments/seller/all?page=${page}&size=${size}`;
                if (year) url += `&year=${year}`;
                if (month) url += `&month=${month}`;
                if (day) url += `&day=${day}`;
                return url;
            },
            providesTags: ['Payment']
        }),
        getSellerPaymentStats: builder.query({
            query: ({ year, month, day } = {}) => {
                let url = `/api/payments/seller/stats?`;
                if (year) url += `&year=${year}`;
                if (month) url += `&month=${month}`;
                if (day) url += `&day=${day}`;
                return url;
            },
            providesTags: ['Payment']
        })
    })
});
export const { useGetSellerPaymentsQuery, useGetSellerPaymentStatsQuery } = paymentApi;
