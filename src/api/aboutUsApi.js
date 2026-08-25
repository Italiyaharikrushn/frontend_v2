import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBaseQuery } from '../utils/apiHelpers';

export const aboutUsApi = createApi({
    reducerPath: "aboutUsApi",
    tagTypes: ['AboutUs'],
    baseQuery: customFetchBaseQuery,
    endpoints: (builder) => ({
        getAllWorks: builder.query({
            query: () => "/api/about-us/public",
            providesTags: ['AboutUs'],
        }),
        createWork: builder.mutation({
            query: (data) => ({
                url: "/api/about-us/admin/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ['AboutUs'],
        }),
        updateWork: builder.mutation({
            query: (data) => ({
                url: `/api/about-us/admin/update/${data.id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ['AboutUs'],
        }),
        deleteWork: builder.mutation({
            query: (id) => ({
                url: `/api/about-us/admin/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['AboutUs'],
        }),
    }),
});

export const {
    useGetAllWorksQuery,
    useCreateWorkMutation,
    useUpdateWorkMutation,
    useDeleteWorkMutation,
} = aboutUsApi;
