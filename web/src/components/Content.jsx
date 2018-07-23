import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as paths from '../constants/RouterConstants';
import HeaderContainer from '../containers/HeaderContainer';
import JoinClassContainer from '../containers/JoinClassContainer';
import VideoContainer from '../containers/VideoContainer';
import ProfileContainer from '../containers/ProfileContainer';
import ReviewContainer from '../containers/ReviewContainer';
import PurchaseCreditContainer from '../containers/PurchaseCreditContainer';
import TrainerListContainer from '../containers/TrainerListContainer';
import TeamAdminContainer from '../containers/TeamAdminContainer';
import EditTrainerContainer from '../containers/EditTrainerContainer';
import TrainerProfileContainer from '../containers/TrainerProfileContainer';
import TrainerOfferedClassesContainer from '../containers/TrainerOfferedClassesContainer';
import TrainerScheduledClassesContainer from '../containers/TrainerScheduledClassesContainer';
import AllOfferedClassesContainer from '../containers/AllOfferedClassesContainer';
import TrainerCreateClassContainer from '../containers/TrainerCreateClassContainer';
import ClassDetailContainer from '../containers/ClassDetailContainer';
import TrainerCalenderContainer from '../containers/TrainerCalenderContainer';
import { getUserInfo } from '../actions/profileActions';


const propTypes = {
  router: PropTypes.shape({}).isRequired
};


class Content extends Component {
  renderContent() {
    const { router } = this.props;
    const { path } = router.route;

    switch (path) {
      case paths.HOME_PATH: {
        return <JoinClassContainer />;
      }
      case paths.VIDEO: {
        return <VideoContainer />;
      }
      case paths.PURCHASE_CREDITS_PATH: {
        return <PurchaseCreditContainer />;
      }
      case paths.USER_PROFILE: {
        return <ProfileContainer />;
      }
      case paths.TRAINER_LIST: {
        return <TrainerListContainer />;
      }
      case paths.TEAM_ADMIN: {
        return <TeamAdminContainer />;
      }
      case paths.EDIT_TRAINER: {
        return <EditTrainerContainer />;
      }
      case paths.TRAINER_PROFILE: {
        return <TrainerProfileContainer />;
      }
      case paths.TRAINER_OFFERED_CLASSES: {
        return <TrainerOfferedClassesContainer />;
      }
      case paths.TRAINER_SCHEDULED_CLASSES : {
        return <TrainerScheduledClassesContainer />
      }
      case paths.TRAINER_CREATE_CLASS: {
        return <TrainerCreateClassContainer />;
      }
      case paths.ALL_OFFERED_CLASSES: {
        return <AllOfferedClassesContainer />;
      }
      case paths.CLASS_DETAIL: {
        return <ClassDetailContainer />;
      }
      case paths.USER_REVIEW: {
        return <ReviewContainer />;
      }
      case paths.TRAINER_CALENDER : {
        return <TrainerCalenderContainer />;
      }
      default: {
        return <JoinClassContainer />;
      }
    }
  }

  render() {
    return (
      <div
        id="page-container"
        ref={div => {
          this.pageContainer = div;
        }}
      >
        <HeaderContainer />
        <main id="main-container">
          <div className="hx__content">{this.renderContent()}</div>
        </main>
      </div>
    );
  }
}

Content.propTypes = propTypes;

export default Content;
