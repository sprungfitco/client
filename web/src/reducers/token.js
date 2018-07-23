import * as types from '../constants/ActionTypes';

const initialState = {
  apiKey: '46094132'
};

export default function router(state = initialState, action) {
  switch (action.type) {
    case types.TOKEN_SUCCESS:
      return {
        ...state,
        sessionId: action.sessionId,
        token: action.token,
        classID: action.classID
      };

    case types.LOGOUT_SUCCESS:
      return {
        initialState
      };

    default:
      return state;
  }
}
