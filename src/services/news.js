// services/news.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { token } from "../utils/token";

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      if (token()) {
        headers.set("Authorization", `Bearer ${token()}`);
      }
      return headers;
    },
  }),
  tagTypes: ["News"],
  endpoints: (builder) => ({
    // 1. Get all news
    getAllNews: builder.query({
      query: (params) => {
        const query = new URLSearchParams(params).toString();
        return `api/news/all?${query}`;
      },
      providesTags: ["News"],
    }),

    // 2. Get one news by ID
    getNews: builder.query({
      query: (id) => `api/news/${id}`,
      providesTags: (result, error, id) => [{ type: "News", id }],
    }),

    // 3. Create news
    createNews: builder.mutation({
      query: (formData) => ({
        url: `api/news/create`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["News"],
    }),

    // 4. Update news
    updateNews: builder.mutation({
      query: (formData) => ({
        url: `api/news/update`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["News"],
    }),

    // 5. Soft delete news
    deleteNews: builder.mutation({
      query: (id) => ({
        url: `api/news/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["News"],
    }),

    // 6. Undelete news
    undeleteNews: builder.mutation({
      query: (id) => ({
        url: `api/news/undelete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["News"],
    }),

    // 7. Hard destroy news
    destroyNews: builder.mutation({
      query: (id) => ({
        url: `api/news/destroy/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["News"],
    }),
  }),
});

export const {
  useGetAllNewsQuery,
  useGetNewsQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
  useUndeleteNewsMutation,
  useDestroyNewsMutation,
} = newsApi;
