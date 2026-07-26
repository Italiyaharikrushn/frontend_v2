import { createApi } from '@reduxjs/toolkit/query/react';
import { customFetchBaseQuery } from '../utils/apiHelpers';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: customFetchBaseQuery,
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials
            })
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData
            })
        }),
        changePassword: builder.mutation({
            query: (data) => ({
                url: '/auth/change-password',
                method: 'POST',
                body: data
            })
        }),
        getCustomers: builder.query({
            query: () => '/auth/customers'
        })
    })
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useChangePasswordMutation,
    useGetCustomersQuery
} = authApi;
