// action - auth reducer
import { QueryCache } from "@tanstack/react-query";
import { decrypt } from "../../utils/utils";

export const LOGOUT = "@auth/LOGOUT";
export const LOGOUT_REQUIRED = "@auth/LOGOUT_REQUIRED";

// action - rememberMe reducer
export const REMEMBER_ME = "@rememberMe/REMEMBER_ME";
export const REMEMBER_ME_REQUIRED = "@rememberMe/REMEMBER_ME_REQUIRED";
export const FORGET_ME = "@rememberMe/FORGET_ME";
export const FORGET_ME_REQUIRED = "@rememberMe/FORGET_ME_REQUIRED";

// action - customization reducer
export const SET_SYSTEM_MODE = "@customization/SET_SYSTEM_MODE";
export const SET_MODE = "@customization/SET_MODE";
export const SET_MENU = "@customization/SET_MENU";
export const MENU_TOGGLE = "@customization/MENU_TOGGLE";
export const MENU_OPEN = "@customization/MENU_OPEN";
export const SET_FONT_FAMILY = "@customization/SET_FONT_FAMILY";
export const SET_BORDER_RADIUS = "@customization/SET_BORDER_RADIUS";
export const SET_BREADCRUMBS = "@customization/SET_BREADCRUMBS";

// action - campaign creation reducer
export const TEST_MESSAGE_SEND_TYPE =
  "@campaignCreation/TEST_MESSAGE_SEND_TYPE";
// export const TEST_MESSAGE_DATA = '@campaignCreation/SEND_TEST_MESSAGE_DATA';
export const CAMPAIGN_ID = "@campaignCreation/CAMPAIGN_ID";
export const CAMPAIGN_TYPE = "@campaignCreation/CAMPAIGN_TYPE";
export const CAMPAIGN_CREATOR = "@campaignCreation/CAMPAIGN_CREATOR";
// export const INITIAL_STATE = '@campaignCreation/INITIAL_STATE';

export const Types = {
  LOGIN_REQUESTING: "@auth/LOGIN_REQUESTING",
  LOGIN_SUCCESS: "@auth/LOGIN_SUCCESS",
  LOGIN_ERROR: "@auth/LOGIN_ERROR",
  REGISTER_REQUESTING: "@auth/REGISTER_REQUESTING",
  REGISTER_SUCCESS: "@auth/REGISTER_SUCCESS",
  REGISTER_ERROR: "@auth/REGISTER_ERROR",
  LOGOUT: "@auth/LOGOUT",
  SET_REDIRECT_PATH: "@auth/SET_REDIRECT_PATH",
  UPDATE_AUTH_STATE: "@auth-me/UPDATE_AUTH_STATE",
  REMEMBER_ME: "@remember-me/REMEMBER_ME",
  FORGET_ME: "@remember-me/FORGET_ME",
};

// In order to perform an action of type LOGIN_REQUESTING
// we need an email and password
export function loginRequest(values) {
  return {
    type: Types.LOGIN_REQUESTING,
    payload: values,
  };
}

export function registerRequest(values) {
  return {
    type: Types.REGISTER_REQUESTING,
    payload: values,
  };
}

export function setRedirectPath(path, state) {
  return {
    type: Types.SET_REDIRECT_PATH,
    payload: { path: path, state: state },
  };
}

export const setAuthState = (items) => ({
  type: Types.UPDATE_AUTH_STATE,
  payload: items,
});

export const getLoginSuccess = (items) => ({
  type: Types.LOGIN_SUCCESS,
  payload: items,
});

export const getRegisterSuccess = (items) => ({
  type: Types.REGISTER_SUCCESS,
  payload: items,
});

export const getLoginError = (items) => ({
  type: Types.LOGIN_ERROR,
  payload: items,
});

export const getLogout = (path) => {
  const queryCache = new QueryCache();
  queryCache.clear();
  return {
    type: Types.LOGOUT,
    payload: { path: path },
  };
};

export const setRememberMe = (items) => ({
  type: Types.REMEMBER_ME,
  payload: items,
});

export const setForgetMe = () => ({
  type: Types.FORGET_ME,
});

export function getState(state) {
  return decrypt(state);
}
