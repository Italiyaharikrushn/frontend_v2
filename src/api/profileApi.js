import { createApi } from '@reduxjs/toolkit/query/react';
import { createCustomBaseQuery } from '../utils/apiHelpers';

export const profileApi = createApi({
    reducerPath: 'profileApi',
    baseQuery: createCustomBaseQuery('/api/seller'),
    tagTypes: ['Profile'],

    endpoints: (builder) => ({
        getSellerProfile: builder.query({
            query: () => "/profile",
            transformResponse: (response) => {
                if (!response || (!response.shopName && !response.bankName)) {
                    return {
                        id: 1,
                        shopName: 'SuperMart Electronics (Preview)',
                        bankName: 'HDFC Bank',
                        accountNumber: '501002341234',
                        ifscCode: 'HDFC0001234',
                        baseShippingCharge: 50.0
                    };
                }
                return response;
            },
            providesTags: ['Profile'],
        }),
        updateSellerProfile: builder.mutation({
            query: (data) => ({
                url: "/profile",
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Profile'],
        }),
    }),
});

export const {
    useGetSellerProfileQuery,
    useUpdateSellerProfileMutation,
} = profileApi;
