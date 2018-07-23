import 'isomorphic-fetch';
import Cookies from 'js-cookie';
import { request, GraphQLClient } from 'graphql-request';
import { BASE_URL } from '../constants/ApiConstants';
import { COOKIE_TOKEN_KEY } from '../constants/UserConstants';
import * as types from '../constants/ActionTypes'



export function getTrainersSuccess(trainers) {
  return {
    type: types.GET_TRAINERS_SUCCESS,
    trainers
  };
}

export function addCCInfo(data) {
  console.log("checking action data", data)
  return {
    type: types.ADD_CC_INFO,
    data
  };
}


export function getUsersWithType(type) {
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });

  return dispatch => {
    const query = `query q { getAllUsers(typeOfUser: ${type}) { id,firstName,lastName,credits,age,sex,profilePic,profilePic,mobileNo }}`
    client.request(query).then(() => {
    }).catch(result => {
      if (result.response.status === 200) {
        const json = JSON.parse(result.response.error);
        const data = json.data.getAllUsers;
        dispatch(getTrainersSuccess(data));
      }
    }).catch(error => {
      console.error('error: ', error);
    });
  }
}