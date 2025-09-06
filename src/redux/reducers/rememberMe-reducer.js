import * as actions from "../actions/actions";
import { encrypt } from "../../utils/utils";

const initialState = {
  rememberMeData: null,
};

const rememberMeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.Types.REMEMBER_ME:
      let encryptedData = encrypt({ ...action.payload });
      return { ...state, rememberMeData: encryptedData };
    case actions.Types.FORGET_ME:
      return { ...state, rememberMeData: null };
    default:
      return state;
  }
};

export default rememberMeReducer;
