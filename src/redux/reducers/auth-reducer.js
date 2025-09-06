import * as actions from "../actions/actions";
import { encrypt } from "../../utils/utils";

const initialState = {
  requesting: false,
  successful: false,
  authData: null,
  errors: null,
  redirectPath: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.Types.LOGIN_REQUESTING:
      return {
        ...state,
        requesting: true,
        successful: false,
        authData: null,
        errors: null,
        redirectPath: null,
      };
    case actions.Types.LOGIN_SUCCESS:
      let encryptedData = encrypt({ ...action.payload.data });
      return {
        ...state,
        requesting: false,
        successful: true,
        authData: encryptedData,
        errors: null,
        redirectPath: null,
      };
    case actions.Types.LOGIN_ERROR:
      return {
        ...state,
        requesting: false,
        successful: false,
        authData: null,
        errors: action.payload.error,
        redirectPath: null,
      };
    case actions.Types.REGISTER_REQUESTING:
      return {
        ...state,
        requesting: true,
        successful: false,
        authData: null,
        errors: null,
        redirectPath: null,
      };
    case actions.Types.REGISTER_SUCCESS:
      let encryptedRegistedData = encrypt({ ...action.payload.data });
      return {
        ...state,
        requesting: false,
        successful: true,
        authData: encryptedRegistedData,
        errors: null,
        redirectPath: null,
      };
    case actions.Types.LOGOUT:
      return {
        ...state,
        requesting: false,
        successful: false,
        authData: null,
        errors: null,
        redirectPath: null,
      };
    case actions.Types.SET_REDIRECT_PATH:
      return {
        ...state,
        requesting: false,
        successful: false,
        // authData: null,
        errors: null,
        redirectPath: action.payload,
      };
    case actions.Types.UPDATE_AUTH_STATE:
      let encryptedUpdateData = encrypt({ ...action.payload });
      return {
        ...state,
        requesting: false,
        successful: false,
        authData: encryptedUpdateData,
        errors: null,
        redirectPath: null,
      };
    default:
      return state;
  }
};

export default authReducer;
