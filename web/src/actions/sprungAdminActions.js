import * as paths from '../constants/RouterConstants';
import { navigateTo } from '../actions/RouterActions';

export function sprungAdminPage() {
  return dispatch => {
    const initialRoute = { path: paths.ADMIN_DEFAULT_PATH };
    dispatch(navigateTo(initialRoute));
  };
}
