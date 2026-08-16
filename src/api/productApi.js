import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBaseQuery } from '../utils/apiHelpers';

export const productApi = createApi({
    reducerPath: "productApi",
    tagTypes: ['Product'],
    baseQuery: customFetchBaseQuery,

    endpoints: (builder) => ({
        createProduct: builder.mutation({
            query: (data) => ({
                url: "/product/add-product",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),

        bulkUploadProducts: builder.mutation({
            query: (file) => {
                const formData = new FormData();
                formData.append("file", file);

                return {
                    url: "/product/bulk-upload",
                    method: "POST",
                    body: formData
                };
            },
            invalidatesTags: ['Product'],
        }),

        UpdateProduct: builder.mutation({
            query: ({ id, data }) => ({
                url: `/product/update/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),

        getProducts: builder.query({
            query: (params) => {
                if (!params) return "/product/all";
                if (typeof params === 'string') return `/product/all${params}`;
                const queryParams = new URLSearchParams();
                if (params.page !== undefined && params.page !== null) queryParams.append("page", params.page);
                if (params.size !== undefined && params.size !== null) queryParams.append("size", params.size);
                if (params.category && params.category !== "All" && params.category !== "all") {
                    queryParams.append("category", params.category);
                }
                if (params.search) queryParams.append("search", params.search);
                const queryString = queryParams.toString();
                return queryString ? `/product/all?${queryString}` : "/product/all";
            },
            providesTags: ['Product'],
        }),

        getProductsByIds: builder.mutation({
            query: (ids) => ({
                url: "/product/by-ids",
                method: "POST",
                body: ids
            }),
        }),

        getCategories: builder.query({
            query: () => "/product/categories",
            providesTags: ['Product'],
        }),


        getProductById: builder.query({
            query: (id) => `/product/${id}`,
            providesTags: ['Product'],
        }),

        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/product/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Product'],
        }),

        applyDiscount: builder.mutation({
            query: (data) => ({
                url: '/product/apply-discount',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),

        applyCategoryDiscount: builder.mutation({
            query: (discountData) => ({
                url: '/product/apply-category-discount',
                method: 'POST',
                body: discountData,
            }),
            invalidatesTags: ['Product'],
        }),

        decodeUrl: builder.mutation({
            query: (url) => ({
                url: `/api/utils/decode-url?url=${encodeURIComponent(url)}`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetCategoriesQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useBulkUploadProductsMutation,
    useApplyDiscountMutation,
    useApplyCategoryDiscountMutation,
    useDecodeUrlMutation,
    useGetProductsByIdsMutation,
} = productApi;
