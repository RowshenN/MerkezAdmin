import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { token } from "../utils/token";

export const serviceApi = createApi({
  reducerPath: "serviceApi",
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
  tagTypes: ["Service"],

  endpoints: (builder) => ({
    // 1. Get all services
    getAllServices: builder.query({
      query: (params) => {
        const query = new URLSearchParams(params).toString();
        return `api/service/all?${query}`;
      },
      providesTags: ["Service"],
    }),

    // 2. Get one service by ID
    getService: builder.query({
      query: (id) => `api/service/${id}`,
      providesTags: (result, error, id) => [{ type: "Service", id }],
    }),

    // 3. Create a service
    createService: builder.mutation({
      query: (formData) => ({
        url: `api/service/create`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Service"],
    }),

    // 4. Update a service
    updateService: builder.mutation({
      query: (formData) => ({
        url: `api/service/update`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Service"],
    }),

    // 5. Soft delete service
    deleteService: builder.mutation({
      query: (id) => ({
        url: `api/service/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
    }),

    // 6. Undelete service
    undeleteService: builder.mutation({
      query: (id) => ({
        url: `api/service/undelete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
    }),

    // 7. Hard destroy service
    destroyService: builder.mutation({
      query: (id) => ({
        url: `api/service/destroy/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
    }),
  }),
});

export const {
  useGetAllServicesQuery,
  useGetServiceQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useUndeleteServiceMutation,
  useDestroyServiceMutation,
} = serviceApi;
