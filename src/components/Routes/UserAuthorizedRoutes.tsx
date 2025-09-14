import { Navigate } from "react-router-dom";
import MainLayout from "../MainLayout";
import Loadable from "./RouteLoad/Loadable";
import { lazy } from "react";
import { Logout } from ".";
import JobNotifications from "../Candidate/Notifications";
import MyJobApplications from "../Candidate/Applications";

const Dashboard = Loadable(lazy(() => import("../Dashboard/index")));
const UnauthorizedAccess = Loadable(lazy(() => import("../../utils/ui-components/UnauthorizedAccess")));

function UserAuthorizedRoutes(role: any) {
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
          path: "job-notification",
          element: <JobNotifications access={"1111"} />, // access - CRUD
        },
        {
          path: "my-applications",
          element: <MyJobApplications access={"1111"} />, // access - CRUD
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

export default UserAuthorizedRoutes;
