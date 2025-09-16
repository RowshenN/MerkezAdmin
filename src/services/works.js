import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { token } from "../utils/token";

export const worksApi = createApi({
  reducerPath: "worksApi",
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
  tagTypes: ["Works"],
  endpoints: (builder) => ({
    // Get all works
    getAllWorks: builder.query({
      query: (params) => {
        const query = new URLSearchParams(params).toString();
        return `api/works/all?${query}`;
      },
      providesTags: ["Works"],
    }),

    // Get one work by ID
    getWork: builder.query({
      query: (id) => `api/works/${id}`,
      providesTags: (result, error, id) => [{ type: "Works", id }],
    }),

    // Create a new work
    createWork: builder.mutation({
      query: (formData) => ({
        url: "api/works/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Works"],
    }),

    // Update a work
    updateWork: builder.mutation({
      query: (formData) => ({
        url: "api/works/update",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Works"],
    }),
    // Soft delete a work
    deleteWork: builder.mutation({
      query: (id) => ({
        url: `api/works/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Works"],
    }),

    // Undelete a work
    undeleteWork: builder.mutation({
      query: (id) => ({
        url: `api/works/undelete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Works"],
    }),

    // Hard destroy a work
    destroyWork: builder.mutation({
      query: (id) => ({
        url: `api/works/destroy/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Works"],
    }),
  }),
});

export const {
  useGetAllWorksQuery,
  useGetWorkQuery,
  useCreateWorkMutation,
  useUpdateWorkMutation,
  useDeleteWorkMutation,
  useUndeleteWorkMutation,
  useDestroyWorkMutation,
} = worksApi;
