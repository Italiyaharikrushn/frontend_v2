import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const contactApi = createApi({
    reducerPath: 'contactApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: import.meta.env.VITE_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.token || localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
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
