// action - state management
import * as actionTypes from "../actions/actions";

export const initialState = {
  sendTestMessageType: 0, // 1 = send test message, 2 = approve test message, 3 = completed
  campaignID: 0,
  campaignType: "1",
  campaignCreator: "1",
  // testMessageData : null // keep data object
};

const campaignCreationReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TEST_MESSAGE_SEND_TYPE:
      return {
        ...state,
        sendTestMessageType: action.sendTestMessageType,
      };
    case actionTypes.CAMPAIGN_ID:
      return {
        ...state,
        campaignID: action.campaignID,
      };
    case actionTypes.CAMPAIGN_TYPE:
      return {
        ...state,
        campaignType: action.campaignType,
      };
    case actionTypes.CAMPAIGN_CREATOR:
      return {
        ...state,
        campaignType: action.campaignCreator,
      };
    // case actionTypes.TEST_MESSAGE_DATA:
    //     return {
    //         ...state,
    //         testMessageData: action.testMessageData
    //     };
    // case actionTypes.INITIAL_STATE:
    //     return {
    //         sendTestMessageType: 0,
    //         campaignID: 0,
    //         campaignType: '1',
    //         testMessageData : null
    //     };
    default:
      return state;
  }
};

export default campaignCreationReducer;
