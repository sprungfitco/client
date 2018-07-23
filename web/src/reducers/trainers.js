import * as types from '../constants/ActionTypes';

const initialState = {
  areasOfExpertise: [],
  error: '',
  id: 0,
  firstName: 0,
  instructorRating: '',
  lastName: 1
};

export default function router(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_TRAINERS_LIST_SUCCESS:
      return {
         ...action.data
      };

    case types.FETCH_TRAINERS_LIST_FAILURE:
      return {
        error: action.error
      };

    case types.LOGOUT_SUCCESS:
      return {
        initialState
      };
      
    default:
      return state;
  }
}
