import * as types from '../constants/ActionTypes';

const initialState = {
  team: null
};

export default function router(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_PENDING_INVITES_SUCCESS:
      return {
        ...action.data
      };

    case types.FETCH_PENDING_INVITES_FAILURE:
      return {
        error: action.error
      };

    case types.FETCH_TEAM_SUCCESS:
      return {
        ...action.data.team
      };

    case types.FETCH_TEAM_FAILURE:
      return {
        error: action.error
      };

    case types.CREATE_TEAM_SUCCESS:
      return {
        ...action.data
      };

    case types.CREATE_TEAM_FAILURE:
      return {
        error: action.error
      };
    case types.SEND_INVITES_TEAM_SUCCESS:
      return {
        ...action.data
      }
    case types.SEND_INVITES_TEAM_FAILURE:
      return {
        error: action.error
      }
    case types.FETCH_TEAM_MEMBERS_SUCCESS:
      return {
        ...action.data
      }
    case types.FETCH_TEAM_MEMBERS_FAILURE:
      return{
        error: action.error
      }
    default:
      return state;
  }
}
//

