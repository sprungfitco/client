import * as types from '../constants/ActionTypes';

const initialState = {
  comments: '',
  trainerQuality: 0,
  firstName: '',
  lastName: ''
};

export default function router(state = null, action) {
  switch (action.type) {
    case types.FETCH_TRAINER_REVIEWS_SUCCESS:
      return {
        ...action.data
      };

    case types.FETCH_TRAINER_REVIEWS_FAILURE:
      return {
        error: action.error
      };

    default:
      return state;
  }
}
