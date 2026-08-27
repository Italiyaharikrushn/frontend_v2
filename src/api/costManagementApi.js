import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBaseQuery } from '../utils/apiHelpers';

export const costManagementApi = createApi({
    reducerPath: "costManagementApi",
    tagTypes: ['MonthlyCostReport', 'YearlyCostReport', 'DailyCost', 'ShippingCost'],
    baseQuery: customFetchBaseQuery,

    endpoints: (builder) => ({
        getMonthlyCostReport: builder.query({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params?.month) queryParams.append("month", params.month);
                if (params?.year) queryParams.append("year", params.year);
                if (params?.fromDate) queryParams.append("fromDate", params.fromDate);
                if (params?.toDate) queryParams.append("toDate", params.toDate);
                const queryString = queryParams.toString();
                return queryString ? `/api/admin/daily-costs/reports/monthly?${queryString}` : "/api/admin/daily-costs/reports/monthly";
            },
            providesTags: ['MonthlyCostReport', 'DailyCost', 'ShippingCost'],
        }),

        getYearlyCostReport: builder.query({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params?.year) queryParams.append("year", params.year);
                const queryString = queryParams.toString();
                return queryString ? `/api/admin/daily-costs/reports/yearly?${queryString}` : "/api/admin/daily-costs/reports/yearly";
            },
            providesTags: ['YearlyCostReport', 'DailyCost', 'ShippingCost'],
        }),

        getDailyCosts: builder.query({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params?.page !== undefined) queryParams.append("page", params.page);
                if (params?.size !== undefined) queryParams.append("size", params.size);
                const queryString = queryParams.toString();
                return queryString ? `/api/admin/daily-costs?${queryString}` : "/api/admin/daily-costs";
            },
            providesTags: ['DailyCost'],
        }),

        createDailyCost: builder.mutation({
            query: (data) => ({
                url: "/api/admin/daily-costs",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ['DailyCost', 'MonthlyCostReport', 'YearlyCostReport'],
        }),
        updateDailyCost: builder.mutation({
            query: ({ id, data }) => ({
                url: `/api/admin/daily-costs/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ['DailyCost', 'MonthlyCostReport', 'YearlyCostReport'],
        }),

        deleteDailyCost: builder.mutation({
            query: (id) => ({
                url: `/api/admin/daily-costs/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['DailyCost', 'MonthlyCostReport', 'YearlyCostReport'],
        }),

        getShippingCosts: builder.query({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params?.page !== undefined) queryParams.append("page", params.page);
                if (params?.size !== undefined) queryParams.append("size", params.size);
                const queryString = queryParams.toString();
                return queryString ? `/api/admin/shipping-costs?${queryString}` : "/api/admin/shipping-costs";
            },
            providesTags: ['ShippingCost'],
        }),

        createShippingCost: builder.mutation({
            query: (data) => ({
                url: "/api/admin/shipping-costs",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ['ShippingCost', 'MonthlyCostReport', 'YearlyCostReport'],
        }),

        updateShippingCost: builder.mutation({
            query: ({ id, data }) => ({
                url: `/api/admin/shipping-costs/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ['ShippingCost', 'MonthlyCostReport', 'YearlyCostReport'],
        }),

        deleteShippingCost: builder.mutation({
            query: (id) => ({
                url: `/api/admin/shipping-costs/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['ShippingCost', 'MonthlyCostReport', 'YearlyCostReport'],
        }),
    }),
});

export const {
    useGetMonthlyCostReportQuery,
    useGetYearlyCostReportQuery,
    useGetDailyCostsQuery,
    useCreateDailyCostMutation,
    useUpdateDailyCostMutation,
    useDeleteDailyCostMutation,
    useGetShippingCostsQuery,
    useCreateShippingCostMutation,
    useUpdateShippingCostMutation,
    useDeleteShippingCostMutation,
} = costManagementApi;
