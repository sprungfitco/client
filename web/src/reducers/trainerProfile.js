import * as types from '../constants/ActionTypes';

const initialState = {
  areasOfExpertise: [],
  error: '',
  id: 0,
  firstName: 0,
  instructorRating: '',
  lastName: 1
};

export default function router(state = null, action) {
  switch (action.type) {
    case types.FETCH_TRAINERS_PROFILE_SUCCESS:
      return {
        ...action.data
      };

    case types.FETCH_TRAINERS_PROFILE_FAILURE:
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
