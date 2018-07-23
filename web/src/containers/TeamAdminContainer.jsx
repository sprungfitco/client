import React from 'react';
import { connect } from 'react-redux';
import TeamAdmin from '../components/TeamAdmin';

const TeamAdminContainer = props => <TeamAdmin {...props} />;

const mapStateToProps = state => {
  const { router, team, userProfileInfo } = state;
  return {
    router,
    team,
    userProfileInfo
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamAdminContainer);
