import { Navigate } from "react-router-dom";
import MainLayout from "../MainLayout";
import Loadable from "./RouteLoad/Loadable";
import { lazy } from "react";
import { Logout } from ".";

// const CheckIn = Loadable(lazy(() => import("../CheckIn/index")));
// const CheckInJobWise = Loadable(lazy(() => import("../CheckIn/check-in-project-wise")));
// const CreateEmployee = Loadable(lazy(() => import("../Staff/EmployeeManagement/Employee/EmployeeDetails")));
const UpdateProjectDetails = Loadable(lazy(() => import("../ProjectsManagement/Jobs/UpdateProject/UpdateProject")));
const AttandaceRecords = Loadable(lazy(() => import("../Staff/AttandaceRecords")));
const Dashboard = Loadable(lazy(() => import("../Dashboard/index")));
const UnauthorizedAccess = Loadable(lazy(() => import("../../utils/ui-components/UnauthorizedAccess")));
const EmployeeManagement = Loadable(lazy(() => import("../Staff/EmployeeManagement")));
const ProjectManagement = Loadable(lazy(() => import("../ProjectsManagement/Jobs")));
const CreateJob = Loadable(lazy(() => import("../ProjectsManagement/Jobs/CreateJob/CreateJob")));
const LeaveManagement = Loadable(lazy(() => import("../Staff/LeaveManagement")));
const ApproveOTAttendance = Loadable(lazy(() => import("../Staff/ApproveOTAttandance")));
const ClientList = Loadable(lazy(() => import("../ProjectsManagement/Clients")));
const CreateView = Loadable(lazy(() => import("../ProjectsManagement/Clients/ClientView/ClientView")));
const JobView = Loadable(lazy(() => import("../ProjectsManagement/Jobs/ViewJob")));
const EmployeeAttendance = Loadable(lazy(() => import("../Staff/AttendanceSummery/index")));
const ProfileView = Loadable(lazy(() => import("../Profile")));

function DivisionalHeadAuthorizedRoutes(role: any) {
  return [
    {
      path: "/",
      element: <MainLayout role={role} />,
      children: [
        {
          path: "/",
          element: <Dashboard access={"1110"} />,
        },
        {
          path: "dashboard",
          element: <Dashboard access={"1110"} />,
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
