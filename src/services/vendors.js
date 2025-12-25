import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { token } from "../utils/token";

export const vendorApi = createApi({
  reducerPath: "vendorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      if (token()) headers.set("Authorization", `Bearer ${token()}`);
      return headers;
    },
  }),

  endpoints: (builder) => ({
    // GET ALL vendors with pagination + search
    getVendors: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: `api/vendors?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
    }),

    // GET vendor by ID
    getVendorById: builder.query({
      query: (id) => `api/vendors/${id}`,
    }),

    // DELETE vendor
    deleteVendor: builder.mutation({
      query: (id) => ({
        url: `api/vendors/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useGetVendorByIdQuery,
  useDeleteVendorMutation,
} = vendorApi;
