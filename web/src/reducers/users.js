import * as types from '../constants/ActionTypes';

const initialState = {
  trainers: []
};

export default function router(state = initialState, action) {
  switch (action.type) {
    case types.GET_TRAINERS_SUCCESS:
      return {
        ...action
      };

      case types.LOGOUT_SUCCESS:
        return {
          initialState
        };
        
    default:
      return state;
  }
}
