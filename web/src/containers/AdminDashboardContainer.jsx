import React from 'react';
import { connect } from 'react-redux';
import AdminDashboard from '../components/AdminDashboard';

const AdminDashboardContainer = props => (
  <AdminDashboard {...props} />
);

const mapStateToProps = (state) => {
  const { router, users } = state;
  return {
    router,
    users
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboardContainer);
