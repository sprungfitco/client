import * as paths from '../constants/RouterConstants';
import { navigateTo } from '../actions/RouterActions';
import * as types from '../constants/ActionTypes';
import Cookies from 'js-cookie';
import 'isomorphic-fetch';
import {notify} from 'react-notify-toast';
import { request, GraphQLClient } from 'graphql-request';
import { BASE_URL } from '../constants/ApiConstants';
import { COOKIE_TOKEN_KEY } from '../constants/UserConstants';
import { getTrainerInfo } from './editTrainer'
import { logout } from './LoginActions';


function profileUpdateField() {
  return ('id,firstName,lastName,email,age,sex,mobileNo,profilePic');
}
function profileImgUpdateField() {
  return ('id,firstName,lastName,profilePic');
}

export function profilePage() {
  
  return dispatch => {
    const initialRoute = { path: paths.USER_PROFILE };
    dispatch(navigateTo(initialRoute));
  };
}

export function fetchUserInfoSuccess(userInfo) {
  return {
    type: types.FETCH_USER_INFO,
    data: {
      ...userInfo
    }
  };
}

export function fetchUserInfoFailure(data) {
  return {
    type: types.FETCH_USER_INFO_FAILURE,
    error: data.errors[0].message,
  };
}

export function getUserInfo(){
  const client = new GraphQLClient(BASE_URL,{ headers: {
    Authorization: Cookies.get(COOKIE_TOKEN_KEY)
  }});

  return dispatch => {
    const query = `{ getUserInfo
                      {
                        id,
                        firstName,
                        lastName,
                        sex,
                        email,
                        mobileNo,
                        credits,
                        profilePic,
                        age
                      }
                    }`
    client.request(query).then(() => {
        }).catch(result => {
        if (result.response.status === 200) {
          const data = JSON.parse(result.response.error);
          
          if (data.errors) {
            if(data.errors && data.errors[0] && data.errors[0].message && data.errors[0].message == "Token is expired"){
            // if(data.errors && data.errors[0] && data.errors[0].message){
              // notify.show("Session Expired please login again!", "error", 5000)
              return dispatch(logout());
            }
            return dispatch(fetchUserInfoFailure(data))
          } else {
            dispatch(fetchUserInfoSuccess(data.data.getUserInfo));
          }
        }
    })
  }
}

function updateProfileError(data) {
  console.log('updateProfileError', data.errors);
  return {
    type: types.UPDATE_USER_PROFILE_FAILURE,
    error: data.errors[0].message,
  };
}

function updateProfileSucess(data) {
  return {
    type: types.UPDATE_USER_PROFILE_SUCCESS,
    data: {...data}
  };
}

export function updateUserProfileInfo(userProfileInfo){
  return (dispatch) => {
    
    const client = new GraphQLClient(BASE_URL,{ headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }});

    const { firstName, lastName, age, sex, mobileNo, profilePic } = userProfileInfo;
    const mute = `mutation editUser{
      editUser(
        firstName:"${firstName}",
        lastName: "${lastName}",
        age:${age},
        sex: ${sex},
        mobileNo: "${mobileNo}",
        profilePic: "${profilePic}"
      ) {${profileUpdateField()}}}`;

      client.request(mute).then(() => { })
      .catch((res) => {
        if (res.response.status === 200) {
          const data = JSON.parse(res.response.error);
          if (data.data && data.data.editUser) {
            dispatch(updateProfileSucess(data.data.editUser));
          } else {
            dispatch(updateProfileError(data));
          }
        }
      })
  }
}

export function updateUserProfileImg(userProfileInfo){
  return (dispatch) => {
    const client = new GraphQLClient(BASE_URL,{ 
      headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }});
    const { profilePic } = userProfileInfo;
    const mute = `mutation editUser{
      editUser(
        profilePic: "${profilePic}"
      ) {${profileImgUpdateField()}}}`;

      client.request(mute).then(() => { })
      .catch((res) => {
        if (res.response.status === 200) {
          const data = JSON.parse(res.response.error);
          if (data.data && data.data.editUser) {
            //notify.show('Profile Image updated!', "success", 5000);
            dispatch(getTrainerInfo(data.data.editUser.id));
            dispatch(updateProfileSucess(data.data.editUser));
            dispatch(getUserInfo());
          } else {
           // notify.show("Error while uploading image. Please try after some time!", "error", 5000)
            dispatch(getTrainerInfo(data.data.editUser.id));
            dispatch(fetchUserInfoFailure(data));
            dispatch(updateProfileError(data));
          }
        }
      })
  }
}
