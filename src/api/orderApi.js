import { createApi } from '@reduxjs/toolkit/query/react';
import { customFetchBaseQuery } from '../utils/apiHelpers';

export const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: customFetchBaseQuery,
    tagTypes: ['Order'],
    endpoints: (builder) => ({
        getSellerOrders: builder.query({
            query: () => "/api/orders/seller/all",
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
            })
        }),

        addToBackendCart: builder.mutation({
            query: ({ productId, quantity }) => ({
                url: `/api/cart/add?productId=${productId}&quantity=${quantity}`,
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
            query: (addressId) => ({
                url: `/api/orders/checkout?addressId=${addressId}`,
                method: "POST"
            }),
            invalidatesTags: ['Order']
        }),

        getCustomerOrders: builder.query({
            query: () => "/api/orders/history",
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
    useReturnCustomerOrderMutation,
    useCancelCustomerOrderMutation,
    useAddAddressMutation,
    useAddToBackendCartMutation,
    useClearBackendCartMutation,
    useCheckoutOrderMutation,
    useGetCustomerOrdersQuery
} = orderApi;

