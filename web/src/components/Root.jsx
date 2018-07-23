import Cookies from 'js-cookie';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as paths from '../constants/RouterConstants';
import LoginContainer from '../containers/LoginContainer';
import ValidateEmailContainer from '../containers/ValidateEmailContainer';
import SignUpForm from './SignUpForm.jsx';
import AdminDashboardContainer from '../containers/AdminDashboardContainer';
import ContentContainer from '../containers/ContentContainer';
import HeaderContainer from '../containers/HeaderContainer';
import { COOKIE_USER_INFO, COOKIE_TOKEN_KEY } from '../constants/UserConstants';

const propTypes = {
  router: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired
};

class Root extends Component {
  render() {
    const { username } = this.props.user;
    const token = Cookies.get(COOKIE_TOKEN_KEY);
    const userInfo = Cookies.get(COOKIE_USER_INFO);
    const { path } = this.props.router.route;
    let url = window.location.href;
    if (url.indexOf('teamUserSignup') !== -1) {
      return <ValidateEmailContainer />;
    }
    if (path === 'SIGN_UP') {
      return (
        <div>
          <SignUpForm {...this.props} />
        </div>
      );
    }
    if ((!userInfo && !token) || path === paths.LOGIN) {
      return (
        <div>
          <LoginContainer {...this.props} />
        </div>
      );
    }
    if (path === paths.SIGNED_UP) {
      return (
        <div>
          <ContentContainer {...this.props} />
        </div>
      );
    }
    if (path === paths.ADMIN_DEFAULT_PATH) {
      return (
        <div>
          <HeaderContainer />

          <AdminDashboardContainer {...this.props} />
        </div>
      );
    }
    return (
      <div>
        <ContentContainer {...this.props} />
      </div>
    );
  }
}

Root.propTypes = propTypes;

export default Root;
