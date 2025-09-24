import { React, lazy, Suspense } from "react";
import { BrowserRouter, Switch, Route, Routes } from "react-router-dom";
import PageLoading from "../components/PageLoading";

import {
  News,
  NewsCreate,
  NewsUpdate,
  Login,
  Admins,
  AdminsUpdate,
  AdminsCreate,
  Contact,
  ContactUpdate,
  ContactCreate,
  About,
  AboutCreate,
  AboutUpdate,
  Banner,
  BannerCreate,
  BannerUpdate,
  Service,
  ServiceCreate,
  ServiceUpdate,
  Works,
  WorksCreate,
  WorksUpdate,
  Subscribes,
} from "../pages/index";

import ScrollIntoView from "./ScrollIntoView";

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
              component={News}
              path="/news"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={NewsCreate}
              path="/news/create"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={NewsUpdate}
              path="/news/:id"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={Service}
              path="/service"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={ServiceCreate}
              path="/service/create"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={ServiceUpdate}
              path="/service/:id"
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
              component={Works}
              path="/works"
              exact
            />
            <PrivateRoute
              restricted={true}
              component={WorksCreate}
              path="/works/create"
              exact
            />
            <PrivateRoute
              restricted={true}
              component={WorksUpdate}
              path="/works/:id"
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
              component={Subscribes}
              path="/subscribes"
              exact
            />

            <PrivateRoute
              restricted={true}
              component={Contact}
              path="/contact"
              exact
            />
            <PrivateRoute
              restricted={true}
              component={ContactCreate}
              path="/contact/create"
              exact
            />
            <PrivateRoute
              restricted={true}
              component={ContactUpdate}
              path="/contact/:id"
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

            <Route path="/" exact component={Login} />
            <Route path="/login" exact component={Login} />
          </Switch>
        </Suspense>
      </ScrollIntoView>
    </BrowserRouter>
  );
};

export default App;
