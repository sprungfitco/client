import React from 'react';
import { connect } from 'react-redux';
import TrainerProfile from '../components/TrainerProfile';

const TrainerProfileContainer = props => <TrainerProfile {...props} />;

const mapStateToProps = state => {
  const { 
      router, 
      userProfileInfo, 
      trainerProfile, 
      trainerReviews, 
      instructorCal,
      categories,
      subCategories,
      services } = state;

  return {
    router,
    userProfileInfo,
    trainerProfile,
    trainerReviews,
    categories,
    subCategories,    
    services,
    instructorCal
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  TrainerProfileContainer
);
