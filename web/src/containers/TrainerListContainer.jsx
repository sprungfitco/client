import React from 'react';
import { connect } from 'react-redux';
import TrainerList from '../components/TrainerList';

const TrainerListContainer = props => <TrainerList {...props} />;

const mapStateToProps = state => {
  const { router, trainers, categories, services } = state;
  return {
    router,
    trainers,
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
  TrainerListContainer
);
