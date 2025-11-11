// src/services/brand.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { token } from "../utils/token";

export const brandApi = createApi({
  reducerPath: "brandApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      if (token()) headers.set("Authorization", `Bearer ${token()}`);
      return headers;
    },
  }),
  tagTypes: ["Brand"],
  endpoints: (builder) => ({
    // GET /api/brands?page=&limit=&isActive=&order=&name=
    getBrands: builder.query({
      query: ({
        page = 1,
        limit = 10,
        isActive,
        order = "desc",
        name,
      } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", limit);
        if (isActive !== undefined) params.set("isActive", isActive);
        if (order) params.set("order", order);
        if (name) params.set("name", name);
        return `api/brands?${params.toString()}`;
      },
      transformResponse: (response) => ({
        brands: Array.isArray(response.brands) ? response.brands : [],
        meta: response.meta || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.brands.map((b) => ({ type: "Brand", id: b.id })),
              { type: "Brand", id: "LIST" },
            ]
          : [{ type: "Brand", id: "LIST" }],
    }),

    // GET /api/brands/:id
    getBrandById: builder.query({
      query: (id) => `api/brands/${id}`,
      transformResponse: (response) => ({
        brand: response.brand || null,
      }),
      providesTags: (result, error, id) => [{ type: "Brand", id }],
    }),

    // Create brand (formData expected, with single file 'logo')
    createBrand: builder.mutation({
      query: (formData) => ({
        url: "api/brands",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Brand", id: "LIST" }],
    }),

    // Update brand (id + formData)
    updateBrand: builder.mutation({
      query: ({ id, formData }) => ({
        url: `api/brands/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Brand", id },
        { type: "Brand", id: "LIST" },
      ],
    }),

    // Delete brand
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `api/brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Brand", id: "LIST" }],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useGetBrandByIdQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;
