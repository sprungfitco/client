/* global history */
/* eslint no-restricted-globals: ["error", "event"] */

import * as types from '../constants/ActionTypes';
import { constructUrl } from '../utils/RouterUtils';

function pushState(route) {
  history.pushState({ route }, '', `#/${constructUrl(route)}`);
}

export function changeRoute(route) {
  return {
    type: types.CHANGE_ROUTE,
    route,
  };
}

export function navigateTo(route, shouldPushState = true) {
  return (dispatch, getState) => {
    const { router } = getState();
    const { data } = router.route;
    if (constructUrl(route) === constructUrl(router.route)
        && (route.data === undefined || route.data === null || route.data.value === data.value)) {
      return null;
    }

    if (shouldPushState) {
      pushState(route);
    }

    return dispatch(changeRoute(route));
  };
}
