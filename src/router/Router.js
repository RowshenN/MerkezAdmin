import { React, lazy, Suspense } from "react";
import { BrowserRouter, Switch, Route, Routes } from "react-router-dom";
import PageLoading from "../components/PageLoading";

import {
  Orders,
  OrdersCreate,
  OrdersUpdate,
  Login,
  Admins,
  AdminsUpdate,
  AdminsCreate,
  Shops,
  ShopsUpdate,
  ShopsCreate,
  About,
  AboutCreate,
  AboutUpdate,
  Banner,
  BannerCreate,
  BannerUpdate,
  Categories,
  CategoriesCreate,
  CategoriesUpdate,
  Brands,
  BrandsCreate,
  BrandsUpdate,
  Users,
  Products,
  ProductsCreate,
  ProductsUpdate,
  AttributeUpdate,
  Attributes,
  AttributesCreate,
  BusinessTypes,
  CreateBusinessTypes,
  UpdateBusinessTypes,
  Requests,
  RequestsUpdate,
  Vendors
} from "../pages/lazy";

import ScrollIntoView from "./ScrollIntoView";
import Verification from "../pages/login/verification";

const PrivateRoute = lazy(() => import("./PrivateRoute"));
const App = () => {
  const user = JSON.parse(localStorage.getItem("userData"));

  return (
    <BrowserRouter>
      <ScrollIntoView>
        <Suspense fallback={<PageLoading />}>
          <Switch>
            {/* <PrivateRoute
              restricted={true}
              component={Contact}
              path="/"
              exact
            /> */}

            <PrivateRoute
              restricted={true}
              component={Verification}
              path="/verify"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={Products}
              path="/products"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={ProductsCreate}
              path="/products/create"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={ProductsUpdate}
              path="/products/:id"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={Requests}
              path="/requests"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={RequestsUpdate}
              path="/requests/:id"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={Attributes}
              path="/attribute"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={AttributesCreate}
              path="/attribute/create"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={AttributeUpdate}
              path="/attribute/:id"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={BusinessTypes}
              path="/business-type"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={CreateBusinessTypes}
              path="/business-type/create"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={UpdateBusinessTypes}
              path="/business-type/:id"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={Orders}
              path="/orders"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={OrdersCreate}
              path="/orders/create"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={OrdersUpdate}
              path="/orders/:id"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={Categories}
              path="/categories"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={CategoriesCreate}
              path="/categories/create"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={CategoriesUpdate}
              path="/categories/:id"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={About}
              path="/about"
              exact
            />
            <PrivateRoute
              restricted={true}
              component={AboutCreate}
              path="/about/create"
              exact
            />
            <PrivateRoute
              restricted={true}
              component={AboutUpdate}
              path="/about/:id"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={Brands}
              path="/brands"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={BrandsCreate}
              path="/brands/create"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={BrandsUpdate}
              path="/brands/:id"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={Banner}
              path="/banner"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={BannerCreate}
              path="/banner/create"
              exact
            />
            <PrivateRoute
              restricted={true}
              component={BannerUpdate}
              path="/banner/:id"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={Users}
              path="/users"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={Shops}
              path="/shops"
              exact
            />
            <PrivateRoute
              restricted={true}
              component={ShopsCreate}
              path="/shops/create"
              exact
            />
            <PrivateRoute
              restricted={true}
              component={ShopsUpdate}
              path="/shops/:id"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={Admins}
              path="/admins"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={AdminsCreate}
              path="/admins/create"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={AdminsUpdate}
              path="/admins/:id"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={Vendors}
              path="/vendors"
              exact
            />

            <Route path="/" exact component={Login} />
            <Route path="/login" exact component={Login} />
          </Switch>
        </Suspense>
      </ScrollIntoView>
    </BrowserRouter>
  );
};

export default App;
