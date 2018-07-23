import React, { Component } from 'react';
import OTPublisher from '../lib/opentok/OTPublisher';

export default class Publisher extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      audio: false,
      video: true,
      videoSource: 'camera'
    };
  }

  setAudio = (audio) => {
    this.setState({ audio });
  }

  setVideo = (video) => {
    this.setState({ video });
  }

  setVideoSource = (videoSource) => {
    this.setState({ videoSource });
  }

  setSessionTheme = (theme) => {
    this.props.setSessionTheme(theme);
  }

  onError = (err) => {
    this.setState({ error: `Failed to publish: ${err.message}` });
  }

  render() {
    return (
      <div className="logged-in_user">
        {this.state.error ? <div>{this.state.error}</div> : null}
        <OTPublisher
          session={this.props.session}
          properties={{
            publishAudio: this.state.audio,
            publishVideo: this.state.video,
            videoSource: this.state.videoSource === 'screen' ? 'screen' : undefined,
            width: 400,
            height: 300,
            trainer: 1,
            name: this.props.username
          }}
          role={this.props.role}
          style={{
            width: "50%",
            height: "50%",
            nameDisplayMode: "off",
          }}
          onError={this.onError}
          setSessionTheme={this.setSessionTheme}
        />
      </div>
    );
  }
}
