/* global hxMode */
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Popover from './Popover';
import { logout } from '../actions/LoginActions';
import { profilePage, getUserInfo } from '../actions/profileActions';
import { COOKIE_USER_INFO } from '../constants/UserConstants';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  userProfileInfo: PropTypes.object.isRequired
};

let instructorImage =
  'http://www.skywardimaging.com/wp-content/uploads/2015/11/default-user-image.png';
class HeaderUser extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
    this.userProfile = this.userProfile.bind(this);
  }

  handleLogout(e) {
    e.preventDefault();
    const { dispatch, user } = this.props;
    dispatch(logout(user.username));
  }

  renderUserIcon() {
    // return <i className="ion-ios-person-outline text-white" />;

    return <img style={{ 'borderRadius': '50%'}} src={instructorImage} width="30" height="30" />;
  }

  renderLogout() {
    return (
      <li
        className="cursor-pointer remove-margin-r header-user__list__item"
        id="user.logout.button"
        onClick={this.handleLogout}
      >
        Logout
      </li>
    );
  }

  userProfile() {
    const { dispatch, router } = this.props;
    dispatch(profilePage());
    dispatch(getUserInfo());
  }

  render() {
    const { dispatch, user, userProfileInfo } = this.props;
    const { username } = user || '';
    const { scope } = user || {};
    const userInfo = Cookies.get(COOKIE_USER_INFO).split(' ');
    const { firstName, lastName, profilePic } = userProfileInfo
    if(profilePic){
      instructorImage = profilePic
    }
    return (
      <Popover className="header-user" right>
        <div
          className="cursor-pointer header-user__info"
          id="user.details.dropdown"
        >
          {this.renderUserIcon()}
          <i className="header-arrow ion-ios-arrow-down margin-top-5 text-white" />
          <i className="header-arrow ion-ios-arrow-up margin-top-5 text-white" />
        </div>
        <div className="header-user__list">
          <ul className="nav-header nav-header_config pull-left">
            {this.renderLogout()}
            <li className="hx__user-info remove-margin-r">
              <div className="text-muted" onClick={this.userProfile}>
                {firstName} {lastName}

              </div>
            </li>
          </ul>
        </div>
      </Popover>
    );
  }
}

HeaderUser.propTypes = propTypes;

export default HeaderUser;
