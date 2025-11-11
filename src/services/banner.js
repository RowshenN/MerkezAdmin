// services/banner.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { token } from "../utils/token";

const baseUrl = process.env.REACT_APP_BASE_URL;

export const bannerApi = createApi({
  reducerPath: "bannerApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      if (token()) {
        headers.set("Authorization", `Bearer ${token()}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Banner"],

  endpoints: (builder) => ({
    // 🔹 Get all banners (public)
    getAllBanners: builder.query({
      query: () => `api/banner/`,
      providesTags: ["Banner"],
    }),

    // 🔹 Get one banner by ID (if needed)
    getBannerById: builder.query({
      query: (id) => `api/banner/${id}`,
      providesTags: (result, error, id) => [{ type: "Banner", id }],
    }),

    // 🔹 Create banner (superadmin)
    createBanner: builder.mutation({
      query: (formData) => ({
        url: `api/banner/`,
        method: "POST",
        body: formData, // formData because of image upload
      }),
      invalidatesTags: ["Banner"],
    }),

    // 🔹 Update banner (superadmin)
    updateBanner: builder.mutation({
      query: ({ id, formData }) => ({
        url: `api/banner/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Banner"],
    }),

    // 🔹 Delete banner (superadmin)
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `api/banner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banner"],
    }),
  }),
});

export const {
  useGetAllBannersQuery,
  useGetBannerByIdQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;
