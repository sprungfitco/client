import * as paths from '../constants/RouterConstants';
import { navigateTo } from '../actions/RouterActions';

export function showHome() {
  return dispatch => {
    const initialRoute = { path: paths.HOME_PATH };
    dispatch(navigateTo(initialRoute));
  };
}
