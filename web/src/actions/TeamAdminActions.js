import 'isomorphic-fetch';
import Cookies from 'js-cookie';
import { request, GraphQLClient } from 'graphql-request';
import { BASE_URL } from '../constants/ApiConstants';
import { COOKIE_TOKEN_KEY } from '../constants/UserConstants';
import * as paths from '../constants/RouterConstants'
import { navigateTo } from './RouterActions'
import {
  getTrainersListFailure,
  getTrainersListSuccess
} from './TrainersActions'
import * as types from '../constants/ActionTypes'

export function showAdminPage() {
  return dispatch => {
    const initialRoute = { path: paths.TEAM_ADMIN };
    dispatch(navigateTo(initialRoute));
  };
}

export function getTeamSuccess(team) {
  return {
    type: types.FETCH_TEAM_SUCCESS,
    data: {
      team
    }
  };
}

export function getTeamFailure(data) {
  return {
    type: types.FETCH_TEAM_FAILURE,
    error: data.errors[0].message,
  };
}


export function getTeamMembersSuccess(teamMembers) {
  return {
    type: types.FETCH_TEAM_MEMBERS_SUCCESS,
    data: {
      teamMembers
    }
  };
}

export function  getTeamMembersFailure(data) {
  return {
    type: types.FETCH_TEAM_MEMBERS_FAILURE,
    error: data.errors[0].message,
  };
}

export function getPendingInvitesSuccess(invites) {

  return {
    type: types.FETCH_PENDING_INVITES_SUCCESS,
    data: {
      invites
    }
  };
}

export function getPendingInvitesFailure(data) {
  return {
    type: types.FETCH_PENDING_INVITES_FAILURE,
    error: data.errors[0].message,
  };
}

export function senNewInvitesSuccess(team) {
  return {
    type: types.SEND_INVITES_TEAM_SUCCESS,
    data: {
      team
    }
  };
}

export function senNewInvitesFailure(data) {
  return {
    type: types.SEND_INVITES_TEAM_FAILURE,
    error: data.errors[0].message,
  };
}

export function createTeamSuccess(team) {
  return {
    type: types.FETCH_TEAM_SUCCESS,
    data: {
      team
    }
  };
}

export function createTeamFailure(data) {
  return {
    type: types.FETCH_TEAM_FAILURE,
    error: data.errors[0].message,
  };
}

export function deactivateTeamMemberSuccess(success) {
  return {
    type: types.DEACTIVATE_TEAM_MEMBER_SUCCESS,
    data: {
      success
    }
  };
}

export function deactivateTeamMemberFailure(data) {
  return {
    type: types.DEACTIVATE_TEAM_MEMBER_FAILURE,
    error: data.errors[0].message,
  };
}

export function createTeam (name, creditLimitPerUser) {
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });

  const mutation = `mutation m { 
        createTeam (
          name:"${name}",
          creditsLimitPerUser:${creditLimitPerUser},
        ) {id, adminId, credits, monthStart, monthEnd, creditsLimitPerUser}
      }`;
  return (dispatch) => {
    client.request(mutation).then(() => {
    }).catch(result => {
      if (result.response.status === 200) {
        const data = JSON.parse(result.response.error);
        console.log(data)
        if (data.errors) {
          dispatch(createTeamFailure(data));
        } else {
          dispatch(createTeamSuccess(data.data.createTeam));
          getTeam()
        }
      }
    })
  }
}

export function getTeam(){
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });
  let query = `{
    getTeamInfoForAdmin {
      id,
      name,
      monthStart,
      monthEnd,
      credits,
      creditsLimitPerUser,
      autoRenewAmount,
      autoRenewThreshold,
      autoRenewEnabled
    } 
  }`;
  return (dispatch) => {
    client.request(query).then(() => { })
      .catch((res) => {
        if (res.response.status === 200) {
          const data = JSON.parse(res.response.error);
          if (data.data && data.data.getTeamInfoForAdmin
          ) {
            dispatch(getTeamSuccess(data.data.getTeamInfoForAdmin
            ));
          } else {
            dispatch(getTeamFailure(data));
          }
        }
      })
  }
}

export function getPendingInvitations(){
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });
  let query = `{
    getPendingInvites {
      userId,
      email
    }
  }`;
  return (dispatch) => {
    client.request(query).then(() => { })
      .catch((res) => {
        if (res.response.status === 200) {
          const data = JSON.parse(res.response.error);
          console.log(data)
          if (data.data && data.data.getPendingInvites) {
            dispatch(getPendingInvitesSuccess(data.data.getPendingInvites
            ));
          } else {
            dispatch(getPendingInvitesFailure(data));
          }
        }
      })
  }
}


export function senNewInvites(listing){
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });

  let emailsList = [];

  listing.map((email) => {
    const e = `"${email}"`;
    emailsList.push(e);
  })
 
  const mutation = `mutation m { 
        inviteUsersToTeam (emails: [${emailsList}]) {emails {email,status,failMsg}}
      }`;
  return (dispatch) => {
    client.request(mutation).then(() => {
    }).catch(result => {
      if (result.response.status === 200) {
        const data = JSON.parse(result.response.error);
        console.log(data)
        if (data.errors) {
          dispatch(senNewInvitesFailure(data));
        } else {
          dispatch(senNewInvitesSuccess(data.data.InviteUsersToTeamResponse));
        }
      }
    })
  }
}

export function getTeamMembers(){
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });
  let query = `{
    getAllTeamMembers {
      email, userId, creditsUsed
    } 
  }`;
  return (dispatch) => {
    client.request(query).then(() => { })
      .catch((res) => {
        if (res.response.status === 200) {
          const data = JSON.parse(res.response.error);
          if (data.data && data.data.getAllTeamMembers
          ) {
            dispatch(getTeamMembersSuccess(data.data.getAllTeamMembers
            ));
          } else {
            dispatch(getTeamMembersFailure(data));
          }
        }
      })
  }
}

export function deactivateTeamMember(id){
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });
  const mutation = `mutation m { 
        removeTeamMember (
          userId:${id},
        )
      }`;
  return (dispatch) => {
    client.request(mutation).then(() => {
    }).catch(result => {
      if (result.response.status === 200) {
        const data = JSON.parse(result.response.error);
        console.log(data)
        getTeam()
        if (data.errors) {
          dispatch(deactivateTeamMemberFailure(data));
          window.confirm(data.errors[0].message)
        } else {
          dispatch(deactivateTeamMemberSuccess(data.data.InviteUsersToTeamResponse));
          dispatch(getTeamMembers());
        }
      }
    })
  }
}

export function removeInvitation(id){
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });
  const mutation = `mutation m { 
        removeTeamMember (
          userId:${id},
        )
      }`;
  return (dispatch) => {
    client.request(mutation).then(() => {
    }).catch(result => {
      if (result.response.status === 200) {
        const data = JSON.parse(result.response.error);
        console.log(data)
        getTeam()
        if (data.errors) {
          dispatch(deactivateTeamMemberFailure(data));
          window.confirm(data.errors[0].message)
        } else {
          dispatch(deactivateTeamMemberSuccess(data.data.removeTeamMember));
          dispatch(getPendingInvitations());
        }
      }
    })
  }
}

export const setAutoRenew = (data) => (dispatch, getState) => {
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });

  const mutation = `mutation m { 
        setAutoRenew (
          amount:${data.rechargeAmount},
          threshold: ${data.thresholdBalance},
          enable: ${data.shouldEnableAutoRenew}
        )
  }`;

   
  return client.request(mutation).then(() => {
    }).catch(result => {
      if (result.response.status === 200) {
        const data = JSON.parse(result.response.error);
        if (data.errors) {
          window.confirm(data.errors[0].message)
        } else {
          dispatch(getTeam());
        }
      }
    })
}

export const addCreditsToTeam = (data) => (dispatch, getState) => {
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });

  const credits = parseInt(data.creditsAmount)*100;
  const mutation = `mutation m { 
    purchaseTeamCredits (
          amountInCents: ${credits}
        ) { 
          id,
          name,
          monthStart,
          monthEnd,
          credits,
          creditsLimitPerUser,
          autoRenewAmount,
          autoRenewThreshold,
          autoRenewEnabled
         }
  }`;

   
  return client.request(mutation).then(() => {
    }).catch(result => {
      if (result.response.status === 200) {
        const data = JSON.parse(result.response.error);
        if (data.errors) {
          window.confirm(data.errors[0].message)
        } else {
          dispatch(getTeamSuccess(data.data.purchaseTeamCredits));
        }
      }
    })
}

const addCardField = () => {
  return 'id,lastFour,expMonth,expYear';
}

function saveCardAndPay(token, teamId, creditsAmount) {
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });

  const stripeToken = `${token}`

  return dispatch => {
    const mute = `mutation m { addCard(cardToken: "${stripeToken}") {${addCardField()}}}`;
    client
      .request(mute)
      .then(() => {})
      .catch(res => {
        if (res.response.status === 200) {
          const json = JSON.parse(res.response.error);
          if (json.errors) {
            window.confirm('An error occurred please try again', json.errors);
          } else {
            dispatch(addCreditsToTeam({teamId, creditsAmount}))
          }
        }
      })
      .then(() => {});
  };
}

export function saveAdminCard(token) {
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });

  const stripeToken = `${token}`

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
          } 
        }
      })
      .then(() => {});
  };
}

export function deleteCard(token, teamId, creditsAmount) {
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });

  return dispatch => {
    const mute = `mutation m {deleteCard}`;
    client
      .request(mute)
      .then(() => {})
      .catch(res => {
        dispatch(saveCardAndPay(token, teamId, creditsAmount));
      })
  };
}


export const addEditTeamAdress = (values) => {
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });

  return dispatch => {
    const mute = `mutation m { 
      updateTeamAddress(
        country: "${values.country}", 
        streetNo: "${values.streetNo}", 
        streetName: "${values.streetName}", 
        apartmentNo: "${values.apartmentNo}", 
        city: "${values.city}", 
        zipcode: ${values.zipcode}, 
        state: "${values.state}"
        )
      }`;
    client
      .request(mute)
      .then(() => {})
      .catch(result => {
        if (result.response.status === 200) {
        const data = JSON.parse(result.response.error);
        console.log("checking data on adding adrress", data)
        if (data.errors) {
          window.confirm(data.errors[0].message)
        } 
      }
      })
      .then(() => {});
  };
}


export function getTeamAdress(teamId) {
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });
  
  const query = `{ 
    getTeamAddress(
      teamId: ${teamId}, 
      ) {
        country, streetNo, streetName, apartmentNo, city, zipcode, state
      }
    }`;

  return client.request(query).then(() => {});
}