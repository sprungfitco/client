import React from 'react';
import { connect } from 'react-redux';
import TrainerOfferedClasses from '../components/TrainerOfferedClasses';

const TrainerOfferedClassesContainer = props => <TrainerOfferedClasses {...props} />;

const mapStateToProps = state => {
  const { 
      router,
      myOfferedClasses,
      userProfileInfo,
      categories,
      services
     } = state;

  return {
    router,
    myOfferedClasses,
    userProfileInfo,
    categories,
    services
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    TrainerOfferedClassesContainer
);
