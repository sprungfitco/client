import * as types from '../constants/ActionTypes';

const initialState = {
    
};

export default function router(state = null, action) {
  switch (action.type) {
    case types.FETCH_OFFERED_CLASSES_SUCCESS:
      return {
         ...action.data
      };

    case types.FETCH_OFFERED_CLASSES_FAILURE:
      return {
        error: action.error
      };

    default:
      return state;
  }
}