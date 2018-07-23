import 'isomorphic-fetch';
import Cookies from 'js-cookie';
import { request, GraphQLClient } from 'graphql-request';
import { BASE_URL } from '../constants/ApiConstants';
import { COOKIE_TOKEN_KEY } from '../constants/UserConstants';
import * as types from '../constants/ActionTypes';
import { getInstructorFreeSlots } from '../actions/ClassActions';

function trainerType() {
  return 'id,firstName,lastName,profilePic,areasOfExpertise,instructorRating';
}


export function getTrainersWith(category) {
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });
}

export function getTrainersListSuccess(traineeList) {
  return {
    type: types.FETCH_TRAINERS_LIST_SUCCESS,
    data: {
      traineeList
    }
  };
}

export function getTrainersListFailure(data) {
  return {
    type: types.FETCH_TRAINERS_LIST_FAILURE,
    error: data.errors[0].message,
  };
}

export function getAllTrainersList(filterCriteria){
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });

  const instructorListType = `{
    id,
    firstName,
    lastName,
    profilePic,
    instructorRating,
    areasOfExpertise
  }`;

  let paramsArr = [];
  let  query = `{
    getInstructorList ${instructorListType}
  }`;
  if(filterCriteria) {
    
      if(filterCriteria.service && filterCriteria.service !== '') 
      {
        paramsArr.push('goal:"' + filterCriteria.service + '"')
      };
      if(filterCriteria.category && filterCriteria.category !== '') 
      { 
        paramsArr.push('catagoryId:' + parseInt(filterCriteria.category))
      };
      if(filterCriteria.rangeFrom && filterCriteria.rangeFrom !== '') 
      {
        paramsArr.push('experience: { from:' + filterCriteria.rangeFrom + 
        ',to:' + filterCriteria.rangeTo + '}')
      };

      if(paramsArr.length > 0) {
        query = `{
          getInstructorList (${paramsArr.join(',')} ) ${instructorListType}
        }`;
      }
  }
  
  return (dispatch) => {
    client.request(query).then(() => { })
    .catch((res) => {
      if (res.response.status === 200) {
        const data = JSON.parse(res.response.error);
        if (data.data && data.data.getInstructorList) {
          dispatch(getTrainersListSuccess(data.data.getInstructorList));
        } else {
          dispatch(getTrainersListFailure(data));
        }
      }
    })
  }
}


export function getCategoriesSuccess(categories) {
  return {
    type: types.FETCH_CATEGORIES_SUCCESS,
    data: {
      categories
    }
  };
}

export function getCategoriesFailure(data) {
  return {
    type: types.FETCH_CATEGORIES_FAILURE,
    error: data.errors[0].message,
  };
}

export function getCategories(){
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });
  
  let query = `{
    getCategories
    {
      id,
      name,
      topCategory
    }

  }`;
  return (dispatch) => {
    client.request(query).then(() => { })
    .catch((res) => {
      if (res.response.status === 200) {
        const data = JSON.parse(res.response.error);
        if (data.data && data.data.getCategories) {
          dispatch(getCategoriesSuccess(data.data.getCategories));
        } else {
          dispatch(getCategoriesFailure(data));
        }
      }
    })
  }
}


export function getSubCategoriesSuccess(categories) {
  return {
    type: types.FETCH_SUB_CATEGORIES_SUCCESS,
    data: {
      categories
    }
  };
}

export function getSubCategoriesFailure(data) {
  return {
    type: types.FETCH_SUB_CATEGORIES_FAILURE,
    error: data.errors[0].message,
  };
}

export function getSubCategories(categoryId){
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });
  
  let query = `{
    getSubCategories (
      categoryId: ${categoryId}
    )
  }`;
  return dispatch => {
      client.request(query).then(() => { 
      })
      .catch((res) => {
        if (res.response.status === 200) {
          const data = JSON.parse(res.response.error);
          if (data.data && data.data.getSubCategories) {
            dispatch(getSubCategoriesSuccess(data.data.getSubCategories));
          } else {
            dispatch(getSubCategoriesFailure(data));
          }
        }
      })
    }
}


export function getInstructorCalendartSuccess(data) {
  return {
    type: types.FETCH_INSTRUCTOR_CALENDER_SUCCESS,
    data: {
      ...data
    }
  };
}

export function getInstructorCalendarFailure(data) {
  return {
    type: types.FETCH_INSTRUCTOR_CALENDER_FAILURE,
    error: data.errors[0].message,
  };
}

export function deleteInstructorFreeSlot(slotId,instructorId) {
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });  

  return dispatch => {
    const mute = `mutation m {
      deleteInstructorFreeSlot(
        slotId : ${slotId},
      )
    }`;

    client.request(mute).then(() => {
      }).catch(result => {
      if (result.response.status === 200) {
        const data = JSON.parse(result.response.error);
        console.log(data)
        if (data.errors) {
          window.confirm(data.errors)
        } else {
          window.confirm('Slot deleted');
          dispatch(getInstructorCalender(instructorId));
          dispatch(getInstructorFreeSlots(instructorId));
        }
      }
    })
  };
}

export function reserveSlot(slot,instructorId) {
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });  

  return dispatch => {
    const mute = `mutation m {
      addInstructorFreeSlot(
        startTime : ${slot.startTime},
        durationInMin : ${slot.duration}
      ) {
        slotId
      }
    }`;

    client.request(mute).then(() => {
      }).catch(result => {
      if (result.response.status === 200) {
        const data = JSON.parse(result.response.error);
        console.log(data)
        if (data.errors) {
          window.confirm(data.errors)
        } else {
          window.confirm('Free slot added');
          dispatch(getInstructorCalender(instructorId));
          dispatch(getInstructorFreeSlots(instructorId));
        }
      }
    })
  };
} 


export function getInstructorCalender(instructorId) {
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });
  
  let month = (new Date().getMonth() + 1).toString();
  if(month.length === 1) {
    month = '0' + month;
  }
  let day =  (new Date().getDate()).toString()
  if(day.length === 1) {
    day = '0' + day;
  }
  let date = (new Date().getFullYear()).toString() + '-' + month + '-' + day;

  let query = `{
    getInstructorCalendar(
      instructorId : ${instructorId},
      date : "${date}",
      offset : ${(new Date()).getTimezoneOffset()}
    ) {
      instructorId,
      title,
      endTime,
      startTime,
      maxMembers,
      typeOfSession,
      usersEnrolled,
      id
    }
  }`;

  return (dispatch) => {
    client.request(query).then(() => { })
    .catch((res) => {
      if (res.response.status === 200) {
        const data = JSON.parse(res.response.error);
        if (data.data && data.data.getInstructorCalendar) {
          dispatch(getInstructorCalendartSuccess(data.data.getInstructorCalendar));
        } else {
          dispatch(getInstructorCalendarFailure(data));
        }
      }
    })
  }

}


export function getServiceListSuccess(categories) {
  return {
    type: types.FETCH_SERVICE_LIST_SUCCESS,
    data: {
      categories
    }
  };
}

export function getServiceListFailure(data) {
  return {
    type: types.FETCH_SERVICE_LIST_FAILURE,
    error: data.errors[0].message,
  };
}

export function getServiceList(){
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });
  
  let query = `{
    getServiceList
    {
      includedServices,
      serviceType,
      serviceLabel
    }

  }`;
  return (dispatch) => {
    client.request(query).then(() => { })
    .catch((res) => {
      if (res.response.status === 200) {
        const data = JSON.parse(res.response.error);
        if (data.data && data.data.getServiceList) {
          dispatch(getServiceListSuccess(data.data.getServiceList));
        } else {
          dispatch(getServiceListFailure(data));
        }
      }
    })
  }
}


