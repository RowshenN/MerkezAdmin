// src/services/blockedUser.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { token } from "../utils/token";

export const blockedUserApi = createApi({
  reducerPath: "blockedUserApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      if (token()) headers.set("Authorization", `Bearer ${token()}`);
      return headers;
    },
  }),
  tagTypes: ["BlockedUser"],
  endpoints: (builder) => ({
    // 🔹 Get all blocked users
    getBlockedUsers: builder.query({
      query: () => `api/blocked-users`,
      transformResponse: (response) => ({
        blockedUsers: Array.isArray(response) ? response : response.blockedUsers || [],
      }),
      providesTags: (result) =>
        result && result.blockedUsers
          ? [
              ...result.blockedUsers.map((u) => ({ type: "BlockedUser", id: u.id })),
              { type: "BlockedUser", id: "LIST" },
            ]
          : [{ type: "BlockedUser", id: "LIST" }],
    }),

    // 🔹 Block a user
    blockUser: builder.mutation({
      query: (data) => ({
        url: "api/blocked-users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "BlockedUser", id: "LIST" }],
    }),

    // 🔹 Unblock a user
    unblockUser: builder.mutation({
      query: (phoneNumber) => ({
        url: `api/blocked-users/${phoneNumber}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "BlockedUser", id: "LIST" }],
    }),
  }),
});

export const {
  useGetBlockedUsersQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
} = blockedUserApi;
