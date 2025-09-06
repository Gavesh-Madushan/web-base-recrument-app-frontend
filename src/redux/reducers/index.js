import { combineReducers } from "redux";

import customizationReducer from "./customization-reducer";
import authReducer from "./auth-reducer";
import campaignCreationReducer from "./campaign-creation-reducer";
import rememberMeReducer from "./rememberMe-reducer";

export default combineReducers({
  auth: authReducer,
  rememberMe: rememberMeReducer,
  customization: customizationReducer,
  campaignCreation: campaignCreationReducer,
});
