import { useNavigate, useRoutes } from "react-router-dom";

import UnauthorizedRoutes from "./UnauthorizedRoutes";

import { useDispatch, useSelector } from "react-redux";
import { getLogout, getState } from "../../redux/actions/actions";

import AdminAuthorizedRoutes from "./MDAuthorizedRoutes";
import { useEffect } from "react";
import DivisionalHeadAuthorizedRoutes from "./DivisionalHeadAuthorizedRoutes";

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  const authState = useSelector((state: any) => state.auth.authData);
  const user = getState(authState);

  const ROLES_ROUTES: any = {
    1: AdminAuthorizedRoutes(1),
    2: DivisionalHeadAuthorizedRoutes(2),
    undefined: UnauthorizedRoutes(user),
  };

  return useRoutes(user ? ROLES_ROUTES[Number(user?.roleId)] || UnauthorizedRoutes(user) : UnauthorizedRoutes(user));
}

export function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLogout());
  }, [navigate]);

  return <div>Logging out...</div>;
}
