import * as types from '../constants/ActionTypes';

const initialState = {
    
};

export default function router(state = null, action) {
  switch (action.type) {
    case types.FETCH_INSTRUCTOR_CALENDER_SUCCESS:
      return {
         ...action.data
      };

    case types.FETCH_INSTRUCTOR_CALENDER_FAILURE:
      return {
        error: action.error
      };

    default:
      return state;
  }
}