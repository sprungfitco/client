import React from 'react';
import { connect } from 'react-redux';
import Profile from '../components/Profile';

const ProfileContainer = props => <Profile {...props} />;

const mapStateToProps = state => {
  const { router, userProfileInfo } = state;
  return {
    router,
    userProfileInfo
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer);
