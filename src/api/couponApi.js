import { createApi } from '@reduxjs/toolkit/query/react';
import { customFetchBaseQuery } from '../utils/apiHelpers';

export const couponApi = createApi({
    reducerPath: 'couponApi',
    baseQuery: customFetchBaseQuery,
    tagTypes: ['Coupon'],

    endpoints: (builder) => ({
        getCoupons: builder.query({
            query: () => "/api/coupons",
            providesTags: ['Coupon'],
        }),
        createCoupon: builder.mutation({
            query: (data) => ({
                url: "/api/coupons",
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Coupon'],
        }),
        updateCoupon: builder.mutation({
            query: ({ id, ...coupon }) => ({
                url: `/api/coupons/${id}`,
                method: 'PUT',
                body: coupon
            }),
            invalidatesTags: ['Coupon'],
        }),
        deleteCoupon: builder.mutation({
            query: (id) => ({
                url: `/api/coupons/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Coupon'],
        }),
        validateCoupon: builder.mutation({
            query: ({ code, cartTotal }) => ({
                url: '/api/coupons/validate',
                method: 'POST',
                body: { code, cartTotal }
            })
        }),
    }),
});

export const {
    useGetCouponsQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
    useValidateCouponMutation,
} = couponApi;

