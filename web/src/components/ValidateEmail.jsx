import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import 'react-tagsinput/react-tagsinput.css';
import { classCategories } from '../constants/ClassCategories';
import { request, GraphQLClient } from 'graphql-request';
import { BASE_URL } from '../constants/ApiConstants';
import { COOKIE_TOKEN_KEY } from '../constants/UserConstants';
import LoginContainer from '../containers/LoginContainer';

const propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  class ValidateEmail extends Component{
    constructor(props) {
      super(props);
      this.state = {
        isEmailValid : false
      }
    }

    verifyEmail() {
      const client = new GraphQLClient(BASE_URL, {
        headers: {
          Authorization: Cookies.get(COOKIE_TOKEN_KEY)
        }
      });
      let url = window.location.href;
      let token = url.substr((url.indexOf('=') + 1),url.length);
      const mutation = `mutation m { 
        validateEmail (
          token:"${token}"
        )
      }`;
    
        client.request(mutation).then(() => { })
          .catch((res) => {
            if (res.response.status === 200) {
              const data = JSON.parse(res.response.error);
              console.log("checking data", data)
              this.setState({isEmailValid : data.data.validateEmail});
            }
          })
    }

    componentWillMount() {
      this.verifyEmail();
    }

    render() {
      if(this.state.isEmailValid) {
        return(
          <div>
            <LoginContainer {...this.props} />
          </div>
        );
      } else {
        return (
          <div> Email verification failed</div>
        );
      }
   
    }
  };



  export default ValidateEmail;