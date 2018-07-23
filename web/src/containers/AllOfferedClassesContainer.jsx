import React from 'react';
import { connect } from 'react-redux';
import AllOfferedClasses from '../components/AllOfferedClasses';

const AllOfferedClassesContainer = props => <AllOfferedClasses {...props} />;

const mapStateToProps = state => {
  const { 
      router,
      categories,
      services,
      offeredClasses,
      instructorFreeSlots,
     } = state;

  return {
    router,
    categories,
    services,
    offeredClasses,
    instructorFreeSlots
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    AllOfferedClassesContainer
);
