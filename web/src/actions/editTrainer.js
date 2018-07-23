import * as paths from '../constants/RouterConstants';
import { navigateTo } from '../actions/RouterActions';
import * as types from '../constants/ActionTypes';
import Cookies from 'js-cookie';
import 'isomorphic-fetch';
import {notify} from 'react-notify-toast';
import { request, GraphQLClient } from 'graphql-request';
import { BASE_URL } from '../constants/ApiConstants';
import { COOKIE_TOKEN_KEY } from '../constants/UserConstants';


export function editTrainer() {
  return dispatch => {
    const initialRoute = { path: paths.EDIT_TRAINER };
    dispatch(navigateTo(initialRoute));
  };
}


export function fetchTrainerInfoSuccess(trainerInfo) {
  return {
    type: types.FETCH_TRAINER_BIO_SUCCESS,
    data: {
      ...trainerInfo
    }
  };
}

export function fetchTrainerInfoFailure(data) {
  return {
    type: types.FETCH_TRAINER_BIO_FAILURE,
    error: data.errors[0].message,
  };
}

export function getTrainerInfo(id){
  
  let query = `{
    getInstructorProfile(
      instructorId: ${id}
    ) {
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
   fetch(BASE_URL, {
      method: 'POST',
      headers: { Authorization: Cookies.get(COOKIE_TOKEN_KEY) },
      body: JSON.stringify({ query })
    })
    .then(res => res.json())
    .then(res => {
      if(res && res.errors && res.errors.length){
        return dispatch(fetchTrainerInfoFailure(res))
      } else {
        dispatch(fetchTrainerInfoSuccess(res.data.getInstructorProfile));
      }
    });
  }
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
    let { description, favoriteThings } = trainerInfo;
    if(!favoriteThings){
      favoriteThings = ' '
    }
    if(!description){
      description = ' '
    }

    const mute = `mutation updateInstructorProfile{
      updateInstructorProfile(
        description:"${description}",
        favoriteThings: "${favoriteThings}"
      )}`;

      client.request(mute).then(() => { })
      .catch((res) => {
        if (res.response.status === 200) {
          const data = JSON.parse(res.response.error);
          if (data.data && data.data.updateInstructorProfile) {
            notify.show("Updated Successfully", "success", 5000);
            dispatch(getTrainerInfo(id));
            // dispatch(updateBioSucess(data.data.updateInstructorProfile));
          } else {
            notify.show("Error! Please try after some time!", "error", 5000);
            dispatch(updateBioError(data));
          }
        }
      })
  }
}


export function addExpertise(trainerExpertise, instructorId) {
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });
  return new Promise((resolve, reject) => {
  dispatch => {
      const mute = `mutation m { 
        addExpertise (
          areasOfExpertise:${ trainerExpertise }
        )}`;

      client.request(mute).then(() => {
          return resolve(true);
        }).catch(result => {
          
          if(result.response.status === 200){
            const data = JSON.parse(result.response.error);  
            if (data.addExpertise) {
              return resolve(true);
            } else {
              notify.show(data.errors[0].message, "error", 5000);
              return reject(false);
            }
          } 
      })
    };
  })
}

export function deleteExpertise(areasOfExpertise, instructorId) {

  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });

  return dispatch => {
      const mute = `mutation m { 
        deleteExpertise (
          areaOfExpertise:${areasOfExpertise}
        )}`;


      client.request(mute).then(() => {
          }).catch(result => {
          if (result.response.status === 200) {
            const data = JSON.parse(result.response.error);
            if (data.data) {
              notify.show("Expertise was removed from your profile successfully", "success", 5000);
              dispatch(getTrainerInfo(instructorId));
            } else if(data.errors) {
              notify.show(data.errors[0].message, "error", 5000);
              dispatch(updateBioError(data));
            }
          }
      })
    };
  }


export function addSkill(skillSet, instructorId) {
  
  const client = new GraphQLClient(BASE_URL, {
    headers: {
      Authorization: Cookies.get(COOKIE_TOKEN_KEY)
    }
  });

  return dispatch => {
      const mute = `mutation m { 
        addSkill (
          areaOfExpertise:${parseInt(skillSet.areaOfExpertise)},
          skill:"${skillSet.skill}",
          skillLevel:${parseInt(skillSet.skillLevel.key)}
        )}`;


      client.request(mute).then(() => {
          }).catch(result => {
          if (result.response.status === 200) {
            const data = JSON.parse(result.response.error);
            
            if (data.data) {
              notify.show("Expertise added successfully", "success", 5000);
              dispatch(getTrainerInfo(instructorId));
            } else if(data.errors) {
              notify.show(data.errors[0].message, "error", 5000);
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
              notify.show("Expertise was removed from your profile successfully", "success", 5000);
              dispatch(getTrainerInfo(instructorId));
            } else if(data.errors) {
              notify.show(data.errors[0].message, "error", 5000);
              dispatch(updateBioError(data));
            }
          }
      })
    };
  }

  
