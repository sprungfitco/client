/* global document */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { login } from '../actions/LoginActions';
import { signUp, signUpType } from '../actions/SignUpActions';

const FIELDS = [
  { key: 'username', id: 'login.username', icon: 'ion-person', label: 'username', type: 'text', autoFocus: true, placeholder: 'Email Address'},
  { key: 'password', id: 'login.password', icon: 'ion-locked', label: 'password', type: 'password', showPassword: false, placeholder: 'Password'},
];

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

class LoginForm extends Component {
  constructor() {
    super();
    this.handleEnter = this.handleEnter.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = FIELDS.reduce((obj, field) => ({ ...obj, [field.key]: '', showPassword: false }), {});
  }

  componentDidMount() {
    document.addEventListener('keypress', this.handleEnter, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.handleEnter, false);
  }

  handleChange(key, e) {
    this.setState({
      [key]: e.currentTarget.value,
    });
  }

  handleEnter(e) {
    const shouldShowLoginButton = this.shouldShowLoginButton();
    if (e.keyCode === 13 && shouldShowLoginButton) {
      this.handleLogin(e);
    }
  }

  handleSignUp(role, e) {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(signUpType(role));
    dispatch(signUp());
  }

  handleLogin(e) {
    e.preventDefault();
    const { password, username } = this.state;
    const { dispatch } = this.props;
    dispatch(login(username, password));
  }

  shouldShowLoginButton() {
    return true;
  }

  render() {
    const { showPassword } = this.state;
    const shouldShowLoginButton = this.shouldShowLoginButton();
    const { user } = this.props;
    const { error } = user;
    return (
      <div className="login-form__fields">
        {FIELDS.map(field =>
         (<div className="login-form__input__wrap" key={field.key}>
           <input
             placeholder={field.placeholder}
             autoFocus={field.autoFocus}
             className="login-form__input"
             onChange={this.handleChange.bind(this, field.key)}
             type={field.type === 'password' && showPassword ? 'text' : field.type}
             value={this.state[field.key]}
             id={field.id}
           />
         </div>))}
        <div className="login-form__error">
          {error}
        </div>
        <div className="login-form__buttons">
          <a
            className="login-form__submit button button--block"
            onClick={this.handleSignUp.bind(this, 'user')}
            id="login.signup"
          >
            Sign Up
          </a>
          <a
            className="login-form__submit button button--company button--block"
            disabled={!shouldShowLoginButton ? 'disabled' : ''}
            onClick={this.handleLogin}
            id="login.button"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }
}

LoginForm.propTypes = propTypes;

export default LoginForm;
