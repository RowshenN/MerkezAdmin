// src/services/products.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { token } from "../utils/token";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      if (token()) headers.set("Authorization", `Bearer ${token()}`);
      return headers;
    },
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    // 🔹 1. Superadmin — Get all products
    getAllProducts: builder.query({
      query: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return `api/products?${query}`;
      },
      providesTags: ["Product"],
    }),

    // 🔹 2. Admin — Create a product
    createProduct: builder.mutation({
      query: (formData) => ({
        url: `api/products`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Product"],
    }),

    // 🔹 3. Admin — Update product
    updateProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `api/products/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Product"],
    }),

    // 🔹 4. Admin — Delete product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `api/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    // 🔹 5. Public — Get single product
    getProductById: builder.query({
      query: (id) => `api/products/${id}`,
      providesTags: ["Product"],
    }),

    // 🔹 6. Public — Get products by shop (paginated)
    getProductsByShop: builder.query({
      query: ({ shopId, ...params }) => {
        const query = new URLSearchParams(params).toString();
        return `api/products/shop/${shopId}?${query}`;
      },
      providesTags: ["Product"],
    }),

    // 🔹 7. Public — Get products by category (level 3)
    getProductsByCategory: builder.query({
      query: ({ categoryId, ...params }) => {
        const query = new URLSearchParams(params).toString();
        return `api/products/category/${categoryId}?${query}`;
      },
      providesTags: ["Product"],
    }),

    // 🔹 8. Public — Get products by brand
    getProductsByBrand: builder.query({
      query: ({ brandId, ...params }) => {
        const query = new URLSearchParams(params).toString();
        return `api/products/brand/${brandId}?${query}`;
      },
      providesTags: ["Product"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useGetProductsByShopQuery,
  useGetProductsByCategoryQuery,
  useGetProductsByBrandQuery,
} = productApi;
