import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.css';

this.timer = null;

export default class OTStreams extends Component {
  constructor(props) {
    super(props);

    this.state = {
      incomingStreams: [],
      instructorStream: [],
      streams: [],
      streamIndex: 0,
      showList: false,
      role:'instructor',
    };
    this.interval = null;
    this.tick = this.tick;
    this.count = props.streams.length;
    this.showList = this.showList.bind(this);
    this.setStream = this.setStream.bind(this);
    this.clearStream = this.clearStream.bind(this);
    this.updateRole = this.updateRole.bind(this);
    this.updateInstructor = this.updateInstructor.bind(this);
    this.updateUsers = this.updateUsers.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(this.tick.bind(this), 5000);
  }

  componentWillReceiveProps() {
    this.tick();
  }

  componentWillUnmount() {
    this.timer = null;
    clearInterval(this.interval);
  }

  updateRole(){
    if(this.props.session.connection !== null && JSON.parse(this.props.session.connection.data).role === "user") {
      this.setState({
        role: 'user',
      });
    }
  }

  updateInstructor(){
    const instructor =  this.props.streams.filter(stream => JSON.parse(stream.connection.data).role === 'instructor');
    if (instructor.length > 0) {
      this.setState({
        instructorStream: [instructor[0]]
      })
    }
  }

  updateUsers(){
    const incomingStreams = [];
    const users = this.props.streams.filter(stream => JSON.parse(stream.connection.data).role !== 'instructor');
    let streams = [];
    users.forEach((user) => {
      incomingStreams.push(user.name);
    });
    if (users.length > 0) {
      if (this.state.role === 'instructor') {
        streams.push(...users);
        this.setState({
          streams: streams,
        })
      } 
    }
    this.setState({
      incomingStreams: incomingStreams,
    });
  }

  // Used to update the current user's role, incoming streams of other users, and the stream of the instructor
  tick() {
    this.updateRole();
    this.updateInstructor();
    this.updateUsers();
  }

  
  showList(e) {
    this.setState({
      showList: true,
    })
  }

  setStream(e) {
    const stream = this.props.streams.filter(streams => streams.name === e.target.innerText)
    const current = [];
    current.push(stream[0])
    this.setState({
      showList: false,
      streams: current,
    });

    this.props.adjustParticipantsLayout('multiple');
  }

  clearStream(e) {
    this.setState({
      showList: false,
      streams:[],
    })
    this.props.adjustParticipantsLayout('single');
  }

  render() {
    let clearStream = <div className='clear_stream' onClick={this.clearStream}>X</div>
    if(this.state.role === 'instructor') {
      clearStream = <span></span>
    }
    if (!this.props.session) {
      return <div />;
    }
    const child = Children.only(this.props.children);
    if (!Array.isArray(this.state.streams)) return null;
    const instructor = this.state.instructorStream.map((stream, index) => (child ? cloneElement(
      child,
      {
        session: this.props.session,
        stream,
        key: index,
        index: count,
        className: 'sprung__instructor',
      },
    ) : child))
    if (this.state.showList && this.state.role === 'user') {
      return (
        <div className='aladdin'>
          {instructor}
          <div className='friends_list'>
            <div>
                <span className='friends_list_header'>Add a friend</span>
                <span className="friends_list_header_desc">Add and pin your friends video to the session</span>
            </div>
            <input className='friends_list_search' type="search" placeholder="Search..." autoComplete="on"/>
            {this.state.incomingStreams.map((stream, index) => {
                return (
                <div key={index} className='friend'>
                  <img className='friend_image'src='http://www.skywardimaging.com/wp-content/uploads/2015/11/default-user-image.png'/>
                  <div className='friend_name' onClick={this.setStream}> {stream}</div>
                </div>)
            })}
            {clearStream}
          </div>
        </div>
      )
    }

    if (this.state.streams.length === 0 && this.state.role === 'user') {
      return (
        <div className='aladdin'>
            {instructor}
        </div>);
    }
    let count = 0;
    const otherUsers = this.state.streams.map(
      (stream, index) => (child ? cloneElement(
        child,
        {
          session: this.props.session,
          stream,
          key: index,
          index: JSON.parse(stream.connection.data).role === 'instructor' ? count : count++,
          className: JSON.parse(stream.connection.data).role === 'instructor' ? 'sprung__instructor' : 'sprung__user',
        },
      ) : child));
    return (
      <div className='aladdin'>
        {clearStream}
        {instructor}
        {otherUsers}
      </div>);
  }
}

OTStreams.propTypes = {
  children: PropTypes.element.isRequired,
  session: PropTypes.shape({
    publish: PropTypes.func,
    subscribe: PropTypes.func,
  }),
  streams: PropTypes.arrayOf(PropTypes.object),
};

OTStreams.defaultProps = {
  session: null,
  streams: [],
};
