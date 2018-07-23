import React from 'react';
import { connect } from 'react-redux';
import EditTrainer from '../components/EditTrainer';

const EditTrainerContainer = props => <EditTrainer {...props} />;

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
  EditTrainerContainer
);
