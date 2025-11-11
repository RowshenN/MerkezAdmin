// src/services/businessType.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { token } from "../utils/token";

export const businessTypeApi = createApi({
  reducerPath: "businessTypeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      if (token()) headers.set("Authorization", `Bearer ${token()}`);
      return headers;
    },
  }),
  tagTypes: ["BusinessType"],
  endpoints: (builder) => ({
    // ✅ GET all active business types (public)
    getBusinessTypes: builder.query({
      query: () => `api/business-types`,
      transformResponse: (response) =>
        Array.isArray(response) ? response : [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((type) => ({
                type: "BusinessType",
                id: type.id,
              })),
              { type: "BusinessType", id: "LIST" },
            ]
          : [{ type: "BusinessType", id: "LIST" }],
    }),

    // ✅ GET single business type by ID
    getBusinessTypeById: builder.query({
      query: (id) => `api/business-types/${id}`,
      providesTags: (result, error, id) => [{ type: "BusinessType", id }],
    }),

    // ✅ CREATE business type (superadmin only)
    createBusinessType: builder.mutation({
      query: (data) => ({
        url: `api/business-types`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "BusinessType", id: "LIST" }],
    }),

    // ✅ UPDATE business type (superadmin only)
    updateBusinessType: builder.mutation({
      query: ({ id, data }) => ({
        url: `api/business-types/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "BusinessType", id },
        { type: "BusinessType", id: "LIST" },
      ],
    }),

    // ✅ DELETE business type (superadmin only)
    deleteBusinessType: builder.mutation({
      query: (id) => ({
        url: `api/business-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "BusinessType", id: "LIST" }],
    }),
  }),
});

export const {
  useGetBusinessTypesQuery,
  useGetBusinessTypeByIdQuery,
  useCreateBusinessTypeMutation,
  useUpdateBusinessTypeMutation,
  useDeleteBusinessTypeMutation,
} = businessTypeApi;
