import { createApi } from '@reduxjs/toolkit/query/react';
import { customFetchBaseQuery } from '../utils/apiHelpers';

export const addressApi = createApi({
    reducerPath: 'addressApi',
    baseQuery: customFetchBaseQuery,
    tagTypes: ['ShippingAddress', 'BillingAddress'],
    endpoints: (builder) => ({
        // Shipping Address Endpoints
        getShippingAddresses: builder.query({
            query: () => "/api/customer/shipping-addresses",
            providesTags: ['ShippingAddress']
        }),
        addShippingAddress: builder.mutation({
            query: (addressData) => ({
                url: "/api/customer/shipping-addresses",
                method: "POST",
                body: addressData
            }),
            invalidatesTags: ['ShippingAddress']
        }),
        updateShippingAddress: builder.mutation({
            query: ({ id, ...addressData }) => ({
                url: `/api/customer/shipping-addresses/${id}`,
                method: "PUT",
                body: addressData
            }),
            invalidatesTags: ['ShippingAddress']
        }),
        deleteShippingAddress: builder.mutation({
            query: (id) => ({
                url: `/api/customer/shipping-addresses/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['ShippingAddress']
        }),
        setDefaultShippingAddress: builder.mutation({
            query: (id) => ({
                url: `/api/customer/shipping-addresses/${id}/default`,
                method: "PATCH"
            }),
            invalidatesTags: ['ShippingAddress']
        }),

        // Billing Address Endpoints
        getBillingAddresses: builder.query({
            query: () => "/api/customer/billing-addresses",
            providesTags: ['BillingAddress']
        }),
        addBillingAddress: builder.mutation({
            query: (addressData) => ({
                url: "/api/customer/billing-addresses",
                method: "POST",
                body: addressData
            }),
            invalidatesTags: ['BillingAddress']
        }),
        updateBillingAddress: builder.mutation({
            query: ({ id, ...addressData }) => ({
                url: `/api/customer/billing-addresses/${id}`,
                method: "PUT",
                body: addressData
            }),
            invalidatesTags: ['BillingAddress']
        }),
        deleteBillingAddress: builder.mutation({
            query: (id) => ({
                url: `/api/customer/billing-addresses/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['BillingAddress']
        }),
        setDefaultBillingAddress: builder.mutation({
            query: (id) => ({
                url: `/api/customer/billing-addresses/${id}/default`,
                method: "PATCH"
            }),
            invalidatesTags: ['BillingAddress']
        })
    })
});

export const {
    useGetShippingAddressesQuery,
    useAddShippingAddressMutation,
    useUpdateShippingAddressMutation,
    useDeleteShippingAddressMutation,
    useSetDefaultShippingAddressMutation,
    useGetBillingAddressesQuery,
    useAddBillingAddressMutation,
    useUpdateBillingAddressMutation,
    useDeleteBillingAddressMutation,
    useSetDefaultBillingAddressMutation
} = addressApi;
