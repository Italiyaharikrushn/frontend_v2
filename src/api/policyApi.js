import { createApi } from '@reduxjs/toolkit/query/react';
import { customFetchBaseQuery } from '../utils/apiHelpers';

export const policyApi = createApi({
    reducerPath: 'policyApi',
    baseQuery: customFetchBaseQuery,
    tagTypes: ['Policy'],
    endpoints: (builder) => ({
        getStorePolicy: builder.query({
            query: () => 'api/policy/store',
            providesTags: ['Policy']
        }),
        updateStorePolicy: builder.mutation({
            query: (policyData) => ({
                url: 'api/policy/store',
                method: 'PUT',
                body: policyData
            }),
            invalidatesTags: ['Policy']
        })
    })
});

export const {
    useGetStorePolicyQuery,
    useUpdateStorePolicyMutation
} = policyApi;
