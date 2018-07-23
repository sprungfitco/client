import React from 'react';
import { connect } from 'react-redux';
import CreateClass from '../components/CreateClass';

const TrainerCreateClassContainer = props => <CreateClass {...props} />;

const mapStateToProps = state => {
  const { 
      router, 
      userProfileInfo,
      categories,
      subCategories,
      services } = state;

  return {
    router,
    userProfileInfo,
    categories,
    subCategories,    
    services
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  TrainerCreateClassContainer
);
