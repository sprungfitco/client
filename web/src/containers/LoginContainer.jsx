import React, { Component } from 'react';
import { connect } from 'react-redux';
import Login from '../components/Login';

class LoginContainer extends Component {
  render() {
    return (
      <Login {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  const { about, user } = state;
  return {
    about,
    user,
  };
}

export default connect(mapStateToProps)(LoginContainer);
