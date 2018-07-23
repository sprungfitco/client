import { request, GraphQLClient } from 'graphql-request';
import { BASE_URL } from '../constants/ApiConstants';
import * as paths from '../constants/RouterConstants';
import { navigateTo } from '../actions/RouterActions';
import * as types from '../constants/ActionTypes';
import Cookies from 'js-cookie';
import { COOKIE_TOKEN_KEY } from '../constants/UserConstants';

export function getreviewPage() {
  console.log('Inside getreviewPage');
  return dispatch => {
    const initialRoute = { path: paths.USER_REVIEW };
    dispatch(navigateTo(initialRoute));
  };
}

function userSessionID(id) {
  return {
    type: types.SESSION_ID,
    userSessionID: id
  };
}

export function updateSessionId(id) {
  console.log('Inside updateSessionId for id ', id);
  return dispatch => {
    dispatch(userSessionID(id));
  };
}

export function giveReview(
  trainerQuality,
  videoQuality,
  setupQuality,
  sessionId,
  comments
) {
  return dispatch => {
    const client = new GraphQLClient(BASE_URL, {
      headers: {
        Authorization: Cookies.get(COOKIE_TOKEN_KEY)
      }
    });

    const mute = `mutation m { 
      postSessionReview (
        trainerQuality:${trainerQuality},
        videoQuality:${videoQuality}, 
        setupQuality:${setupQuality}, 
        sessionId:${sessionId},
        comments:"${comments}"
  )
}`;

    client
      .request(mute)
      .then(() => {})
      .catch(res => {
        if (res.response.status === 200) {
          const data = JSON.parse(res.response.error);
          if (data.data) {
            console.log('Mutation done in postSessionReview', data);
          } else {
            console.log('Mutation done in postSessionReview with error', data);
          }
        }
      })
      .then(() => {
        const initialRoute = { path: paths.HOME_PATH };
        dispatch(navigateTo(initialRoute));
      });
  };
}
