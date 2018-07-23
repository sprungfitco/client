import React from 'react';
import { connect } from 'react-redux';
import ValidateEmail from '../components/ValidateEmail';


const ValidateEmailContainer = props => <ValidateEmail {...props} />;

const mapStateToProps = state => {
  const { router, userProfileInfo, trainerBio } = state;
  return {
    router,
    userProfileInfo,
    trainerBio
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(
    ValidateEmailContainer
);
