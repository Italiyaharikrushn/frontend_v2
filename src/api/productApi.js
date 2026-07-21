import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
    reducerPath: "productApi",
    tagTypes: ['Product'],
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.token || localStorage.getItem('token');
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),

    endpoints: (builder) => ({
        createProduct: builder.mutation({
            query: (data) => {
                const formData = new FormData();
                formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));

                return {
                    url: "/product/add-product",
                    method: "POST",
                    body: formData,
                };
            },
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
            query: ({ id, data }) => {
                const formData = new FormData();
                formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));

                return {
                    url: `/product/update/${id}`,
                    method: "PUT",
                    body: formData,
                };
            },
            invalidatesTags: ['Product'],
        }),

        getProducts: builder.query({
            query: () => "/product/all",
            providesTags: ['Product'],
        }),

        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/product/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Product'],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useBulkUploadProductsMutation,
} = productApi;
