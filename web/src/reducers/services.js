import * as types from '../constants/ActionTypes';

const initialState = {
  includedServices: '',
  serviceType: 0,
  serviceLabel: ''
};

export default function router(state = null, action) {
  switch (action.type) {
    case types.FETCH_SERVICE_LIST_SUCCESS:
      return {
         ...action.data
      };

    case types.FETCH_SERVICE_LIST_FAILURE:
      return {
        error: action.error
      };

    default:
      return state;
  }
}