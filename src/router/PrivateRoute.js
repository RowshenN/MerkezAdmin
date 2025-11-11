import React, { Suspense } from "react";
import { Route, useHistory } from "react-router-dom";
import { isLogin } from "../utils/index";
import PageLoading from "../components/PageLoading";
import Sidebar from "../components/sidebar";

const Headers = React.lazy(() => import("../components/Header"));

const PrivateRoute = ({ component: Component, ...rest }) => {
  const history = useHistory();
  return (
    <Route
      {...rest}
      render={(props) =>
        isLogin() || true ? (
          <div className="w-full flex justify-between">
            <Suspense fallback={<PageLoading />}>
              <Sidebar />
            </Suspense>
            <div className="w-full">
              <Suspense fallback={<PageLoading />}>
                <Headers />
              </Suspense>
              <div
                className="bg-[#F7F8FA]  p-[30px]"
                style={{
                  // width: "90%",
                  minHeight: "90vh",
                  margin: "0 auto",
                }}
              >
                <Component {...props} />
                {/* <div className="text-gray-400 w-full text-center fixed bottom-5 right-0.5">
                  © 2025 Povered by "Ýyldyrym bady"
                </div> */}
              </div>
            </div>
          </div>
        ) : (
          history.push({ pathname: "/login" })
        )
      }
    />
  );
};

export default PrivateRoute;
