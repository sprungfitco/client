import * as paths from '../constants/RouterConstants';
import { navigateTo } from '../actions/RouterActions';

export function showTrainers() {
  return dispatch => {
    const initialRoute = { path: paths.TRAINER_LIST };
    dispatch(navigateTo(initialRoute));
  };
}

export function showMyOfferedClasses() {
  return dispatch => {
    const initialRoute = { path: paths.TRAINER_OFFERED_CLASSES };
    dispatch(navigateTo(initialRoute));
  };
}

export function showMyScheduledClasses() {
  return dispatch => {
    const initialRoute = {path : paths.TRAINER_SCHEDULED_CLASSES};
    dispatch(navigateTo(initialRoute));
  }
}

export function showAllOfferedClasses() {
  return dispatch => {
    const initialRoute = { path: paths.ALL_OFFERED_CLASSES };
    dispatch(navigateTo(initialRoute));
  };
}

export function showTrainerCalender() {
  return dispatch => {
    const initialRoute = { path : paths.TRAINER_CALENDER};
    dispatch(navigateTo(initialRoute));
  };
}

export function showCreateClass() {
  return dispatch => {
    const initialRoute = { path: paths.TRAINER_CREATE_CLASS };
    dispatch(navigateTo(initialRoute));
  };
}

export function showClassDetail() {
  return dispatch => {
    const initialRoute = { path: paths.CLASS_DETAIL };
    dispatch(navigateTo(initialRoute));
  };
}