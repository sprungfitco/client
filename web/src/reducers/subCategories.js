import * as types from '../constants/ActionTypes';

const initialState = {
};

export default function router(state = null, action) {
  switch (action.type) {
    case types.FETCH_SUB_CATEGORIES_SUCCESS:
      return {
         ...action.data
      };

    case types.FETCH_SUB_CATEGORIES_FAILURE:
      return {
        error: action.error
      };

    default:
      return state;
  }
}