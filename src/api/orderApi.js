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
                if (params.search) queryParams.append("search", params.search);
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

        getSellerAnalytics: builder.query({
            query: (days = 30) => `/api/orders/seller/analytics/sales?days=${days}`,
            providesTags: ['Order'],
        }),

        getProductSalesReport: builder.query({
            query: ({ month, year }) => {
                const params = new URLSearchParams();
                if (month) params.append('month', month);
                if (year) params.append('year', year);
                return `/api/orders/seller/analytics/product-sales-report?${params.toString()}`;
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

        updateAddress: builder.mutation({
            query: ({ id, ...addressData }) => ({
                url: `/api/address/update/${id}`,
                method: "PUT",
                body: addressData
            }),
            invalidatesTags: ['Order']
        }),

        deleteAddress: builder.mutation({
            query: (id) => ({
                url: `/api/address/delete/${id}`,
                method: "DELETE"
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

        getBackendCart: builder.query({
            query: () => "/api/cart/"
        }),

        syncBackendCart: builder.mutation({
            query: (cartItems) => ({
                url: "/api/cart/sync",
                method: "POST",
                body: cartItems
            })
        }),

        checkoutOrder: builder.mutation({
            query: ({ addressId, billingAddressId, couponCode, paymentMethod, razorpayPaymentId, razorpayOrderId, razorpaySignature }) => {
                let url = `/api/orders/checkout?addressId=${addressId}`;
                if (billingAddressId) {
                    url += `&billingAddressId=${billingAddressId}`;
                }
                if (couponCode) {
                    url += `&couponCode=${encodeURIComponent(couponCode)}`;
                }
                if (paymentMethod) {
                    url += `&paymentMethod=${encodeURIComponent(paymentMethod)}`;
                }
                if (razorpayPaymentId) {
                    url += `&razorpayPaymentId=${encodeURIComponent(razorpayPaymentId)}`;
                }
                if (razorpayOrderId) {
                    url += `&razorpayOrderId=${encodeURIComponent(razorpayOrderId)}`;
                }
                if (razorpaySignature) {
                    url += `&razorpaySignature=${encodeURIComponent(razorpaySignature)}`;
                }
                return {
                    url: url,
                    method: "POST"
                };
            },
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
        }),
        
        createRazorpayOrder: builder.mutation({
            query: ({ addressId, couponCode }) => {
                let url = `/api/orders/create-razorpay-order?`;
                if (addressId) url += `addressId=${addressId}&`;
                if (couponCode) url += `couponCode=${encodeURIComponent(couponCode)}&`;
                return {
                    url: url,
                    method: "POST"
                };
            }
        })
    }),
});

export const {
    useGetSellerOrdersQuery,
    useGetSellerAnalyticsQuery,
    useGetProductSalesReportQuery,
    useUpdateOrderStatusMutation,
    useMarkLabelsDownloadedMutation,
    useReturnCustomerOrderMutation,
    useCancelCustomerOrderMutation,
    useAddAddressMutation,
    useUpdateAddressMutation,
    useDeleteAddressMutation,
    useGetUserAddressesQuery,
    useAddToBackendCartMutation,
    useClearBackendCartMutation,
    useCheckoutOrderMutation,
    useGetCustomerOrdersQuery,
    useGetBackendCartQuery,
    useSyncBackendCartMutation,
    useCreateRazorpayOrderMutation
} = orderApi;

