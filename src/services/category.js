// src/services/category.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { token } from "../utils/token";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
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
  tagTypes: ["Category", "Shop", "Brand", "Product"],

  endpoints: (builder) => ({
    // ✅ 1. Get all level 1 categories (public)
    getAllLevel1Categories: builder.query({
      query: () => `api/categories/all`,
      providesTags: ["Category"],
    }),

    // ✅ 2. Get all categories flat
    getAllCategoriesFlat: builder.query({
      query: ({ page, limit, isActive, order, deleted, name }) => ({
        url: `api/categories/flat`,
        params: { page, limit, isActive, order, deleted, name },
      }),
      transformResponse: (response) => ({
        categories: Array.isArray(response.categories)
          ? [...response.categories].sort((a, b) => b.id - a.id)
          : [],
        meta: response.meta || {},
      }),
      providesTags: ["Category"],
    }),

    // ✅ 3. Get category tree (nested 3 levels)
    getCategoryTree: builder.query({
      query: () => `api/categories/tree`,
      providesTags: ["Category"],
    }),

    // ✅ 4. Get single category by ID
    getCategoryById: builder.query({
      query: (id) => `api/categories/${id}`,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),

    // ✅ 5. Get children categories by parent ID
    getCategoryChildren: builder.query({
      query: (id) => `api/categories/${id}/children`,
      providesTags: ["Category"],
    }),

    // ✅ 6. Get shops by category ID
    getCategoryShops: builder.query({
      query: (id) => `api/categories/${id}/shops`,
      providesTags: ["Shop"],
    }),

    // ✅ 7. Get brands by category ID
    getCategoryBrands: builder.query({
      query: (id) => `api/categories/${id}/brands`,
      providesTags: ["Brand"],
    }),

    // ✅ 8. Get products by category ID (paginated)
    getCategoryProducts: builder.query({
      query: ({ id, page = 1, limit = 20 }) =>
        `api/categories/${id}/products?page=${page}&limit=${limit}`,
      providesTags: ["Product"],
    }),

    // ✅ 9. Create category
    createCategory: builder.mutation({
      query: (formData) => ({
        url: `api/categories/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Category"],
    }),

    // ✅ 10. Update category
    updateCategory: builder.mutation({
      query: ({ id, formData }) => ({
        url: `api/categories/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Category", id },
        "Category",
      ],
    }),

    // ✅ 11. Delete category
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `api/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetAllLevel1CategoriesQuery,
  useGetAllCategoriesFlatQuery,
  useGetCategoryTreeQuery,
  useGetCategoryByIdQuery,
  useGetCategoryChildrenQuery,
  useGetCategoryShopsQuery,
  useGetCategoryBrandsQuery,
  useGetCategoryProductsQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
