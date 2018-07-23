import * as types from '../constants/ActionTypes';

const initialState = {
  username: '',
  error: '',
  userType: 0,
  signUpError: '',
  userSessionID: 1
};

export default function router(state = initialState, action) {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      return {
        ...state,
        info: { ...action.data },
        error: ''
      };

    case types.LOGOUT_SUCCESS:
      return {
        initialState
      };

    case types.LOGIN_FAILURE:
      return {
        error: action.error
      };

    case types.SIGNUP_FAILURE:
      return {
        signUpError: action.error
      };

    case types.USER_TYPE:
      return {
        userType: action.userType
      };

    case types.SESSION_ID:
      return {
        userSessionID: action.userSessionID
      };

    default:
      return state;
  }
}
