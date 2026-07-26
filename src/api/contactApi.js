import { createApi } from '@reduxjs/toolkit/query/react';
import { customFetchBaseQuery } from '../utils/apiHelpers';

export const contactApi = createApi({
    reducerPath: 'contactApi',
    baseQuery: customFetchBaseQuery,
    tagTypes: ['ContactMessage'],
    endpoints: (builder) => ({
        submitMessage: builder.mutation({
            query: (message) => ({
                url: '/api/contact/submit',
                method: 'POST',
                body: message
            }),
            invalidatesTags: ['ContactMessage']
        }),
        getAllMessages: builder.query({
            query: () => '/api/contact/all',
            providesTags: ['ContactMessage']
        }),
        replyToMessage: builder.mutation({
            query: ({ id, replyText }) => ({
                url: `/api/contact/reply/${id}`,
                method: 'PUT',
                body: replyText,
                headers: { 'Content-Type': 'text/plain' }
            }),
            invalidatesTags: ['ContactMessage']
        })
    })
});

export const {
    useSubmitMessageMutation,
    useGetAllMessagesQuery,
    useReplyToMessageMutation
} = contactApi;
