import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBaseQuery } from '../utils/apiHelpers';

export const costManagementApi = createApi({
    reducerPath: "costManagementApi",
    tagTypes: ['MonthlyCostReport', 'YearlyCostReport', 'DailyCost', 'ShippingCost', 'CostAnalytics', 'CostFilters'],
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

        getCostAnalytics: builder.query({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params?.view) queryParams.append("view", params.view);
                if (params?.date) queryParams.append("date", params.date);
                if (params?.fromYear) queryParams.append("fromYear", params.fromYear);
                if (params?.toYear) queryParams.append("toYear", params.toYear);
                if (params?.category && params.category !== 'All') queryParams.append("category", params.category);
                if (params?.costType && params.costType !== 'All') queryParams.append("costType", params.costType);
                if (params?.comparison) queryParams.append("comparison", params.comparison);
                const queryString = queryParams.toString();
                return queryString ? `/api/admin/costs/analytics?${queryString}` : "/api/admin/costs/analytics";
            },
            providesTags: ['CostAnalytics'],
        }),

        getCostFilters: builder.query({
            query: () => "/api/admin/costs/analytics/filters",
            providesTags: ['CostFilters'],
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

        getYesterdayDailyCosts: builder.query({
            query: () => "/api/admin/daily-costs/yesterday",
            providesTags: ['DailyCost'],
        }),

        createDailyCost: builder.mutation({
            query: (data) => ({
                url: "/api/admin/daily-costs",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ['DailyCost', 'MonthlyCostReport', 'YearlyCostReport', 'CostAnalytics', 'CostFilters'],
        }),
        updateDailyCost: builder.mutation({
            query: ({ id, data }) => ({
                url: `/api/admin/daily-costs/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ['DailyCost', 'MonthlyCostReport', 'YearlyCostReport', 'CostAnalytics', 'CostFilters'],
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
    useGetYesterdayDailyCostsQuery,
    useCreateDailyCostMutation,
    useUpdateDailyCostMutation,
    useDeleteDailyCostMutation,
    useGetShippingCostsQuery,
    useCreateShippingCostMutation,
    useUpdateShippingCostMutation,
    useDeleteShippingCostMutation,
    useGetCostAnalyticsQuery,
    useGetCostFiltersQuery,
} = costManagementApi;
