// services/login.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const baseUrl = process.env.REACT_APP_BASE_URL;

export const loginApi = createApi({
  reducerPath: "loginApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL || "http://localhost:5000/",
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "api/auth/login",
        method: "POST",
        body: credentials,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = loginApi;
