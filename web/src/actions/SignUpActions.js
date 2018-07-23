import Cookies from 'js-cookie';
import 'isomorphic-fetch';
import api from 'graphql-call';
import { GraphQLClient } from 'graphql-request';
import request from 'graphql-request';
import { BASE_URL } from '../constants/ApiConstants';
import * as types from '../constants/ActionTypes';
import * as paths from '../constants/RouterConstants';
import { navigateTo } from '../actions/RouterActions';
import { login } from './LoginActions';

export function returnLogin() {
  return (dispatch) => {
    const initialRoute = { path: paths.LOGIN };
    dispatch(navigateTo(initialRoute));
  }
}

function signUpError(errors) {
  return {
    type: types.SIGNUP_FAILURE,
    error: errors[0].message,
  };
}

function userType(role) {
  return {
    type: types.USER_TYPE,
    userType: role,
  }
}

export function signUpType(role) {
  return (dispatch) => {
    dispatch(userType(role));
  }
}

export function signUp() {
  return (dispatch) => {
    const initialRoute = { path: paths.SIGN_UP };
    dispatch(navigateTo(initialRoute));
  }
}

export function createAccount(username, password, firstName, lastName, mobileNo, typeOfUser) {
  let role = 0;
  if (typeOfUser === 'instructor') {
    role = 1;
  }
  if (typeOfUser === 'team_admin') {
    role = 2;
  }
  return (dispatch) => {
    const mute = `mutation m { 
  signup (
    email:"${username}",
    password:"${password}", 
    firstName:"${firstName}", 
    lastName:"${lastName}",
    mobileNo:"${mobileNo}", 
    typeOfUser: ${role},
  )
}`;
    request(BASE_URL, mute).then(() => {
    }).catch((res) => {
      if (res.response.status === 200) {
        const data = JSON.parse(res.response.error);
        if (data) {
          dispatch(login(username, password, true));
        } else {
          dispatch(signUpError(data.errors));
        }
      }
    });
  };
}
