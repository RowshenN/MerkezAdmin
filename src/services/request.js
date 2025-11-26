// services/request.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { token } from "../utils/token";

export const requestApi = createApi({
  reducerPath: "requestApi",
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
  tagTypes: ["Request"],
  endpoints: (builder) => ({
    // 🔹 Create request to open a store
    createRequest: builder.mutation({
      query: (body) => ({
        url: `api/store-requests`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Request"],
    }),

    // 🔹 Superadmin — get all requests
    getAllRequests: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return `api/store-requests/all?${query}`;
      },
      providesTags: ["Request"],
    }),

    // 🔹 Superadmin — get request by ID
    getRequestById: builder.query({
      query: (id) => `api/store-requests/${id}`,
      providesTags: ["Request"],
    }),

    // 🔹 Delete request (superadmin)
    deleteRequest: builder.mutation({
      query: (id) => ({
        url: `api/store-requests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Request"],
    }),

    // 🔹 Change status (superadmin)
    changeRequestStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `api/store-requests/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Request"],
    }),

    // 🔹 Get all business types
    getAllBusinessTypes: builder.query({
      query: () => "api/business-types",
    }),
  }),
});

export const {
  useCreateRequestMutation,
  useGetAllRequestsQuery,
  useGetRequestByIdQuery,
  useDeleteRequestMutation,
  useChangeRequestStatusMutation,
  useGetAllBusinessTypesQuery,
} = requestApi;
