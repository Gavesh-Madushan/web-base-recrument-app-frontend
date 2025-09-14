import { Navigate } from "react-router-dom";
import MainLayout from "../MainLayout";
import Loadable from "./RouteLoad/Loadable";
import { lazy } from "react";
import { Logout } from ".";
import ReportData from "../Reports/ReportData";
import Reports from "../Reports";
import JobPostDetails from "../JobPosts/AddorUpdateJobPost";
import JobPostsList from "../JobPosts";

const Dashboard = Loadable(lazy(() => import("../Dashboard/index")));
const UnauthorizedAccess = Loadable(lazy(() => import("../../utils/ui-components/UnauthorizedAccess")));

function DivisionalHeadAuthorizedRoutes(role: any) {
  return [
    {
      path: "/",
      element: <MainLayout role={role} />,
      children: [
        {
          path: "/",
          element: <Dashboard access={"0100"} />, // access - CRUD
        },
        {
          path: "dashboard",
          element: <Dashboard access={"0100"} />, // access - CRUD
        },
        {
          path: "job-posts",
          element: <JobPostsList access={"1111"} />, // access - CRUD
        },
        {
          path: "job-post/:id",
          element: <JobPostDetails access={"1111"} />, // access - CRUD
        },
        {
          path: "reports",
          element: <Reports />, // access - CRUD
        },
        {
          path: "reports/:id",
          element: <ReportData access={"1111"} />, // access - CRUD
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

export default DivisionalHeadAuthorizedRoutes;
