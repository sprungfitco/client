import React from 'react';
import { connect } from 'react-redux';
import JoinClass from '../components/JoinClass';

// This Container will eventually handle actions around header and menus.
const JoinClassContainer = props => (
  <JoinClass {...props} />
);

const mapStateToProps = (state) => {
  const { classes, router, userProfileInfo } = state;
  return {
    router,
    classes,
    userProfileInfo
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(JoinClassContainer);
