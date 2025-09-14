import { Navigate } from "react-router-dom";
import MainLayout from "../MainLayout";
import Loadable from "./RouteLoad/Loadable";
import { lazy } from "react";
import { Logout } from ".";
import JobPostsList from "../JobPosts";
import Reports from "../Reports";
import ReportData from "../Reports/ReportData";
import JobPostDetails from "../JobPosts/AddorUpdateJobPost";
import JobNotifications from "../Candidate/Notifications";
import MyJobApplications from "../Candidate/Applications";
import JobCategoryList from "../AdminSettings/JobCaregory";
import JobPositionList from "../AdminSettings/JobPosition";

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
        {
          path: "job-notification",
          element: <JobNotifications access={"1111"} />, // access - CRUD
        },
        {
          path: "my-applications",
          element: <MyJobApplications access={"1111"} />, // access - CRUD
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

export default UserAuthorizedRoutes;
