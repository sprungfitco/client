import React, { Component } from 'react';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { COOKIE_USER_INFO } from '../../constants/UserConstants';

export default class OTSubscriber extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subscriber: null,
    };
  }

  componentDidMount() {
    this.createSubscriber();
  }

  componentDidUpdate(prevProps) {
    const cast = (value, Type, defaultValue) => (value === undefined ? defaultValue : Type(value));

    const updateSubscriberProperty = (key) => {
      const previous = cast(prevProps.properties[key], Boolean, true);
      const current = cast(this.props.properties[key], Boolean, true);
      if (previous !== current) {
        this.state.subscriber[key](current);
      }
    };

    updateSubscriberProperty('subscribeToAudio');
    updateSubscriberProperty('subscribeToVideo');

    if (this.props.session !== prevProps.session || this.props.stream !== prevProps.stream) {
      this.destroySubscriber(prevProps.session);
      this.createSubscriber();
    }
  //   const ele = document.getElementsByClassName('sprung__instructor-user');
  //   if(ele[1]) {
  //     ele[1].classList.add("sprung__instructor-user-1");
  //   }
  //   if(ele[2]) {
  //     ele[2].classList.add("sprung__instructor-user-2")
  //   }
  }

  componentWillUnmount() {
    this.destroySubscriber();
  }

  getSubscriber() {
    return this.state.subscriber;
  }

  createSubscriber() {
    if (!this.props.session || !this.props.stream) {
      this.setState({ subscriber: null });
      return;
    }
    const container = document.createElement('div');
    let cls = '';


    cls = JSON.parse(this.props.stream.connection.data).role === 'instructor' ? 'sprung__instructor' : 'sprung__user';
    if (cls === 'sprung__user') {
      // container.style.top = `${50}%`;
      // container.style.left = `${50}%`;
    }
    if (JSON.parse(this.props.session.connection.data).role === 'instructor' && this.props.index === 0) {
        cls += ' sprung__user-0';
    } else if (JSON.parse(this.props.session.connection.data).role === 'instructor' && this.props.index > 0) {
      cls += ' sprung__user-1'
    }

    container.setAttribute('class', `OTSubscriberContainer ${cls}`);

    this.node.appendChild(container);

    this.subscriberId = uuid();
    const { subscriberId } = this;

    const subscriber = this.props.session.subscribe(
      this.props.stream,
      container,
      this.props.properties,
      (err) => {
        if (subscriberId !== this.subscriberId) {
          // Either this subscriber has been recreated or the
          // component unmounted so don't invoke any callbacks
          return;
        }
        if (err && typeof this.props.onError === 'function') {
          this.props.onError(err);
        } else if (!err && typeof this.props.onSubscribe === 'function') {
          this.props.onSubscribe();
        }
      },
    );

    if (
      this.props.eventHandlers &&
      typeof this.props.eventHandlers === 'object'
    ) {
      subscriber.on(this.props.eventHandlers);
    }

    this.setState({ subscriber });
  }

  destroySubscriber(session = this.props.session) {
    delete this.subscriberId;

    if (this.state.subscriber) {
      if (
        this.props.eventHandlers &&
        typeof this.props.eventHandlers === 'object'
      ) {
        this.state.subscriber.once('destroyed', () => {
          this.state.subscriber.off(this.props.eventHandlers);
        });
      }

      if (session) {
        session.unsubscribe(this.state.subscriber);
      }
    }
  }

  render() {
    return <div ref={node => (this.node = node)} />;
  }
}

OTSubscriber.propTypes = {
  stream: PropTypes.shape({
    streamId: PropTypes.string,
    connection: PropTypes.object,
  }),
  session: PropTypes.shape({
    subscribe: PropTypes.func,
    unsubscribe: PropTypes.func,
  }),
  properties: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  eventHandlers: PropTypes.objectOf(PropTypes.func),
  onSubscribe: PropTypes.func,
  onError: PropTypes.func,
};

OTSubscriber.defaultProps = {
  stream: null,
  session: null,
  properties: {},
  eventHandlers: null,
  onSubscribe: null,
  onError: null,
};
