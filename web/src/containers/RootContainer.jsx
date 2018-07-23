import React from 'react';
import { connect } from 'react-redux';
import Root from '../components/Root';

const RootContainer = props => (
  <Root {...props} />
);

const mapStateToProps = (state) => {
  const { router, user } = state;
  return {
    router,
    user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer);
