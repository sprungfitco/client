import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'react-sweet-progress';
import 'react-sweet-progress/lib/style.css';
import createSession from './createSession';
import { navigateTo } from '../../actions/RouterActions';
import { updateSessionId } from '../../actions/reviewActions';
import * as paths from '../../constants/RouterConstants';
import Publisher from '../../components/Publisher';

const formatDisplayTimeString = val => (val < 10 ? '0' + val : val);

export default class OTSession extends Component {
  constructor(props) {
    super(props);

    this.state = {
      streams: [],
      timeElapsed: 0,
      totalTime: 3600, // ToDO : remove hard coded duration and use session's duration property
      totalTimeInMins: 60,
      progress: 0,
      progressTimeDisplay: '',
      volumeOn: false,
      micOn: false,
      role: this.props.role,
      colorTheme: 'dark'
    };
    this.timer = this.timer.bind(this);
  }

  setSessionTheme = colorTheme => {
    this.setState({ colorTheme });
  };

  componentWillMount() {
    this.createSession();
  }

  componentDidMount() {
    let intervalId = setInterval(this.timer, 1000);
    this.setState({ intervalId: intervalId });
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.apiKey !== this.props.apiKey ||
      prevProps.sessionId !== this.props.sessionId ||
      prevProps.token !== this.props.token
    ) {
      this.createSession();
    }
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  timer() {
    const timeElapsedInSecs = this.state.timeElapsed + 1;
    if (timeElapsedInSecs < this.state.totalTime) {
      const timeElapsedInMins = Math.floor(timeElapsedInSecs / 60);
      this.setState({ timeElapsed: timeElapsedInSecs });
      this.setState({
        progress: timeElapsedInSecs * 100 / this.state.totalTime
      });
      this.setState({
        progressTimeDisplay:
          formatDisplayTimeString(timeElapsedInMins) +
          ':' +
          formatDisplayTimeString(timeElapsedInSecs % 60) +
          '/' +
          formatDisplayTimeString(this.state.totalTimeInMins) +
          ':' +
          '00'
      });
    } else {
      this.clearTimer();
    }
  }

  clearTimer() {
    clearInterval(this.state.intervalId);
    this.destroySession();
  }

  handleCloseClick() {
    this.clearTimer();
    const initialRoute = { path: paths.USER_REVIEW };
    const { dispatch, sessionId } = this.props;
    dispatch(navigateTo(initialRoute));
    dispatch(updateSessionId(sessionId));
  }

  handleVolumeClick() {
    const volumeState = !this.state.volumeOn;
    this.setState({ volumeOn: volumeState });
    const volumeLevel = volumeState ? 100 : 0;
    this.props.setAudio(volumeLevel);
  }

  handleMicClick() {
    this.setState({ micOn: !this.state.micOn });
  }

  createSession() {
    this.destroySession();
    this.sessionHelper = createSession({
      apiKey: this.props.apiKey,
      sessionId: this.props.sessionId,
      token: this.props.token,
      onStreamsUpdated: streams => {
        this.setState({ streams });
      },
      onConnect: this.props.onConnect,
      onError: this.props.onError
    });
    if (
      this.props.eventHandlers &&
      typeof this.props.eventHandlers === 'object'
    ) {
      this.sessionHelper.session.on(this.props.eventHandlers);
    }
    const { streams } = this.sessionHelper;

    this.setState({ streams });
  }

  destroySession() {
    if (this.sessionHelper) {
      if (
        this.props.eventHandlers &&
        typeof this.props.eventHandlers === 'object' &&
        this.sessionHelper.session
      ) {
        this.sessionHelper.session.off(this.props.eventHandlers);
      }
      this.sessionHelper.disconnect();
    }
  }

  render() {
    const childrenWithProps = Children.map(
      this.props.children,
      child =>
        child
          ? cloneElement(child, {
              session: this.sessionHelper.session,
              streams: this.state.streams
            })
          : child
    );
    return (
      <div className="session_wrapper">
        <div className="class_header_bar">
          <div
            className={
              'class_info' +
              (this.state.colorTheme === 'light'
                ? ' class_info_light '
                : ' class_info_dark ')
            }
          >
            <div className="class_name"> Sivananda Yoga</div>
            <div className="instructor_info">
              <img
                className="instructor_image"
                src="http://www.skywardimaging.com/wp-content/uploads/2015/11/default-user-image.png"
              />
              <div className="instructor_name">Jessica Williams</div>
            </div>
          </div>
          <div className="class_controls">
            <div
              className={
                this.state.role === 'User'
                  ? 'ion-person-add add_friend_window_button icon_color_dark'
                  : ''
              }
              onClick={this.props.openAddFriendWindow}
            />
            <img className="cast_button" src="/chromecast_symbol.png" />
            <div
              className={
                'ion-android-close close_window_button icon_color_dark'
              }
              onClick={this.handleCloseClick.bind(this)}
            />
          </div>
        </div>

        {childrenWithProps}

        <div className="bottom_bar">
          <div>
            <span
              className={
                'sound_control' +
                (this.state.volumeOn
                  ? ' ion-android-volume-up '
                  : ' ion-android-volume-off ') +
                (this.state.colorTheme === 'light'
                  ? ' icon_color_light '
                  : ' icon_color_dark ')
              }
              onClick={this.handleVolumeClick.bind(this)}
            />
            <span
              className={
                'sound_control' +
                (this.state.micOn
                  ? ' ion-android-microphone '
                  : ' ion-android-microphone-off ') +
                (this.state.colorTheme === 'light'
                  ? ' icon_color_light '
                  : ' icon_color_dark ')
              }
              onClick={this.handleMicClick.bind(this)}
            />
          </div>
          <div
            className={
              'timer_values' +
              (this.state.colorTheme === 'light'
                ? ' timer_values_color_light '
                : ' timer_values_color_dark ')
            }
          >
            {this.state.progressTimeDisplay}
          </div>
          <div className="progress_bar">
            <Progress
              percent={this.state.progress}
              status="active"
              theme={{
                active: {
                  symbol: 'đ',
                  color: '#68CBA2'
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

OTSession.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ]).isRequired,
  apiKey: PropTypes.string.isRequired,
  sessionId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  eventHandlers: PropTypes.objectOf(PropTypes.func),
  onConnect: PropTypes.func,
  onError: PropTypes.func
};

OTSession.defaultProps = {
  eventHandlers: null,
  onConnect: null,
  onError: null
};
