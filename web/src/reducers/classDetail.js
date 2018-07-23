import * as types from '../constants/ActionTypes';

const initialState = {
    
};

export default function router(state = null, action) {
  switch (action.type) {
    case types.GET_SESSION_SUCCESS:
      return {
         ...action.data
      };

    case types.GET_SESSION_FAILURE:
      return {
        error: action.error
      };

    default:
      return state;
  }
}