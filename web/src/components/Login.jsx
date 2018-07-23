import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LoginBg from './LoginBg';
import LoginForm from './LoginForm';
import { signUp, signUpType } from '../actions/SignUpActions';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

class Login extends Component {
  constructor() {
    super();
    this.handleInstructorSignUp = this.handleInstructorSignUp.bind(this);
    this.state = {
      isValidEmailFlow : (window.location.href.indexOf('validateEmail') !== -1)
    }
  }

  handleInstructorSignUp(role, e) {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(signUpType(role));
    dispatch(signUp());
  }

  render() {
    const { dispatch, user } = this.props;
    const { error } = user;
    return (
      <div className="login">
        <LoginBg />
        <div className="login__content">
          <div className="login__product__name">
            Login
          </div>
            <div className="login__modal__wrap">
              <div className="login__card__wrap animate--fade-up">
                <div className="login__card">
                  <LoginForm dispatch={dispatch} {...this.props} /> 
                  {this.state.isValidEmailFlow ? <div className="email_validated ">Your email has been verified successfully</div> : '' }
                  
                  <div className='other_login_options'>
                    <div className='login-option'>
                      <div className='login_option_title'>Are you a trainer?</div>
                      <div className='login-links'>
                        <span className='login-pointer' onClick={this.handleInstructorSignUp.bind(this, 'instructor')}>
                          Sign up</span> or <span className='login-pointer'>Sign in here</span>
                      </div>
                    </div>
                    <div className='login-option'>
                      <div className='login_option_title'>Enterprise Account?</div>
                      <div className='login-links'>
                        <span className='login-pointer' onClick={this.handleInstructorSignUp.bind(this, 'team_admin')}>Sign up  </span>
                          or<span className='login-pointer'> Sign in here</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = propTypes;

export default Login;
