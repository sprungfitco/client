import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';

export default function OTStreams(props) {
  if (!props.session) {
    return <div />;
  }

  const child = Children.only(props.children);
  const test = [];
  if(!Array.isArray(props.streams)) return null;
  if( props.streams.length === 0) {
    return <div className="aladdin"></div>;
  }
  const instructor = props.streams.filter(stream => JSON.parse(stream.connection.data).role === 'instructor');
  if(instructor.length > 0) test.push(instructor[0]);
  const users = props.streams.filter(stream => JSON.parse(stream.connection.data).role !== 'instructor');
  if(users.length > 0) test.push(...users);

  let count = 0;
  const childrenWithProps = test.map(
    (stream, index) => (child ? cloneElement(
      child,
      {
        session: props.session,
        stream,
        key: stream.id,
        index: JSON.parse(stream.connection.data).role === 'instructor' ? count : count++,
        className: JSON.parse(stream.connection.data).role === 'instructor' ? 'sprung__instructor' : 'sprung__user',
      },
    ) : child),
  );
  return <div className="aladdin">{childrenWithProps}</div>;
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
