import Cookies from 'js-cookie';
import 'isomorphic-fetch';
import api from 'graphql-call';
import { GraphQLClient } from 'graphql-request';
import { BASE_URL } from '../constants/ApiConstants';
import * as types from '../constants/ActionTypes';
import * as paths from '../constants/RouterConstants';
import { addCCInfo } from './UsersActions';
import { navigateTo } from '../actions/RouterActions';

import { COOKIE_TOKEN_KEY } from '../constants/UserConstants';
import { login } from './LoginActions';

function sessionsField() {
  return 'id,startTime,endTime,creditsPerMember,durationInMin,catagory,title,instructorName,instructorId,maxMembers,description,usersEnrolled';
}

function lessonField() {
  return 'token,sessionId';
}

export function fetchLessonsSuccess(sessions) {
  return {
    type: types.FETCH_SESSIONS,
    sessions
  };
}

export function fetchTokenSuccess(sessionId, token, classID) {
  return {
    type: types.TOKEN_SUCCESS,
    sessionId,
    token,
    classID
  };
}

export function fetchLessons(date, offset) {
  return dispatch => {
    const client = api({ url: BASE_URL });
    client
      .query({
        getSessions: {
          variables: { date, offset },
          result: sessionsField()
        }
      })
      .then(result => {
        dispatch(fetchLessonsSuccess(result.data.getSessions));
      })
      .catch(error => {
        console.error('error: ', error.errors);
      });
  };
}

// Use the class ID to generate a session id for tokbox, after getting a
// session it will request the token to continue the flow
export function getSessionId(id) {
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });

  return dispatch => {
    const mute = `mutation m { bookSession(sessionId:${id})}`;
    client
      .request(mute)
      .then(() => {})
      .catch(res => {
        if (res.response.status === 200) {
          console.log(res.response.error);
          if (res.response.error.bookSession === false) {
            console.log('Error on getSessionId');
            window.confirm('An error occurred please try again');
          } else {
            dispatch(getTokboxToken(id));
          }
        }
      })
      .then(() => {});
  };
}

export function getTokboxToken(id) {
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });

  return dispatch => {
    const mute = `mutation m { getTokboxToken(sessionId:${id}) {${lessonField()}}}`;
    client
      .request(mute)
      .then(() => {})
      .catch(res => {
        if (res.response.status === 200) {
          const json = JSON.parse(res.response.error);
          const data = json.data.getTokboxToken;
          dispatch(fetchTokenSuccess(data.sessionId, data.token, id));
        }
      })
      .then(() => {
        const initialRoute = { path: paths.VIDEO };
        dispatch(navigateTo(initialRoute));
      });
  };
}

const addCardField = () => {
  return 'id,lastFour,expMonth,expYear';
};

export function storeCreditCard(token, id) {
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });

  const stripeToken = `${token.id}`;

  return dispatch => {
    const mute = `mutation m { addCard(cardToken: "${stripeToken}") {${addCardField()}}}`;
    client
      .request(mute)
      .then(() => {})
      .catch(res => {
        if (res.response.status === 200) {
          console.log(res.response.error);
          const json = JSON.parse(res.response.error);
          console.log(json);
          console.table(json.errors);
          if (json.errors) {
            window.confirm('An error occurred please try again', json.errors);
          } else {
            dispatch(getSessionId(id));
          }
        }
      })
      .then(() => {});
  };
}

export function fetchCreditCard() {
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });
  let query = `{
    getCard {
      id,
      lastFour,
      expMonth,
      expYear
    }
  }`;
  return dispatch => {
    client
      .request(query)
      .then(() => {})
      .catch(res => {
        if (res.response.status === 200) {
          const data = JSON.parse(res.response.error);
          if (data.data && data.data.getCard) {
            dispatch(addCCInfo(data.data.getCard));
          } else {
            console.log('Error on fetchCreditCard');
            console.log(data.errors);
          }
        }
      });
  };
}

export function getTeamAdminCreditInfo() {
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });
  let query = `{
    getCard {
      id,
      lastFour,
      expMonth,
      expYear
    }
  }`;
  return client.request(query).then(() => {});
}
