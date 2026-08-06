import { createApi } from '@reduxjs/toolkit/query/react';
import { customFetchBaseQuery } from '../utils/apiHelpers';

export const returnApi = createApi({
    reducerPath: 'returnApi',
    baseQuery: customFetchBaseQuery,
    tagTypes: ['ReturnRequest'],
    endpoints: (builder) => ({
        createReturnRequest: builder.mutation({
            query: (returnData) => ({
                url: 'api/returns/create',
                method: 'POST',
                body: returnData
            }),
            invalidatesTags: ['ReturnRequest']
        }),
        getUserReturnRequests: builder.query({
            query: () => 'api/returns/user',
            providesTags: ['ReturnRequest']
        }),
        getAllReturnRequests: builder.query({
            query: () => 'api/returns/admin/all',
            providesTags: ['ReturnRequest']
        }),
        updateReturnStatus: builder.mutation({
            query: ({ id, statusData }) => ({
                url: `api/returns/admin/${id}/status`,
                method: 'PUT',
                body: statusData
            }),
            invalidatesTags: ['ReturnRequest']
        })
    })
});

export const {
    useCreateReturnRequestMutation,
    useGetUserReturnRequestsQuery,
    useGetAllReturnRequestsQuery,
    useUpdateReturnStatusMutation
} = returnApi;
