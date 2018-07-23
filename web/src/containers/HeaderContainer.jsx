import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';
import {getUserInfo} from '../actions/profileActions';
// This Container will eventually handle actions around header and menus.
const HeaderContainer = props => (
  <Header {...props} />
);

const mapStateToProps = (state) => {
  const { router, user, userProfileInfo } = state;
  return {
    router,
    user,
    userProfileInfo
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
