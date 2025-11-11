import { lazy } from "react";
export const Login = lazy(() => import("./login/login"));

export const Orders = lazy(() => import("./orders/orders"));
export const OrdersCreate = lazy(() => import("./orders/ordersCreate"));
export const OrdersUpdate = lazy(() => import("./orders/ordersUpdate"));

export const Categories = lazy(() => import("./categories/Categories"));
export const CategoriesCreate = lazy(() =>
  import("./categories/categoriesCreate")
);
export const CategoriesUpdate = lazy(() =>
  import("./categories/categoriesUpdate")
);

export const Brands = lazy(() => import("./brands/Brands"));
export const BrandsCreate = lazy(() => import("./brands/BrandsCreate"));
export const BrandsUpdate = lazy(() => import("./brands/BrandsUpdate"));

export const BusinessTypes = lazy(() =>
  import("./businessTypes/BusinessTypes")
);
export const CreateBusinessTypes = lazy(() =>
  import("./businessTypes/CreateBusinessTypes")
);
export const UpdateBusinessTypes = lazy(() =>
  import("./businessTypes/UpdateBusinessTypes")
);

export const Attributes = lazy(() => import("./attributes/Attributes"));
export const AttributesCreate = lazy(() =>
  import("./attributes/AttributesCreate")
);
export const AttributeUpdate = lazy(() =>
  import("./attributes/AttributeUpdate")
);

export const Products = lazy(() => import("./products/Products"));
export const ProductsCreate = lazy(() => import("./products/ProductsCreate"));
export const ProductsUpdate = lazy(() => import("./products/ProductsUpdate"));

export const About = lazy(() => import("./about/abouts"));
export const AboutCreate = lazy(() => import("./about/aboutCrate"));
export const AboutUpdate = lazy(() => import("./about/aboutUpdate"));

export const Banner = lazy(() => import("./banner/banner"));
export const BannerUpdate = lazy(() => import("./banner/bannerUpdate"));
export const BannerCreate = lazy(() => import("./banner/bannerCreate"));

export const Admins = lazy(() => import("./admins/admins"));
export const AdminsCreate = lazy(() => import("./admins/adminsCreate"));
export const AdminsUpdate = lazy(() => import("./admins/adminsUpdate"));

export const Shops = lazy(() => import("./shops/Shops"));
export const ShopsUpdate = lazy(() => import("./shops/shopsUpdate"));
export const ShopsCreate = lazy(() => import("./shops/shopsCreate"));

export const Users = lazy(() => import("./users/Users"));
