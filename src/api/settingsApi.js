import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBaseQuery } from '../utils/apiHelpers';

export const settingsApi = createApi({
    reducerPath: "settingsApi",
    tagTypes: ['Settings'],
    baseQuery: customFetchBaseQuery,

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

        uploadImage: builder.mutation({
            query: (file) => {
                const formData = new FormData();
                formData.append("file", file);
                return {
                    url: "/api/utils/upload-image",
                    method: "POST",
                    body: formData,
                };
            }
        }),
    }),
});

export const {
    useGetStoreSettingsQuery,
    useGetPublicStoreSettingsQuery,
    useUpdateStoreSettingsMutation,
    useUploadImageMutation,
} = settingsApi;
