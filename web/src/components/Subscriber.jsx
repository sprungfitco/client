import React, { Component } from 'react';

import OTSubscriber from '../lib/opentok/OTSubscriber';

export default class Subscriber extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      audio: true,
      video: true
    };
  }

  setAudio = (audio) => {
    this.setState({ audio });
  }

  setVideo = (video) => {
    this.setState({ video });
  }

  onError = (err) => {
    this.setState({ error: `Failed to subscribe: ${err.message}` });
  }

  render() {
    return (
      <div className="stream__user">
        {this.state.error ? <div>{this.state.error}</div> : null}
        <OTSubscriber
          session={this.props.session}
          stream={this.props.stream}
          index={this.props.index}
          properties={{
            subscribeToAudio: this.state.audio,
            subscribeToVideo: this.state.video,
          }}
          style={{
            nameDisplayMode: "on",
          }}
          name={this.props.username}
          onError={this.onError}
        />
      </div>
    );
  }
}
