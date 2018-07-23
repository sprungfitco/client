import * as paths from '../constants/RouterConstants';
import { navigateTo } from '../actions/RouterActions';

export function purchaseCredits() {
  return dispatch => {
    const initialRoute = { path: paths.PURCHASE_CREDITS_PATH };
    dispatch(navigateTo(initialRoute));
  };
}
