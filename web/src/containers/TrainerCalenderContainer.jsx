import React from 'react';
import { connect } from 'react-redux';
import TrainerCalender from '../components/TrainerCalender';

const TrainerCalenderContainer = props => <TrainerCalender {...props} />;

const mapStateToProps = state => {
  const { 
      router,
      userProfileInfo,
      trainerCalender,
      instructorFreeSlots
     } = state;

  return {
    router,
    userProfileInfo,
    trainerCalender,
    instructorFreeSlots
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    TrainerCalenderContainer
);
