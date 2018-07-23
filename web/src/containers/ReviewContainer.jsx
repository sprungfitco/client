import React from 'react';
import { connect } from 'react-redux';
import Review from '../components/Review';

const ReviewContainer = props => <Review {...props} />;

const mapStateToProps = state => {
  const { user, router, token } = state;
  return {
    router,
    user,
    token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewContainer);
