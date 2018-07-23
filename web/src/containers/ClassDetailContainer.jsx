import React from 'react';
import { connect } from 'react-redux';
import ClassDetail from '../components/ClassDetail';
import AdminDashboard from '../components/AdminDashboard';

const ClassDetailContainer = props => <ClassDetail {...props} />;

const mapStateToProps = state => {
  const { 
      router,
      classDetail,
      categories,
      instructorFreeSlots
     } = state;

  return {
    router,
    classDetail,
    categories,
    instructorFreeSlots
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  ClassDetailContainer
);
