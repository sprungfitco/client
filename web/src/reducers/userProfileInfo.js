import * as types from '../constants/ActionTypes';

const initialState = {
  username: '',
  error: '',
  userType: 0,
  signUpError: '',
  userSessionID: 1,
  paymentInfo: {},
};

export default function router(state = null, action) {
  switch (action.type) {
    case types.FETCH_USER_INFO:
      return {
         ...action.data
      };

    case types.FETCH_USER_INFO_FAILURE:
      return {
        error: action.error
      };

    case (types.UPDATE_USER_PROFILE_SUCCESS):
      return {
        ...action.data
      }

    case (types.UPDATE_USER_PROFILE_FAILURE):
      return {
        error: action.error
      };

    case types.LOGOUT_SUCCESS:
      return null;

    case types.ADD_CC_INFO:
      const paymentInfo = action.data;
      console.log("action data", action.data)
      return { ...state, paymentInfo }

    default:
      return state;
  }
}
