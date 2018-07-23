import React, { Component } from 'react';

import moment from 'moment';

class DateListItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { calDate, onUserSelected } = this.props;

    let styles = {
      active: {
        color: '#00D69D'
        // color: '#ffffff'
      },
      inactive: {
        color: ''
        // color: 'inherit'
      }
    };

    return (
      <div
        onClick={() => {
          onUserSelected(calDate);
        }}
        className="item"
      >
        <span
          className="dateitem__h6"
          style={this.props.active ? styles.active : styles.inactive}
        >
          {moment()
            .add(calDate, 'days')
            .format('dddd')}
        </span>

        <p
          className="dateitem__h4"
          style={this.props.active ? styles.active : styles.inactive}
        >
          {moment()
            .add(calDate, 'days')
            .format('D')}
        </p>
      </div>
    );
  }
}

export default DateListItem;
