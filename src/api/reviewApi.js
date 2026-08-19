import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBaseQuery } from '../utils/apiHelpers';

export const reviewApi = createApi({
    reducerPath: "reviewApi",
    tagTypes: ['Review', 'Product'],
    baseQuery: customFetchBaseQuery,

    endpoints: (builder) => ({
        getReviewsByProduct: builder.query({
            query: (productId) => `/api/reviews/product/${productId}`,
            providesTags: ['Review'],
        }),

        addOrUpdateReview: builder.mutation({
            query: ({ productId, data }) => ({
                url: `/api/reviews/product/${productId}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ['Review', 'Product'],
        }),

        getCanReviewProduct: builder.query({
            query: (productId) => `/api/reviews/can-review/${productId}`,
            providesTags: ['Review'],
        }),

        getAllReviewsAdmin: builder.query({
            query: ({ page = 0, size = 10 }) => `/api/reviews/admin/all?page=${page}&size=${size}`,
            providesTags: ['Review'],
        }),

        deleteReviewAdmin: builder.mutation({
            query: (reviewId) => ({
                url: `/api/reviews/admin/${reviewId}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Review', 'Product'],
        }),
    }),
});

export const {
    useGetReviewsByProductQuery,
    useAddOrUpdateReviewMutation,
    useGetCanReviewProductQuery,
    useGetAllReviewsAdminQuery,
    useDeleteReviewAdminMutation,
} = reviewApi;
