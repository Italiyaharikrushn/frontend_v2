import { createApi } from '@reduxjs/toolkit/query/react';
import { createCustomBaseQuery } from '../utils/apiHelpers';

export const couponApi = createApi({
    reducerPath: 'couponApi',
    baseQuery: createCustomBaseQuery('/api/seller'),
    tagTypes: ['Coupon'],

    endpoints: (builder) => ({
        getCoupons: builder.query({
            query: () => "/coupons",
            transformResponse: (response) => {
                if (!response || response.length === 0) {
                    return [
                        { id: 1, code: 'WELCOME10', discountType: 'PERCENTAGE', discountAmount: 10, minimumOrderValue: 500, active: true },
                        { id: 2, code: 'FLAT500', discountType: 'FIXED', discountAmount: 500, minimumOrderValue: 2000, active: true },
                        { id: 3, code: 'SUMMER20', discountType: 'PERCENTAGE', discountAmount: 20, minimumOrderValue: 1500, active: false },
                    ];
                }
                return response;
            },
            providesTags: ['Coupon'],
        }),
        createCoupon: builder.mutation({
            query: (data) => ({
                url: "/coupons",
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Coupon'],
        }),
        deleteCoupon: builder.mutation({
            query: (id) => ({
                url: `/coupons/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Coupon'],
        }),
    }),
});

export const {
    useGetCouponsQuery,
    useCreateCouponMutation,
    useDeleteCouponMutation,
} = couponApi;
