import { lazy } from "react";

// project imports
import Loadable from "./RouteLoad/Loadable";
import { Navigate } from "react-router-dom";
import MinimalLayout from "../MinimalLayout";

const Login = Loadable(
  lazy(() => import("../Authentication/authentication/login"))
);
const MobileNumberVerify = Loadable(
  lazy(() => import("../Authentication/verification/verify-mobile"))
);
const LoginVerification = Loadable(
  lazy(() => import("../Authentication/verification/verify-login"))
);
const SignUp = Loadable(
  lazy(() => import("../Authentication/authentication/register"))
);

// ==============================|| AUTHENTICATION ROUTING ||============================== //

function UnauthorizedRoutes(user: any) {
  return [
    {
      path: "/",
      element: <MinimalLayout />,
      children: user?.token
        ? [
            {
              path: "/",
              element: <Login />,
            },
            {
              path: "login",
              element: <Login />,
            },
            {
              path: "verify-mobile",
              element: <MobileNumberVerify />,
            },
            {
              path: "verify-login",
              element: <LoginVerification />,
            },
            {
              path: "signup",
              element: <SignUp />,
            },
          ]
        : [
            {
              path: "/",
              element: <Login />,
            },
            {
              path: "verify-mobile",
              element: <MobileNumberVerify />,
            },
            {
              path: "login",
              element: <Login />,
            },
            {
              path: "signup",
              element: <SignUp />,
            },
          ],
    },
    {
      path: "*",
      element: <Navigate to="/login" />,
    },
  ];
}

export default UnauthorizedRoutes;
