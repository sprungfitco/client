import React from 'react';
import { connect } from 'react-redux';
import Video from '../components/Video';

// const apiKey = '46094132';
// const sessionId =
// '1_MX40NjA5NDEzMn5-MTUyMzQ1NDgzNjczOX5vK3BUU0g4ZGlDQjkxVUFpamVOenhPWFR-fg';
// const token =
// 'T1==cGFydG5lcl9pZD00NjA5NDEzMiZzaWc9ZmI3YzE3Mjg2ZmM0OTI1OWYxMzVhOTI5NjkzY2JiNGFhNGNmNGE0NDpzZXNzaW9uX2lkPTFfTVg0ME5qQTVOREV6TW41LU1UVXlNelExTkRnek5qY3pPWDV2SzNCVVUwZzRaR2xEUWpreFZVRnBhbVZPZW5oUFdGUi1mZyZjcmVhdGVfdGltZT0xNTIzNDU0ODM2JmV4cGlyZV90aW1lPTE1MjM0NTU0MzYmcm9sZT1wdWJsaXNoZXImY29ubmVjdGlvbl9kYXRhPSU3QiUyMnJvbGUlMjIlM0ElMjJpbnN0cnVjdG9yJTIyJTdEJm5vbmNlPTM0NTE5Mg==';
const VideoContainer = (props) => (
  <div className="video_content">
    <Video
      apiKey={props.token.apiKey}
      sessionId={props.token.sessionId}
      token={props.token.token}
      loadingDelegate={<div>Loading...</div>}
      user={props.user}
      dispatch={props.dispatch}
      opentokClientUrl="https://static.opentok.com/v2/js/opentok.min.js"
    />
  </div>
);

const mapStateToProps = (state) => {
  const { router, token, user } = state;
  return {
    router,
    token,
    user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoContainer);
