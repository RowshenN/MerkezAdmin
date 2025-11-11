// services/shops.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { token } from "../utils/token";

export const shopApi = createApi({
  reducerPath: "shopApi",
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
  tagTypes: ["Shop"],
  endpoints: (builder) => ({
    // 🔹 1. Superadmin — get all shops
    getAllShops: builder.query({
      query: () => `api/shop/`,
      providesTags: ["Shop"],
    }),

    // 🔹 2. Public — get all active shops (homepage) with pagination
    getAllShopsPublic: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return `api/shop/all?${query}`;
      },
      providesTags: ["Shop"],
    }),

    // 🔹 3. Public — get shops by level 1 category (with pagination)
    getShopsByCategory: builder.query({
      query: ({ categoryId, ...params }) => {
        const query = new URLSearchParams(params).toString();
        return `api/shop/category/${categoryId}?${query}`;
      },
      providesTags: ["Shop"],
    }),

    // 🔹 4. Admin — get my own shop
    getMyShop: builder.query({
      query: () => `api/shop/my`,
      providesTags: ["Shop"],
    }),

    // 🔹 5. Admin — create my shop
    createMyShop: builder.mutation({
      query: (formData) => ({
        url: `api/shop/my`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Shop"],
    }),

    // 🔹 6. Admin — update my shop
    updateMyShop: builder.mutation({
      query: (formData) => ({
        url: `api/shop/my`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Shop"],
    }),

    // 🔹 7. Admin — delete my shop
    deleteMyShop: builder.mutation({
      query: () => ({
        url: `api/shop/my`,
        method: "DELETE",
      }),
      invalidatesTags: ["Shop"],
    }),

    // 🔹 8. Public — get one shop’s categories (sidebar)
    getShopCategories: builder.query({
      query: (shopId) => `api/shop/${shopId}/categories`,
      providesTags: ["Shop"],
    }),

    // 🔹 9. Public — get one shop’s brands (sidebar)
    getShopBrands: builder.query({
      query: (shopId) => `api/shop/${shopId}/brands`,
      providesTags: ["Shop"],
    }),

    // 🔹 10. Public — get one shop’s products (with filters + pagination)
    getShopProducts: builder.query({
      query: (params) => {
        const { shopId, ...queryParams } = params;
        const query = new URLSearchParams(queryParams).toString();
        return `api/shop/${shopId}/products?${query}`;
      },
      providesTags: ["Shop"],
    }),

    // 🔹 11. Get shop by ID (superadmin/admin)
    getShopById: builder.query({
      query: (id) => `api/shop/${id}`,
      providesTags: ["Shop"],
    }),
  }),
});

export const {
  useGetAllShopsQuery,
  useGetAllShopsPublicQuery,
  useGetShopsByCategoryQuery,
  useGetMyShopQuery,
  useCreateMyShopMutation,
  useUpdateMyShopMutation,
  useDeleteMyShopMutation,
  useGetShopCategoriesQuery,
  useGetShopBrandsQuery,
  useGetShopProductsQuery,
  useGetShopByIdQuery, // ✅ new hook
} = shopApi;
