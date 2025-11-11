import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { token } from "../utils/token";

export const attributeApi = createApi({
  reducerPath: "attributeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      if (token()) headers.set("Authorization", `Bearer ${token()}`);
      return headers;
    },
  }),
  tagTypes: ["Attribute"],
  endpoints: (builder) => ({
    // ✅ Get all attributes (admin/superadmin)
    getAllAttributes: builder.query({
      query: () => `api/attributes`,
      providesTags: ["Attribute"],
    }),

    // ✅ Get attributes by category
    getAttributesByCategory: builder.query({
      query: (categoryId) => `api/attributes/category/${categoryId}`,
      providesTags: ["Attribute"],
    }),

    // ✅ Create attribute
    createAttribute: builder.mutation({
      query: (data) => ({
        url: `api/attributes`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Attribute"],
    }),

    // ✅ Update attribute
    updateAttribute: builder.mutation({
      query: ({ id, data }) => ({
        url: `api/attributes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Attribute"],
    }),

    // ✅ Delete attribute
    deleteAttribute: builder.mutation({
      query: (id) => ({
        url: `api/attributes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Attribute"],
    }),
    // ✅ getOne attribute
    getAttributeById: builder.query({
      query: (id) => `api/attributes/${id}`,
      providesTags: ["Attribute"],
    }),
  }),
});

export const {
  useGetAllAttributesQuery,
  useGetAttributesByCategoryQuery,
  useCreateAttributeMutation,
  useUpdateAttributeMutation,
  useDeleteAttributeMutation,
  useGetAttributeByIdQuery,
} = attributeApi;
