import { createApi } from '@reduxjs/toolkit/query/react';
import { customFetchBaseQuery } from '../utils/apiHelpers';

export const policyApi = createApi({
    reducerPath: 'policyApi',
    baseQuery: customFetchBaseQuery,
    tagTypes: ['Policy'],
    endpoints: (builder) => ({
        getReturnPolicy: builder.query({
            query: () => 'api/policy/return',
            providesTags: ['Policy']
        }),
        updateReturnPolicy: builder.mutation({
            query: (policyData) => ({
                url: 'api/policy/return',
                method: 'PUT',
                body: policyData
            }),
            invalidatesTags: ['Policy']
        })
    })
});

export const {
    useGetReturnPolicyQuery,
    useUpdateReturnPolicyMutation
} = policyApi;
