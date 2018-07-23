import React, { Component } from 'react';
import moment from 'moment';
import { sessionCategories } from '../constants/ClassCategories';

class TrainerDateItem extends Component {
  constructor(props) {
    super(props);
    this.showTrainerClasses = this.showTrainerClasses.bind(this);
  }

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

  showTrainerClasses(sessionForDay) {
    const { instructorCal } = this.props;
    console.log('showTrainerClasses called', instructorCal);
    console.log('showTrainerClasses called sessionForDay', sessionForDay);
    const trainerClassCard = sessionForDay.map(trainerClass => {
      console.log('trainerClass:_ ', trainerClass);
      const classTimings =
        moment.unix(trainerClass.startTime).format('ha') +
        '-' +
        moment.unix(trainerClass.endTime).format('ha');
      return (
        <div className="trainer__card" key={moment().unix()}>
          <div className="trainer__classtime">{classTimings}</div>
          <div className="trainer__classcategory">
            {this.getSessionType(trainerClass.catagory)}
          </div>
          <button className="trainer__reserve">Reserve</button>
        </div>
      );
    });
    return trainerClassCard;
  }

  render() {
    const { calDate, instructorCal, dispatch } = this.props;
    // debugger;
    if (instructorCal.length === 0) {
      return <div className="trainerclass__container">No Classes</div>;
    }

    const sessionForDay = instructorCal[0].filter(item => {
      return (
        moment()
          .add(calDate, 'days')
          .format('YYYY-MM-DD') ===
        moment.unix(item.startTime).format('YYYY-MM-DD')
      );
    });

    return (
      <div className="trainer__date__item">
        <span className="trainer__datetext">
          {moment()
            .add(calDate, 'days')
            .format('ddd')}{' '}
          {' '}
          {moment()
            .add(calDate, 'days')
            .format('M/D')}
        </span>
        {this.showTrainerClasses(sessionForDay)}
      </div>
    );
  }
}

export default TrainerDateItem;
