import Cookies from 'js-cookie';
import 'isomorphic-fetch';
import request from 'graphql-request';
import { BASE_URL } from '../constants/ApiConstants';
import * as types from '../constants/ActionTypes';
import { navigateTo } from '../actions/RouterActions';
import * as paths from '../constants/RouterConstants';
import { COOKIE_TOKEN_KEY, COOKIE_USER_INFO } from '../constants/UserConstants';
import * as userTypes from '../constants/UserTypes';
import PropTypes from 'prop-types';

function loginField() {
  return ('personType,status,token,firstName,lastName,email');
}

export function fetchLoginSuccess(username, json) {
  return {
    type: types.LOGIN_SUCCESS,
    data: {
      ...json.data.login, username,
    },
  };
}

function logoutSuccess() {
  return {
    type: types.LOGOUT_SUCCESS
  };
}

function fetchLoginError(data) {
  return {
    type: types.LOGIN_FAILURE,
    error: data.errors[0].message,
  };
}

function setCookies(json) {
    Cookies.set(COOKIE_TOKEN_KEY, json.data.login.token);
    Cookies.set(COOKIE_USER_INFO, `${json.data.login.firstName} ${json.data.login.lastName} ${json.data.login.personType}`);
}

export function login(username, password, postSignUp) {
  return (dispatch) => {

    const mute = `mutation m {
                    login(email:"${username}",password: "${password}")
                    {${loginField()}}
                  }`;

    request(BASE_URL, mute).then(() => {
    }).catch((res) => {
      if (res.response.status === 200) {
        const data = JSON.parse(res.response.error);
        if (data.data && (data.data.login)) {
          setCookies(data)
            dispatch(fetchLoginSuccess(username, data));
            if(data.data.login.personType === userTypes.SPRUNG_ADMIN) {
              const adminDashboardRoute = { path: paths.ADMIN_DEFAULT_PATH };
              dispatch(navigateTo(adminDashboardRoute));
            }
            if (postSignUp) {
              const initialRoute = { path: paths.SIGNED_UP };
              dispatch(navigateTo(initialRoute));
            }
            if(data.data.login.personType !== 4){
              // if user is a not a type of admin role
              window.location.reload()
            }
        } else {
          dispatch(fetchLoginError(data));
        }
      }
    });
  };
}

export function logout() {
  return (dispatch) => {
    // Cookies.remove(COOKIE_TOKEN_KEY);
    // Cookies.remove(COOKIE_USER_INFO);
    let cookies = document.cookie.split(";");
    for (let cookie of cookies) {
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    dispatch(logoutSuccess());
  };
}
