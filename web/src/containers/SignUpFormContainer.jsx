import React, { Component } from 'react';
import { connect } from 'react-redux';
import SignUpForm from '../components/SignUpForm';

class SignUpFormContainer extends Component {
  render() {
    return (
      <SignUpForm {...this.props} />
    );
  }
}

const mapStateToProps = (state) => {
  const { userType, signUpError } = state;
  return {
    userType,
    signUpError,
  };
};

export default connect(mapStateToProps)(SignUpFormContainer);
