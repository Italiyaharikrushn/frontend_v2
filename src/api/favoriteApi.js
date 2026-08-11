import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBaseQuery } from '../utils/apiHelpers';

export const favoriteApi = createApi({
    reducerPath: "favoriteApi",
    tagTypes: ['Favorite'],
    baseQuery: customFetchBaseQuery,

    endpoints: (builder) => ({
        getFavorites: builder.query({
            query: () => "/api/favorites/",
            providesTags: ['Favorite'],
        }),
        toggleFavorite: builder.mutation({
            query: (productId) => ({
                url: `/api/favorites/toggle/${productId}`,
                method: 'POST',
            }),
            invalidatesTags: ['Favorite'],
        }),
    }),
});

export const {
    useGetFavoritesQuery,
    useToggleFavoriteMutation,
} = favoriteApi;
