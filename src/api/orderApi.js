import { createApi } from '@reduxjs/toolkit/query/react';
import { customFetchBaseQuery } from '../utils/apiHelpers';

export const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: customFetchBaseQuery,
    tagTypes: ['Order'],
    endpoints: (builder) => ({
        getSellerOrders: builder.query({
            query: (params) => {
                if (!params) return "/api/orders/seller/all";
                const queryParams = new URLSearchParams();
                if (params.page !== undefined) queryParams.append("page", params.page);
                if (params.size !== undefined) queryParams.append("size", params.size);
                if (params.status) queryParams.append("status", params.status);
                const queryString = queryParams.toString();
                return queryString ? `/api/orders/seller/all?${queryString}` : "/api/orders/seller/all";
            },
            transformResponse: (response) => {
                if (response && response.message) {
                    console.log(response.message);
                    return [];
                }
                return response || [];
            },
            providesTags: ['Order'],
        }),

        updateOrderStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/api/orders/seller/update-status/${id}?status=${status}`,
                method: 'PUT'
            }),
            invalidatesTags: ['Order'],
        }),

        markLabelsDownloaded: builder.mutation({
            query: (orderIds) => ({
                url: `/api/orders/seller/mark-labels-downloaded`,
                method: 'PUT',
                body: orderIds
            }),
            invalidatesTags: ['Order'],
        }),

        returnCustomerOrder: builder.mutation({
            query: (id) => ({
                url: `/api/orders/customer/return/${id}`,
                method: 'PUT'
            }),
            invalidatesTags: ['Order'],
        }),

        cancelCustomerOrder: builder.mutation({
            query: (id) => ({
                url: `/api/orders/customer/cancel/${id}`,
                method: 'PUT'
            }),
            invalidatesTags: ['Order'],
        }),


        // Checkout flow endpoints
        addAddress: builder.mutation({
            query: (addressData) => ({
                url: "/api/address/add",
                method: "POST",
                body: addressData
            }),
            invalidatesTags: ['Order']
        }),

        getUserAddresses: builder.query({
            query: () => "/api/address/user",
            providesTags: ['Order'],
        }),

        addToBackendCart: builder.mutation({
            query: ({ productId, quantity, phoneModel }) => ({
                url: `/api/cart/add?productId=${productId}&quantity=${quantity}${phoneModel ? `&phoneModel=${encodeURIComponent(phoneModel)}` : ''}`,
                method: "POST"
            })
        }),

        clearBackendCart: builder.mutation({
            query: () => ({
                url: "/api/cart/clear",
                method: "DELETE"
            })
        }),

        checkoutOrder: builder.mutation({
            query: ({addressId, couponCode}) => {
                let url = `/api/orders/checkout?addressId=${addressId}`;
                if (couponCode) {
                    url += `&couponCode=${encodeURIComponent(couponCode)}`;
                }
                return {
                    url: url,
                    method: "POST"
                };
            },
            invalidatesTags: ['Order']
        }),

        validateCoupon: builder.mutation({
            query: ({code, cartTotal}) => ({
                url: `/api/coupons/validate`,
                method: 'POST',
                body: {code, cartTotal}
            })
        }),
        
        getCoupons: builder.query({
            query: () => `/api/coupons`,
            providesTags: ['Order']
        }),

        createCoupon: builder.mutation({
            query: (coupon) => ({
                url: `/api/coupons`,
                method: 'POST',
                body: coupon
            }),
            invalidatesTags: ['Order']
        }),

        updateCoupon: builder.mutation({
            query: ({ id, ...coupon }) => ({
                url: `/api/coupons/${id}`,
                method: 'PUT',
                body: coupon
            }),
            invalidatesTags: ['Order']
        }),

        deleteCoupon: builder.mutation({
            query: (id) => ({
                url: `/api/coupons/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Order']
        }),

        getCustomerOrders: builder.query({
            query: (params) => {
                if (!params) return "/api/orders/history";
                const queryParams = new URLSearchParams();
                if (params.page !== undefined) queryParams.append("page", params.page);
                if (params.size !== undefined) queryParams.append("size", params.size);
                if (params.status) queryParams.append("status", params.status);
                const queryString = queryParams.toString();
                return queryString ? `/api/orders/history?${queryString}` : "/api/orders/history";
            },
            transformResponse: (response) => {
                if (response && response.message) {
                    console.log(response.message);
                    return [];
                }
                return response || [];
            },
            providesTags: ['Order'],
        })
    }),
});

export const {
    useGetSellerOrdersQuery,
    useUpdateOrderStatusMutation,
    useMarkLabelsDownloadedMutation,
    useReturnCustomerOrderMutation,
    useCancelCustomerOrderMutation,
    useAddAddressMutation,
    useGetUserAddressesQuery,
    useAddToBackendCartMutation,
    useClearBackendCartMutation,
    useCheckoutOrderMutation,
    useGetCustomerOrdersQuery,
    useValidateCouponMutation,
    useGetCouponsQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation
} = orderApi;

