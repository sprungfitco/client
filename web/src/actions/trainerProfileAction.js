import * as paths from '../constants/RouterConstants';
import { navigateTo } from '../actions/RouterActions';
import api from 'graphql-call';
import 'isomorphic-fetch';
import Cookies from 'js-cookie';
import { request, GraphQLClient } from 'graphql-request';
import { BASE_URL } from '../constants/ApiConstants';
import { COOKIE_TOKEN_KEY } from '../constants/UserConstants';
import * as types from '../constants/ActionTypes';

function calendarField() {
  return 'id,creditsPerMember,usersEnrolled,catagory,description,instructorId,instructorId,maxMembers,typeOfSession,startTime,endTime,sessionPic,title';
}

export function getTrainerProfile() {
  return dispatch => {
    const initialRoute = { path: paths.TRAINER_PROFILE };
    dispatch(navigateTo(initialRoute));
  };
}

export function getTrainerProfileSuccess(data) {
  return {
    type: types.FETCH_TRAINERS_PROFILE_SUCCESS,
    data: {
      ...data
    }
  };
}

export function getTrainersProfileFailure(data) {
  return {
    type: types.FETCH_TRAINERS_PROFILE_FAILURE,
    error: data.errors[0].message
  };
}

export function getTrainerProfileDetail(instructorId) {
  instructorId = Number(instructorId);
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });
  let query = `{
    getInstructorProfile(
      instructorId: ${instructorId}
    ) {
        firstName,
        lastName,
        description,
        favoriteThings,
        instructorRating,
        instructorId,
        profilePic,
        totalExperience
        areasOfExpertise 
        {
          areaOfExpertise,
          experience,
          skills 
          {
            skill
          }
        },
        instructorPhotos
        {
          photoId,
          link
        },
        instructorServices {
          serviceType,
          services
        }
      }
  }`;

  return dispatch => {
    client
      .request(query)
      .then(() => {})
      .catch(res => {
        if (res.response.status === 200) {
          const data = JSON.parse(res.response.error);
          if (data.data && data.data.getInstructorProfile) {
            dispatch(getTrainerProfileSuccess(data.data.getInstructorProfile));
          } else {
            dispatch(getTrainersProfileFailure(data));
          }
        }
      });
  };
}

function updateBioError(data) {
  console.log('updateProfileError', data.errors);
  return {
    type: types.UPDATE_TRAINER_BIO_FAILURE,
    error: data.errors[0].message,
  };
}

function updateBioSucess(data) {
  return {
    type: types.UPDATE_TRAINER_BIO_SUCCESS,
    data: {...data}
  };
}

export function updateTrainerBio(trainerInfo, id) {
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });

  
  return (dispatch) => {
    let { description, favoriteThings, totalExperience } = trainerInfo;

    const mute = `mutation updateInstructorProfile{
      updateInstructorProfile(
        description: "${description}",
        favoriteThings: "${favoriteThings}",
        totalExperience: ${totalExperience}
      )}`;

      client.request(mute).then(() => { })
      .catch((res) => {
        if (res.response.status === 200) {
          const data = JSON.parse(res.response.error);
          if (data.data && data.data.updateInstructorProfile) {
            dispatch(getTrainerProfileDetail(id));
          } else {
            dispatch(updateBioError(data));
          }
        }
      })
  }
}

export function fetchInstructorCalendarSuccess(insSessions) {
  return {
    type: types.FETCH_INSTRUCTOR_CAL,
    insSessions
  };
}

export function fetchInstructorCalendar(instructorId, date, offset) {
  return dispatch => {
    const client = api({ url: BASE_URL });
    client
      .query({
        getInstructorCalendar: {
          variables: { instructorId, date, offset },
          result: calendarField()
        }
      })
      .then(result => {
        dispatch(
          fetchInstructorCalendarSuccess(result.data.getInstructorCalendar)
        );
      })
      .catch(error => {
        console.error('error: ', error.errors.message);
      });
  };
}

export function getTrainerReviewsSuccess(trainerReviews) {
  return {
    type: types.FETCH_TRAINER_REVIEWS_SUCCESS,
    data: {
      ...trainerReviews
    }
  };
}

export function getTrainerReviewsFailure(data) {
  return {
    type: types.FETCH_TRAINER_REVIEWS_FAILURE,
    error: data.errors[0].message,
  };
}


export function getInstructorReviews(instructorId){
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });
  
  let query = `{
    getInstructorReview (
      instructorId: ${instructorId}
    ) 
    {
      comments,
      trainerQuality,
      firstName,
      lastName
    }
  }`;
  return (dispatch) => {
    client.request(query).then(() => { })
    .catch((res) => {
      if (res.response.status === 200) {
        const data = JSON.parse(res.response.error);
        if (data.data && data.data.getInstructorReview) {
          dispatch(getTrainerReviewsSuccess(data.data.getInstructorReview));
        } else {
          dispatch(getTrainerReviewsFailure(data));
        }
      }
    })
  }
}


export function addExpertise(trainerExpertise, experience,instructorId) {
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });
  return dispatch => {
      const mute = `mutation m { 
        addExpertise (
          areaOfExpertise:${ trainerExpertise },
          experience: ${ experience }
        )}`;

      client.request(mute).then(() => {
         }).catch(result => {
          
          if(result.response.status === 200){
            const data = JSON.parse(result.response.error);  
            if (data.data.addExpertise) {
              dispatch(getTrainerProfileDetail(instructorId));
            } else {
              dispatch(updateBioError(data));
            }
          } 
      })
    };
  
}

export function deleteExpertise(areaOfExpertise, instructorId) {

  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });

  return dispatch => {
      const mute = `mutation m { 
        deleteExpertise (
          areaOfExpertise:${areaOfExpertise}
        )}`;


      client.request(mute).then(() => {
          }).catch(result => {
          if (result.response.status === 200) {
            const data = JSON.parse(result.response.error);
            if (data.data) {
              dispatch(getTrainerProfileDetail(instructorId));
            } else if(data.errors) {
              dispatch(updateBioError(data));
            }
          }
      })
    };
  }


export function addSkill(areaOfExpertise, skill, instructorId) {
  
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });

  return dispatch => {
      const mute = `mutation m { 
        addSkill (
          areaOfExpertise:${parseInt(areaOfExpertise)},
          skill:"${skill}"
        )}`;


      client.request(mute).then(() => {
          }).catch(result => {
          if (result.response.status === 200) {
            const data = JSON.parse(result.response.error);
            
            if (data.data) {
              dispatch(getTrainerProfileDetail(instructorId));
            } else if(data.errors) {
              dispatch(updateBioError(data));
            }
          }
      })
  };
}

export function deleteSkill(areaOfExpertise, skill, instructorId) {

  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });

  return dispatch => {
      const mute = `mutation m { 
        deleteSkill (
          areaOfExpertise:${parseInt(areaOfExpertise)},
          skill:"${skill}",
        )}`;


      client.request(mute).then(() => {
          }).catch(result => {
          if (result.response.status === 200) {
            const data = JSON.parse(result.response.error);
            
            if (data.data) {
              dispatch(getTrainerProfileDetail(instructorId));
            } else if(data.errors) {
              dispatch(updateBioError(data));
            }
          }
      })
    };
  }


  export function addInstructorServices(serviceType, serviceName, instructorId) {
  
    const client = new GraphQLClient(BASE_URL, {
      headers: {
        Authorization: Cookies.get(COOKIE_TOKEN_KEY)
      }
    });
  
    return dispatch => {
        const mute = `mutation m { 
          addInstructorServices (
            services: {
              serviceType:${parseInt(serviceType)},
              serviceName:"${serviceName}"
            }
          )}`;
  
  
        client.request(mute).then(() => {
            }).catch(result => {
            if (result.response.status === 200) {
              const data = JSON.parse(result.response.error);
              
              if (data.data) {
                dispatch(getTrainerProfileDetail(instructorId));
              } else if(data.errors) {
                dispatch(updateBioError(data));
              }
            }
        })
    };
  }

  export function deleteInstructorServices(serviceName, instructorId) {
  
    const client = new GraphQLClient(BASE_URL, {
      headers: {
        Authorization: Cookies.get(COOKIE_TOKEN_KEY)
      }
    });
  
    return dispatch => {
        const mute = `mutation m { 
          deleteInstructorService (
            serviceName:"${serviceName}"
          )}`;
  
  
        client.request(mute).then(() => {
            }).catch(result => {
            if (result.response.status === 200) {
              const data = JSON.parse(result.response.error);
              
              if (data.data) {
                dispatch(getTrainerProfileDetail(instructorId));
              } else if(data.errors) {
                dispatch(updateBioError(data));
              }
            }
        })
    };
  }
  


