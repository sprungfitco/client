import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import PostClass from './PostClass';
import SplitPane from 'react-split-pane';
import Trainers from './Trainers';
import HeaderContainer from '../containers/HeaderContainer';
import { getUsersWithType } from '../actions/UsersActions';
const propTypes = {
  dispatch: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired
};

class AdminDashboard extends Component {
  constructor(props) {
    super(props);
  }

  openSubView(selectedView) {
    ReactDOM.render(
      this.getContent(selectedView),
      document.getElementById('sub_content_panel')
    );
  }

  getContent(selectedView) {
    switch (selectedView) {
      case 'CLASS': {
        return (
          <PostClass dispatch={this.props.dispatch} users={this.props.users} />
        );
      }
      case 'TRAINERS': {
        return (
          <Trainers dispatch={this.props.dispatch} users={this.props.users} />
        );
      }

      default: {
        return <div>Home page</div>;
      }
    }
  }

  componentWillMount() {
    const { dispatch } = this.props;
    var trainers = dispatch(getUsersWithType(1));
    console.log(trainers);
  }

  render() {
    return (
      <div className="admin_dashboard_custom">
        <SplitPane
          style={{ overflow: 'auto !important' }}
          split="vertical"
          minSize={100}
          defaultSize={300}
        >
          <div className="left_nav_bar">
            <div
              className="left_nav_bar_item"
              onClick={this.openSubView.bind(this, 'CLASS')}
            >
              <span className="ion-android-bicycle" />
              <span>Classes</span>
            </div>
            <div
              className="left_nav_bar_item"
              onClick={this.openSubView.bind(this, 'TRAINERS')}
            >
              <span className="ion-person" />
              <span>Trainers</span>
            </div>
          </div>
          <div id="sub_content_panel">Welcome to admin dashboard page !</div>
        </SplitPane>
      </div>
    );
  }
}

AdminDashboard.propTypes = propTypes;

export default AdminDashboard;
