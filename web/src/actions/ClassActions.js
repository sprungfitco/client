import 'isomorphic-fetch';
import Cookies from 'js-cookie';
import { request, GraphQLClient } from 'graphql-request';
import { BASE_URL } from '../constants/ApiConstants';
import { COOKIE_TOKEN_KEY } from '../constants/UserConstants';
import { getTokboxToken } from './LessonsActions';
import { showMyOfferedClasses } from '../actions/trainerRoutingActions';
import * as types from '../constants/ActionTypes'; 


const client = new GraphQLClient(BASE_URL,{ headers: {
  Authorization: Cookies.get(COOKIE_TOKEN_KEY)
}}); 

function sessionType() {
  return "id,startTime,endTime,creditsPerMember,durationInMin,catagory,title,instructorName,maxMembers,description,usersEnrolled";
}

export function scheduleClass(classId,instructorId,slotId) {
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });

  return dispatch => {
    const mute = `mutation m {
      scheduleSession(
        offeredSessionId : ${classId},
        timeSlotId : ${parseInt(slotId)},
        requestAsUser  : false
      )
    }`;

    client.request(mute).then(() => {
    }).catch(result => {
    if (result.response.status === 200) {
      const data = JSON.parse(result.response.error);
      console.log(data)
      if (data.errors) {
        window.confirm(data.errors[0].message)
      } else {
        window.confirm('Class scheduled')
      }
    }
  })
  }
}

export function reserveClass(classId) {
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });

  return dispatch => {
    const mute = `mutation m {
      bookSession(
        sessionId : ${classId}
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
          window.confirm('Class reserved')
        }
      }
    })
  };
}

export function postClass(classDetails) {
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });

  return dispatch => {
      const mute = `mutation m { 
        createSession (
          catagory:${parseInt(classDetails.category)},
          title:"${classDetails.title}",
          description:"${classDetails.description}",
          difficultyLevel: ${parseInt(classDetails.difficulty.value)},
          startTime:${parseInt(classDetails.startTimeEpoch)},
          durationInMin:${parseInt(classDetails.durationInMin)},
          creditsPerMember:${parseInt(classDetails.creditsPerMember)},
          instructorId: ${parseInt(classDetails.instructorId)},
          maxMembers:${parseInt(classDetails.maxMembers)},
          typeOfSession: ${parseInt(classDetails.typeOfSession)},
        ) {${sessionType()}}
      }`;


      client.request(mute).then(() => {
          }).catch(result => {
          if (result.response.status === 200) {
            const data = JSON.parse(result.response.error);
            if (data.errors) {
              window.confirm(data.errors)
            } else {
              window.confirm('Class created')
            }
          }
      })
    };
  }




  export function createClass(classDetails) {
    const client = new GraphQLClient(BASE_URL, {
      headers: {
        Authorization: Cookies.get(COOKIE_TOKEN_KEY)
      }
    });

    let goals = '';
    classDetails.goals.map(goal => {
      goals += `"${goal}"` + ",";      
    });

    goals = goals.substring(0, goals.length - 1);

    let trainerPics = '';
    classDetails.instructorPics.map(picture => {
      trainerPics += 
        `{ pic: "${picture.pic}", 
        title: "${picture.title}", 
        description: "${picture.description}" 
      }`;      
    });

    let sessionPics = '';
    classDetails.sessionPics.map(picture => {
      sessionPics += 
        `{ pic: "${picture.pic}", 
        title: "${picture.title}", 
        description: "${picture.description}" 
      }`;      
    });

    const sessionVideos = 
      `{ video: "${classDetails.sessionVideos.video}",
      videoId: "${classDetails.sessionVideos.videoId}", 
      title: "${classDetails.sessionVideos.title}", 
      description: "${classDetails.sessionVideos.description}" 
    }`;

    let sessionPrice = `{ 
      pricingType: ${parseInt(classDetails.sessionPrice.pricingType)},
      minFlatFee: ${parseInt(classDetails.sessionPrice.minFlatFee)},
      maxFlatFee: ${parseInt(classDetails.sessionPrice.maxFlatFee)},
      minMemberPrice: ${parseInt(classDetails.sessionPrice.minMemberPrice)},
      maxMemberPrice: ${parseInt(classDetails.sessionPrice.maxMemberPrice)}
    }`;      
    
  
    return dispatch => {
        let mute = `
        mutation m { 
          createSession (
            catagory:${parseInt(classDetails.category)},
            subCategories: ["${classDetails.subCategories}"],
            goals: [${goals}],
            title:"${classDetails.title}",
            description:"${classDetails.description}",
            difficultyLevel: ${parseInt(classDetails.difficultyLevel)},
            durationInMin:${parseInt(classDetails.durationInMin)},
            instructorId: ${parseInt(classDetails.instructorId)},
            maxMembers:${parseInt(classDetails.maxMembers)},
            typeOfSession: ${parseInt(classDetails.typeOfSession)},
            pics: [${sessionPics}],
            videos: ${sessionVideos},
            instructorPics: [${trainerPics}],
            sessionPrice: ${sessionPrice}
          ) {${sessionType()}}
        }`;
        

        client.request(mute).then(() => {
            }).catch(result => {
            if (result.response.status === 200) {
              const data = JSON.parse(result.response.error);
              if (data.errors) {
                alert(data.errors[0].message);
              } else {
                dispatch(showMyOfferedClasses());
                dispatch(getAllOfferedClasses());
              }
            }
        })
      };
    }

  



    export function getInstructorFreeSlotsSuccess(data) {
  return {
    type : types.FETCH_FREE_SLOTS_SUCCESS,
    data : [
      ...data
    ]
  };
}

export function getInstructorFreeSlotsFailure(data) {
  return {
    type : types.FETCH_FREE_SLOTS_FAILURE,
    error : data.errors[0].message
  };
}

export function getInstructorFreeSlots(instructorId) {
  const client = new GraphQLClient(BASE_URL, {
    headers : {
      Authorization : Cookies.get(COOKIE_TOKEN_KEY)
    }
  });

  let query = `{
    getInstructorFreeSlots(
      instructorId : ${parseInt(instructorId)},
      from : ${parseInt(new Date().getTime() / 1000)},
      to : ${parseInt(new Date((new Date()).getFullYear(), new Date().getMonth() + 1, new Date().getDate() + 7).getTime() / 1000)}
    )
    {
      slotId,
      durationInMin,
      startTime,
      scheduled
    }
  }`

  return (dispatch) => {
    client.request(query).then(() => { })
    .catch((res) => {
      if (res.response.status === 200) {
        const data = JSON.parse(res.response.error);
        if (data.data && data.data.getInstructorFreeSlots) {
          dispatch(getInstructorFreeSlotsSuccess(data.data.getInstructorFreeSlots));
        } else {
          dispatch(getInstructorFreeSlotsFailure(data));
        }
      }
    })
  }
}

export function getMyScheduledSessionsSuccess(data) {
  return {
    type : types.FETCH_MY_SCHEDULED_CLASSES_SUCCESS,
    data : [
      ...data
    ]
  };
}

export function getMyScheduledClassesFailure(data) {
  return {
    type : types.FETCH_MY_SCHEDULED_CLASSES_FAILURE,
    error : data.errors[0].message
  };
}

export function getMyScheduledClasses() {
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });

  let query = `{
    getMyScheduledSessions (
      from : ${parseInt(new Date().getTime() / 1000)},
      to : ${parseInt(new Date((new Date()).getFullYear(), new Date().getMonth() + 1, new Date().getDate() + 7).getTime() / 1000)}
    ) {
      id,
      typeOfSession,
      instructorName,
      instructorId,
      instructorProfilePic,
      title,
      endTime,
      startTime
      description,
      catagory,
      typeOfSession,
      subCategories,
      durationInMin,
      videos {
        videoId,
        video,title,description
      },
      instructorPics {
      pic, title, description
      },
      pics {
        pic, title, description
      }
    }
  }`;

  return (dispatch) => {
    client.request(query).then(() => { })
    .catch((res) => {
      if (res.response.status === 200) {
        const data = JSON.parse(res.response.error);
        if (data.data && data.data.getMyScheduledSessions) {
          dispatch(getMyScheduledSessionsSuccess(data.data.getMyScheduledSessions));
        } else {
          dispatch(getMyScheduledClassesFailure(data));
        }
      }
    });
  }
}

export function getMyOfferedClassesSuccess(data) {
  return {
    type: types.FETCH_MY_OFFERED_CLASSES_SUCCESS,
    data: [
      ...data
    ]
  };
}

export function getMyOfferedClassesFailure(data) {
  return {
    type: types.FETCH_MY_OFFERED_CLASSES_FAILURE,
    error: data.errors[0].message,
  };
}

export function getMyOfferedClasses(instructorId){
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });
  
  let query = `{
    getOfferedSessions (
      instructorId: ${parseInt(instructorId)}
    )
    {
      catagory,
      creditsPerMember,
      description,
      difficultyLevel,
      durationInMin,
      goals,
      id,
      instructorId,
      instructorName,
      instructorProfilePic,
      maxMembers,
      sessionPic,
      subCategories,
      title,
      typeOfSession,
      videos {
        videoId,
        video,title,description
      },
      instructorPics {
      pic, title, description
      },
      pics {
        pic, title, description
      }
    }
  }`;

  return (dispatch) => {
    client.request(query).then(() => { })
    .catch((res) => {
      if (res.response.status === 200) {
        const data = JSON.parse(res.response.error);
        if (data.data && data.data.getOfferedSessions) {
          dispatch(getMyOfferedClassesSuccess(data.data.getOfferedSessions));
        } else {
          dispatch(getMyOfferedClassesFailure(data));
        }
      }
    })
  }
}

export function getOfferedClassesSuccess(data) {
  return {
    type: types.FETCH_OFFERED_CLASSES_SUCCESS,
    data: [
      ...data
    ]
  };
}

export function getOfferedClassesFailure(data) {
  return {
    type: types.FETCH_OFFERED_CLASSES_FAILURE,
    error: data.errors[0].message,
  };
}

export function getAllOfferedClasses(){
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });
  
  let query = `{
    getOfferedSessions 
    { 
      catagory,
      creditsPerMember,
      description,
      difficultyLevel,
      durationInMin,
      goals,
      id,
      instructorId,
      instructorName,
      instructorProfilePic,
      maxMembers,
      sessionPic,
      subCategories,
      title,
      typeOfSession,
      videos {
        videoId,
        video,title,description
      },
      instructorPics {
      pic, title, description
      },
      pics {
        pic, title, description
      }
    }
  }`;

  return (dispatch) => {
    client.request(query).then(() => { })
    .catch((res) => {
      if (res.response.status === 200) {
        const data = JSON.parse(res.response.error);
        if (data.data && data.data.getOfferedSessions) {
          dispatch(getOfferedClassesSuccess(data.data.getOfferedSessions));
        } else {
          dispatch(getOfferedClassesFailure(data));
        }
      }
    })
  }
}

export function removeClass(instructorId, classId){
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });
  
  let mute = `mutation m {
    removeFromOfferedSession (
      offeredSessionId: ${parseInt(classId)}
    )
  }`;

  return (dispatch) => {
    client.request(mute).then(() => { })
    .catch((res) => {
      if (res.response.status === 200) {
        const data = JSON.parse(res.response.error);
        if (data.data ) {
          dispatch(getMyOfferedClasses(instructorId));
        } else {
          dispatch(getMyfferedClassesFailure(data));
        }
      }
    })
  }
}

export function getSessionSuccess(data) {
  return {
    type: types.GET_SESSION_SUCCESS,
    data: data
  };
}

export function getSessionFailure(data) {
  return {
    type: types.GET_SESSION_FAILURE,
    error: data.errors[0].message,
  };
}

export function getSession(classId){
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });
  
  let mute = `query q {
    getSession (
      id: ${parseInt(classId)}
    )
    { 
      catagory,
      creditsPerMember,
      description,
      difficultyLevel,
      durationInMin,
      goals,
      id,
      instructorId,
      instructorName,
      instructorProfilePic,
      maxMembers,
      sessionPic,
      subCategories,
      title,
      typeOfSession,
      videos {
        videoId,
        video,title,description
      },
      instructorPics {
      pic, title, description
      },
      pics {
        pic, title, description
      }
    }
  }`;

  return (dispatch) => {
    client.request(mute).then(() => { })
    .catch((res) => {
      if (res.response.status === 200) {
        const data = JSON.parse(res.response.error);
        if (data.data ) {
          dispatch(getSessionSuccess(data.data.getSession));
        } else {
          dispatch(getSessionFailure(data));
        }
      }
    })
  }
}
  