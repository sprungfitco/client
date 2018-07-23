import * as types from '../constants/ActionTypes';

const initialState = {
    id: 0,
    name: '',
    topCategory:false
};

export default function router(state = null, action) {
  switch (action.type) {
    case types.FETCH_CATEGORIES_SUCCESS:
      return {
         ...action.data
      };

    case types.FETCH_CATEGORIES_FAILURE:
      return {
        error: action.error
      };

    default:
      return state;
  }
}