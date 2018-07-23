import React from 'react';
import { connect } from 'react-redux';
import TrainerScheduledClasses from '../components/TrainerScheduledClasses';

const TrainerScheduledClassesContainer = props => <TrainerScheduledClasses {...props} />;

const mapStateToProps = state => {
  const { 
      router,
      userProfileInfo,
      services,
      scheduledClasses
     } = state;

  return {
    router,
    userProfileInfo,
    services,
    scheduledClasses
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    TrainerScheduledClassesContainer
);
