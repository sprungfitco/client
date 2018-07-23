import * as types from '../constants/ActionTypes';

export default function instructorCal(state = [], action) {
  switch (action.type) {
    case types.FETCH_INSTRUCTOR_CAL:
      return [...state, action.insSessions];

    default:
      return state;
  }
}
