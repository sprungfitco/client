import React, { Component } from 'react';
import Cookies from 'js-cookie';

import OTSession from '../lib/opentok/OTSession';
import OTStreams from '../lib/opentok/OTStreams';
import preloadScript from '../lib/opentok/preloadScript';

import Publisher from './Publisher';
import Subscriber from './Subscriber';
import { COOKIE_USER_INFO } from '../constants/UserConstants';

class Video extends Component {
  constructor(props) {
    super(props);
    this.publisher = React.createRef();
    this.otSession = React.createRef();
    this.otStreams = React.createRef();

    this.state = {
      error: null,
      connected: false
    };

    this.sessionEvents = {
      sessionConnected: () => {
        this.setState({ connected: true });
      },
      sessionDisconnected: () => {
        this.setState({ connected: false });
      }
    };
  }

  componentWillMount() {
    OT.registerScreenSharingExtension('chrome', 'baz', 2);
  }

  onError = (err) => {
    this.setState({ error: `Failed to connect: ${err.message}` });
  }

  setAudio = (audio) => { 
    this.publisher.current.setAudio(audio);
  }

  setSessionTheme = (theme) => { 
    this.otSession.current.setSessionTheme(theme);
  }

  openAddFriendWindow= () => {
    this.otStreams.current.showList();
  }

  adjustParticipantsLayout= (mode) => {
    const publisherContainer = document.getElementsByClassName('OTPublisherContainer');
    if(mode === 'multiple') {
      publisherContainer[0].classList.add('OT_publisher_multiple_participants');
    }
    if(mode === 'single') {
      publisherContainer[0].classList.add('OT_publisher_multiple_participants');
    }
    
  }

  render() {
    const userInfo = Cookies.get(COOKIE_USER_INFO).split(' ');
    const username = `${userInfo[0]} ${userInfo[1]}`;
    let role = userInfo[2] === "1" ? 'Instructor' : 'User';
    return (
      <OTSession
        apiKey={this.props.apiKey}
        sessionId={this.props.sessionId}
        token={this.props.token}
        eventHandlers={this.sessionEvents}
        onError={this.onError}
        dispatch={this.props.dispatch}
        role={role}
        setAudio={this.setAudio}
        openAddFriendWindow={this.openAddFriendWindow}
        ref={this.otSession}
      >
        {this.state.error ? <div>{this.state.error}</div> : null}
        <Publisher 
        username={`${username}`} 
        ref={this.publisher} 
        setSessionTheme={this.setSessionTheme}/>
        <OTStreams ref={this.otStreams} adjustParticipantsLayout={this.adjustParticipantsLayout}>
          <Subscriber username={`${username}`}/>
        </OTStreams>
      </OTSession>
    );
  }
}

export default preloadScript(Video);
