import * as types from '../constants/ActionTypes';

const initialRoute = { path: '', query: {} };
const initialState = { route: initialRoute };

export default function router(state = initialState, action) {
  switch (action.type) {
    case types.CHANGE_ROUTE:
      return {
        ...state,
        route: action.route,
      };

    case types.START_OVER:
      return { ...initialState };

    default:
      return state;
  }
}
