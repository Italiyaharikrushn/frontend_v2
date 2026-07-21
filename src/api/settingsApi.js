import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const settingsApi = createApi({
    reducerPath: "settingsApi",
    tagTypes: ['Settings'],
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
        getStoreSettings: builder.query({
            query: () => "/api/settings/get",
            providesTags: ['Settings'],
        }),

        getPublicStoreSettings: builder.query({
            query: () => "/api/settings/public",
            providesTags: ['Settings'],
        }),

        updateStoreSettings: builder.mutation({
            query: (data) => ({
                url: "/api/settings/update",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ['Settings'],
        }),
    }),
});

export const {
    useGetStoreSettingsQuery,
    useGetPublicStoreSettingsQuery,
    useUpdateStoreSettingsMutation,
} = settingsApi;
