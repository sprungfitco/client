import { combineReducers } from 'redux';
import router from './router';
import classes from './classes';
import user from './user';
import token from './token';
import userProfileInfo from './userProfileInfo';
import users from './users';
import categories from './categories';
import subCategories from './subCategories';
import services from './services';
import trainers from './trainers';
import trainerBio from './trainerBio';
import team from './team'
import trainerProfile from './trainerProfile';
import instructorCal from './instructorCal';
import trainerReviews from './trainerReviews';
import offeredClasses from './offeredClasses';
import trainerCalender from './trainerCalender';
import myOfferedClasses from './myOfferedClasses';
import instructorFreeSlots from './instructorFreeSlots';
import scheduledClasses from './scheduledClasses';
import classDetail from './classDetail';

const rootReducer = combineReducers({
  router,
  classes,
  token,
  user,
  userProfileInfo,
  users,
  categories,
  subCategories,
  services,
  trainers,
  trainerBio,
  trainerProfile,
  trainerReviews,
  instructorCal,
  team,
  trainerProfile ,
  offeredClasses,
  trainerCalender,
  myOfferedClasses,
  instructorFreeSlots,
  scheduledClasses,
  classDetail
});

export default rootReducer;
