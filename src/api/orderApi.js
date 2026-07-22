import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const orderApi = createApi({
    reducerPath: 'orderApi',
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
            invalidatesTags: ['Order'] // Trigger admin dashboard refetch if they are logged in
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
    useAddAddressMutation,
    useAddToBackendCartMutation,
    useClearBackendCartMutation,
    useCheckoutOrderMutation,
    useGetCustomerOrdersQuery
} = orderApi;

