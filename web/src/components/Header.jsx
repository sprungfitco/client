import React, { Component } from 'react';
import HeaderUser from './HeaderUser';
import PropTypes from 'prop-types';
import { getTokboxToken } from '../actions/LessonsActions';
import * as paths from '../constants/RouterConstants';
import { purchaseCredits } from '../actions/purchaseCreditActions';
import { showHome } from '../actions/showHomeActions';
import {
  showTrainers,
  showMyOfferedClasses,
  showAllOfferedClasses,
  showTrainerCalender,
  showMyScheduledClasses
} from '../actions/trainerRoutingActions';
import { showAdminPage } from '../actions/TeamAdminActions';
import { sprungAdminPage } from '../actions/sprungAdminActions';
import { COOKIE_USER_INFO } from '../constants/UserConstants';
import Cookies from 'js-cookie';
import {
  getTrainerProfile,
  getTrainerProfileDetail
} from '../actions/trainerProfileAction';
import { getUserInfo } from '../actions/profileActions';
//import { getreviewPage } from '../actions/reviewActions';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  userProfileInfo: PropTypes.object.isRequired
};
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userIsInstructor: false
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getUserInfo());
  }

  componentWillReceiveProps(nextProps) {}
  render() {
    const { router, userProfileInfo } = this.props;
    if (userProfileInfo) {
      const { path } = router.route;
      const userInfo = Cookies.get(COOKIE_USER_INFO).split(' ');
      const isAdmin = userInfo.last == 3 || userInfo.last == 4 ? true : false;

      const { firstName, lastName, id } = userProfileInfo;

      const headerClass = path === paths.VIDEO ? 'header__video' : '';
      const handleClick = () => {
        this.props.dispatch(getTokboxToken(24));
      };

      const showPurchasePage = () => {
        this.props.dispatch(purchaseCredits());
      };

      const showHomePage = () => {
        this.props.dispatch(showHome());
      };

      const showTrainerPage = () => {
        this.props.dispatch(showTrainers());
      };

      const showTrainerCalenderPage = () => {
        this.props.dispatch(showTrainerCalender())
      };

      const showTeamAdminPage = () => {
        this.props.dispatch(showAdminPage());
      };

      const showMyOfferedClassesPage = () => {
        this.props.dispatch(showMyOfferedClasses());
      };

      const showMyScheduledClassesPage = () => {
        this.props.dispatch(showMyScheduledClasses());
      };

      const showAllOfferedClassesPage = () => {
        this.props.dispatch(showAllOfferedClasses());
      };

      const editTrainerProfile = () => {
        this.props.dispatch(getTrainerProfile());
        this.props.dispatch(getTrainerProfileDetail(id));
      };

      // const showReviewPage = () => {
      //   this.props.dispatch(getreviewPage());
      // };

      return (
        <div>
          <nav className="header__content">
            <div className="header__logo">
              {path !== paths.VIDEO ? (
                <span>
                  <img src="../sprung.png" width="40" height="40" />
                  <span onClick={showHomePage}>Sprung</span>
                </span>
              ) : (
                ''
              )}
            </div>
            <div className="header__menu">
              {Cookies.get(COOKIE_USER_INFO).split(' ')[2] === '4' && (
                <div className="header__items" onClick={showSprungAdminPage}>
                  Sprung Admin
                </div>
              )}
              {(Cookies.get(COOKIE_USER_INFO).split(' ')[2] === '4' ||
                Cookies.get(COOKIE_USER_INFO).split(' ')[2] === '2') && (
                <div className="header__items" onClick={showTeamAdminPage}>
                  Members
                </div>
              )}
              {(Cookies.get(COOKIE_USER_INFO).split(' ')[2] === '4' ||
                Cookies.get(COOKIE_USER_INFO).split(' ')[2] === '2') && (
                <div className="header__items" onClick={showPurchasePage}>
                  Purchase Credits
                </div>
              )}
              {Cookies.get(COOKIE_USER_INFO).split(' ')[2] === '1' && (
                <div className="header__items" onClick={showTrainerCalenderPage}>
                  My Calender
                </div>
              )}
              {Cookies.get(COOKIE_USER_INFO).split(' ')[2] === '1' && (
                <div className="header__items" onClick={editTrainerProfile}>
                  My Page
                </div>
              )}
              {Cookies.get(COOKIE_USER_INFO).split(' ')[2] === '1' && (
                <div
                  className="header__items"
                  onClick={showMyScheduledClassesPage}
                >
                  My Scheduled Classes
                </div>
              )}
              {Cookies.get(COOKIE_USER_INFO).split(' ')[2] === '1' && (
                <div className="header__items" onClick={showMyOfferedClassesPage}>
                  My Offered Classes
                </div>
              )}
              <div
                className="header__items"
                onClick={showAllOfferedClassesPage}
              >
                All Offered Classes
              </div>
              <div className="header__items" onClick={showTrainerPage}>
                Teachers
              </div>
              {/* <div className="header__items" onClick={showReviewPage}>
                Reviews
              </div> */}

              <div>
                <HeaderUser
                  dispatch={this.props.dispatch}
                  user={this.props.user}
                  userProfileInfo={this.props.userProfileInfo}
                />
              </div>
            </div>
          </nav>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

export default Header;
