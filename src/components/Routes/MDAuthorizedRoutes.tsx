import { Navigate } from "react-router-dom";
import MainLayout from "../MainLayout";
import Loadable from "./RouteLoad/Loadable";
import { lazy } from "react";
import { Logout } from ".";
import JobCategoryList from "../AdminSettings/JobCaregory";
import JobPositionList from "../AdminSettings/JobPosition";

const UnauthorizedAccess = Loadable(lazy(() => import("../../utils/ui-components/UnauthorizedAccess")));

function AdminAuthorizedRoutes(role: any) {
  return [
    {
      path: "/",
      element: <MainLayout role={role} />,
      children: [
        {
          path: "/",
          element: <JobCategoryList />, // access - CRUD
        },
        {
          path: "dashboard",
          element: <JobCategoryList />, // access - CRUD
        },
        {
          path: "config/job-category",
          element: <JobCategoryList />, // access - CRUD
        },
        {
          path: "config/job-position",
          element: <JobPositionList />, // access - CRUD
        },
      ],
    },
    {
      path: "unauthorized",
      element: <UnauthorizedAccess />,
    },
    {
      path: "",
      element: <Navigate to="/dashboard" />,
    },
    {
      path: "login",
      element: <Navigate to="/dashboard" />,
    },
    {
      path: "logout",
      element: <Logout />,
    },
    {
      path: "verify-login",
      element: <Navigate to="/dashboard" />,
    },
    {
      path: "*",
      element: <Navigate to="/unauthorized" />,
    },
  ];
}

export default AdminAuthorizedRoutes;
