import React from 'react';
import { connect } from 'react-redux';
import Content from '../components/Content';

// This container will handle the actual content of the site.
const ContentContainer = props => (
  <Content {...props} />
);

const mapStateToProps = (state) => {
  const { router } = state;
  return {
    router,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentContainer);
