import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  getSessionId,
  getTokboxToken,
  fetchCreditCard
} from '../actions/LessonsActions';
import { getreviewPage, updateSessionId } from '../actions/reviewActions';
import { sessionCategories } from '../constants/ClassCategories';
import StripePayment from './StripePayment';
import 'bootstrap/dist/css/bootstrap.css';
import moment from 'moment';

const propTypes = {
  classes: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
};

const instructorImage =
  'data:image/png;base64,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';

class Classes extends Component {
  getSessionType(type) {
    switch (type) {
      case sessionCategories.Cardio:
      case sessionCategories.Hiit:
        return 'Cardio';
      case sessionCategories.Yoga:
      case sessionCategories.Hatha_Yoga:
      case sessionCategories.Kundalini_Yoga:
      case sessionCategories.Fast_Yoga:
        return 'Yoga';
      case sessionCategories.Meditation:
      case sessionCategories.Tm_Meditation:
        return 'Meditation';
      case sessionCategories.Dance:
      case sessionCategories.Zumba:
      case sessionCategories.Hip_Hop:
        return 'Dance';
      default:
        return 'Yoga';
    }
  }

  getRandomImage(catType) {
    switch (catType) {
      case sessionCategories.Cardio:
        return 'http://premierhealthandfitness.com.au/brookvale/wp-content/uploads/2017/02/premier_250x350_elipticalwithscreens.gif';
      case sessionCategories.Hip_Hop:
        return 'http://personaltraining-home.co.uk/wp-content/uploads/2012/10/Fitness-Training.jpg';
      case sessionCategories.Yoga:
        return 'http://egoistbody.com/wp-content/uploads/2014/01/IMG_2714-2-250x350.jpg';
      case sessionCategories.Hatha_Yoga:
        return 'http://durbanyogashala.co.za/wp-content/themes/dromedarydesign/images/ph_teacher04.jpg';
      case sessionCategories.Kundalini_Yoga:
      case sessionCategories.Fast_Yoga:
        return 'https://i.pinimg.com/736x/42/ee/02/42ee0297b7a689832ccdd8af654b7943--fitness-yoga-health-fitness.jpg';
      case sessionCategories.Meditation:
      case sessionCategories.Tm_Meditation:
        return 'http://egoistbody.com/wp-content/uploads/2015/12/nina1-250x350.jpg';
      case sessionCategories.Dance:
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpPp5ebvU5H18QCHQNXkJnVlCtCsculhNC0ubStDPD1hmxxtcC';
      case sessionCategories.Hip_Hop:
        return 'https://i.pinimg.com/originals/6f/d2/6d/6fd26d1a4cc352df94ac15fa1092c726.jpg';
      case sessionCategories.Zumba:
        return 'https://irp-cdn.multiscreensite.com/6cb9925c/dms3rep/multi/mobile/Fitness-%26-Practice-Wear-image-3.jpg';
      default:
        return 'http://egoistbody.com/wp-content/uploads/2014/01/IMG_2714-2-250x350.jpg';
    }
  }

  componentWillMount() {
    this.props.dispatch(fetchCreditCard());
  }
  // Need to pass the class ID to obtain a tokbox session token, this
  // function takes care of the flow, requesting the sessionId and then the
  // token to join the class
  handleClick(id) {
    const { classes, dispatch } = this.props;
    dispatch(getSessionId(id));
  }

  handleReview(id) {
    console.log('Inside handleReview');
    const { dispatch, router, classes } = this.props;
    dispatch(getreviewPage());
    dispatch(updateSessionId(id));
  }

  renderClasses(arr) {
    const { classes, userProfileInfo } = this.props;
    const classCards = arr.map(cls => {
    
      let sessionPrice = 0;
			if(cls.creditsPerMember > 0) {
				sessionPrice = parseFloat((cls.creditsPerMember / 100)).toFixed(2);
      }
      
      return (
        <div className="card" key={cls.id}>
          <div className="class-card-container">
            <div className="class-card-user-pic">
              <img src={this.getRandomImage(cls.catagory)} />
            </div>
            <div className="width-100-p margin-top-14px">
              <a
                href="#"
                className="float-left font-color-green"
                onClick={this.handleReview.bind(this, cls.id)}
              >
                {this.getSessionType(cls.catagory)}
              </a>{' '}
              <a
                href="#"
                className="float-right btn btn-default tag-green-line"
                role="button"
              >
                {cls.maxMembers > 10 ? 'Group' : 'Personalized'}
              </a>
            </div>
            <div className="width-100-p class-card-title margin-top-14px">
              {cls.title}
            </div>
            <div className="width-100-p">
              <div className="class-card-time float-left ">
                {moment.unix(cls.startTime).format('h:mm A')} . {' '}
                {cls.durationInMin} Minutes
              </div>
              <div>
                <a
                  href="#"
                  className="float-right btn btn-default tag-gray-line margin-top-M-5px"
                  role="button"
                >
                  Beginner
                </a>
              </div>
            </div>
            <div className="width-100-p class-card-description margin-top-14px">
              {cls.description}
            </div>
            <div className="width-100-p margin-top-14px">
              <a href="#">
                <div className="class-card-user-pic-small float-left" />
                <div className="float-left class-card-user-pic-name">
                  {cls.instructorName}
                </div>
              </a>
            </div>
            <div className="width-100-p margin-top-14px">
              {/* {cls.creditsPerMember > 0 ? (
                <a
                  href="#"
                  className="btn btn-default big-green-btn disabled"
                  role="button"
                  onClick={this.handleClick.bind(this, cls.id)}
                >
                  {`Join $${cls.creditsPerMember / 100}`}
                  <div className="float-right inside-free-tag"> Free Trial</div>
                </a>
              ) : (
                <a
                  href="#"
                  className="btn btn-default big-green-btn"
                  role="button"
                  onClick={this.handleClick.bind(this, cls.id)}
                >
                  {`Join`}
                  <div className="float-right inside-free-tag"> Free Trial</div>
                </a>
              )} */}
              <a
                href="#"
                className={
                  userProfileInfo.paymentInfo === null ||
                  userProfileInfo.paymentInfo === undefined
                    ? 'btn btn-default big-green-btn disabled'
                    : 'btn btn-default big-green-btn'
                }
                role="button"
                onClick={this.handleClick.bind(this, cls.id)}
              >
                {sessionPrice === 0? 'Join' : `Join $${sessionPrice}`}
                <div className = {sessionPrice === 0 ? "float-right inside-free-tag" : "hidden"}> 
                  Free Trial
                </div>
              </a>
              <div className="pay-with-card">
                {' '}
                {userProfileInfo.paymentInfo === null ||
                userProfileInfo.paymentInfo === undefined ? (
                  <StripePayment
                    dispatch={this.props.dispatch}
                    name={cls.title}
                    description={cls.description}
                    amount={cls.creditsPerMember}
                    sessionId={cls.id}
                  />
                ) : null}
              </div> 
            </div>
          </div>
        </div>
      );
    });

    return classCards;
  }

  render() {
    const { classes } = this.props;
    let yogaArr = [],
      exerciseArr = [],
      danceArr = [],
      mediArr = [];

    if (classes.length === 0) {
      return (
        <div className="card__noclass">
          <span> There are no classes to view </span>
        </div>
      );
    }

    // const { classes } = this.props;
    classes.forEach(arr => {
      if (this.getSessionType(arr.catagory) === 'Cardio') {
        exerciseArr.push(arr);
      } else if (this.getSessionType(arr.catagory) === 'Dance') {
        danceArr.push(arr);
      } else if (this.getSessionType(arr.catagory) === 'Meditation') {
        mediArr.push(arr);
      } else {
        yogaArr.push(arr);
      }
    });

    return (
      <div>
        {yogaArr.length ? (
          <div>
            <div className="card__h2">Yoga</div>
            <div className="card__container">{this.renderClasses(yogaArr)}</div>
          </div>
        ) : (
          ''
        )}

        {mediArr.length ? (
          <div>
            <div className="card__h2">Meditation</div>
            <div className="card__container">{this.renderClasses(mediArr)}</div>
          </div>
        ) : (
          ''
        )}

        {exerciseArr.length ? (
          <div>
            <div className="card__h2">Cardio</div>
            <div className="card__container">
              {this.renderClasses(exerciseArr)}
            </div>
          </div>
        ) : (
          ''
        )}

        {danceArr.length ? (
          <div>
            <div className="card__h2">Dance</div>
            <div className="card__container">
              {this.renderClasses(danceArr)}
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

Classes.propTypes = propTypes;

export default Classes;
