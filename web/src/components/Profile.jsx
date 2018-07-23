import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.css';
import ProfileForm from './ProfileForm';
import { getUserInfo } from '../actions/profileActions';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  userProfileInfo: PropTypes.object.isRequired
};

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userProfileInfo) {
      this.setState({
        isLoaded: true
      });
    }
  }

  render() {
    return (
      <div className="profile_container">
        {this.state.isLoaded ? <ProfileForm {...this.props} /> : ''}
      </div>
    );
  }
}

export default Profile;
