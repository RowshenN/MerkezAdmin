// src/services/user.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { token } from "../utils/token";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      if (token()) headers.set("Authorization", `Bearer ${token()}`);
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // 🔹 Get all users (with optional filters, pagination)
    getUsers: builder.query({
      query: ({ page = 1, limit = 10, order = "desc", role, search } = {}) => {
        const params = new URLSearchParams();
        params.set("page", page);
        params.set("limit", limit);
        if (order) params.set("order", order);
        if (role) params.set("role", role);
        if (search) params.set("search", search);
        return `api/users?${params.toString()}`;
      },
      transformResponse: (response) => ({
        users: Array.isArray(response) ? response : response.users || [],
        meta: response.meta || {},
      }),
      providesTags: (result) =>
        result && result.users
          ? [
              ...result.users.map((u) => ({ type: "User", id: u.id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    // 🔹 Get user by ID
    getUserById: builder.query({
      query: (id) => `api/users/${id}`,
      transformResponse: (response) => ({
        user: response || null,
      }),
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // 🔹 Create user
    createUser: builder.mutation({
      query: (userData) => ({
        url: "api/users",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    // 🔹 Update user
    updateUser: builder.mutation({
      query: ({ id, userData }) => ({
        url: `api/users/${id}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    // 🔹 Update user role
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `api/users/${id}/role`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    // 🔹 Delete user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `api/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    // 🔹 Get vendors (admins only)
    getVendors: builder.query({
      query: () => `api/users/vendors`,
      transformResponse: (response) => ({
        vendors: Array.isArray(response)
          ? response
          : response.vendors || response,
      }),
      providesTags: (result) =>
        result && result.vendors
          ? [
              ...result.vendors.map((v) => ({ type: "User", id: v.id })),
              { type: "User", id: "VENDORS" },
            ]
          : [{ type: "User", id: "VENDORS" }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useGetVendorsQuery
} = userApi;
