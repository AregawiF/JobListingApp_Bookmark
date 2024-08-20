import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

export const opportunityApi = createApi({
    reducerPath: "opportunities",
    baseQuery: fetchBaseQuery({
    baseUrl: "https://akil-backend.onrender.com/",
    prepareHeaders: async (headers) => {
      const session = await getSession();
      if (session && session.user?.accessToken) {
        headers.set('Authorization', `Bearer ${session.user.accessToken}`);
      }
      return headers;
    }
  }),
    endpoints: (builder) => ({
        getAllOpportunities: builder.query({
            query: () => "/opportunities/search",
            // keepUnusedDataFor: 6,
        }),
        getSingleOpportinity: builder.query({
            query: (id) => `/opportunities/${id}`,
            // keepUnusedDataFor: 6,
        }),
        getAllBookmarks: builder.query({
            query: () => "/bookmarks",
            // keepUnusedDataFor: 6,
        }),
        createBookmark: builder.mutation({
            query: (eventId) => ({
                url: `/bookmarks/${eventId}`,
                method: 'POST',
            }),
        }),
        deleteBookmark: builder.mutation({
            query: (eventId) => ({
                url: `/bookmarks/${eventId}`,
                method: 'DELETE',
            }),
        }),
    })
})

export const { useGetAllOpportunitiesQuery, useGetSingleOpportinityQuery, useGetAllBookmarksQuery, useCreateBookmarkMutation, useDeleteBookmarkMutation } = opportunityApi