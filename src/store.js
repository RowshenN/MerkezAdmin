// store.js
import { configureStore } from "@reduxjs/toolkit";
import { loginApi } from "./services/login";
import { contactApi } from "./services/contact";
import { bannerApi } from "./services/banner";
import { brandApi } from "./services/brand";
import { attributeApi } from "./services/attribute";
import { adminApi } from "./services/admin";
import { aboutApi } from "./services/about";
import { shopApi } from "./services/shop";
import { categoryApi } from "./services/category";
import { subscribesApi } from "./services/subscribes";
import { productApi } from "./services/product";
import { businessTypeApi } from "./services/businessTypes";

export const store = configureStore({
  reducer: {
    [loginApi.reducerPath]: loginApi.reducer,
    [businessTypeApi.reducerPath]: businessTypeApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [attributeApi.reducerPath]: attributeApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [bannerApi.reducerPath]: bannerApi.reducer,
    [brandApi.reducerPath]: brandApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [aboutApi.reducerPath]: aboutApi.reducer,
    [shopApi.reducerPath]: shopApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [subscribesApi.reducerPath]: subscribesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      loginApi.middleware,
      businessTypeApi.middleware,
      productApi.middleware,
      attributeApi.middleware,
      contactApi.middleware,
      bannerApi.middleware,
      brandApi.middleware,
      adminApi.middleware,
      aboutApi.middleware,
      shopApi.middleware,
      categoryApi.middleware,
      subscribesApi.middleware
    ),
});
