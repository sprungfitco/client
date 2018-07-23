import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DatePicker from 'react-date-picker';
import Classes from './Classes';
import { fetchLessons } from '../actions/LessonsActions';
import _ from 'lodash';
import DateListItem from './DateListItem';
import $ from 'jquery';

const propTypes = {
  classes: PropTypes.array.isRequired,
  userProfileInfo: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

class JoinClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      // isVisible: true,
      selectedDate: moment().format('DD-MMM-YY'),
      activeIndex: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.scroll = this.scroll.bind(this);
    this.todaySessions = this.todaySessions.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(
      fetchLessons(
        moment(this.state.date).format('YYYY-MM-DD'),
        this.state.date.getTimezoneOffset()
      )
    );
  }

  todaySessions() {
    const { dispatch } = this.props;
    const shownDate = moment().format('DD-MMM-YY');

    this.setState({ selectedDate: shownDate, activeIndex: 0 });

    dispatch(
      fetchLessons(
        moment(this.state.date).format('YYYY-MM-DD'),
        this.state.date.getTimezoneOffset()
      )
    );
  }

  scroll(direction) {
    //  this.setState({ isVisible: false });
    let far = $('.item__container').width() / 2 * direction;
    let pos = $('.item__container').scrollLeft() + far;
    $('.item__container').animate({ scrollLeft: pos }, 1000);
  }

  handleChange(dtInd) {
    const { dispatch } = this.props;
    const userSelectedDate = moment()
      .add(dtInd, 'days')
      .format('YYYY-MM-DD');

    const userSelectedYear = moment()
      .add(dtInd, 'days')
      .format('YYYY');
    const userSelectedMonth =
      moment()
        .add(dtInd, 'days')
        .format('MM') - 1; //the Date() constructor uses 0-indexed month so May is 4

    const userSelectedDay = moment()
      .add(dtInd, 'days')
      .format('DD');

    const shownDate = moment()
      .add(dtInd, 'days')
      .format('DD-MMM-YY');

    this.setState({
      selectedDate: shownDate,
      activeIndex: dtInd
    });

    dispatch(
      fetchLessons(
        userSelectedDate,
        new Date(
          userSelectedYear,
          userSelectedMonth,
          userSelectedDay
        ).getTimezoneOffset()
      )
    );
  }

  render() {
    let active = this.state.activeIndex;
    const { classes, dispatch, userProfileInfo } = this.props;
    const dateItems = _.times(15, dtIndex => (
      <DateListItem
        onUserSelected={dateIndex => this.handleChange(dateIndex)}
        key={dtIndex}
        calDate={dtIndex}
        active={dtIndex === active}
      />
    ));

    return (
      <div>
        <div>
          <span className="title__homepage">{this.state.selectedDate}</span>
          {/* {this.state.isVisible && (
            <button className="today__btn">Today</button>
          )} */}

          <button className="today__btn" onClick={this.todaySessions}>
            Today
          </button>

          <div className="wrapper">
            <button className="prev" onClick={this.scroll.bind(null, -1)}>
              &#10094;
            </button>
            <div className="item__container">{dateItems}</div>;
            {/* <DateList
              onDateClicked={dateIndex => this.handleChange(dateIndex)}
            /> */}
            <button className="next" onClick={this.scroll.bind(null, 1)}>
              &#10095;
            </button>
          </div>
        </div>

        <div>
          <Classes classes={classes} userProfileInfo={userProfileInfo} dispatch={dispatch} />
        </div>
      </div>
    );
  }
}

JoinClass.propTypes = propTypes;

export default JoinClass;
