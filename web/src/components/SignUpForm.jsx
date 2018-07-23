import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { createAccount, returnLogin } from '../actions/SignUpActions.js';

const FIELDS = [
  { key: 'email', id: 'signUp.emailAddress', label: '', type: 'text', placeholder: 'Email Address' },
  { key: 'password', id: 'signUp.password', label: 'password', type: 'password', showPassword: false, placeholder: 'Password'},
  { key: 'firstName', id: 'signUp.firstName', label: 'firstName', type: 'text', placeholder: 'First Name'},
  { key: 'lastName', id: 'signUp.lastName', label: '', type: 'text', placeholder: 'Last Name'},
  { key: 'mobileNo', id: 'signUp.mobileNumber', label: '', type: 'text', placeholder: '9 Digit Mobile Number'},
];

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      mobileNo: '',
      typeOfUser: this.props.user.userType,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReturn = this.handleReturn.bind(this);
  }

  handleChange(key, e) {
    this.setState({
      [key]: e.currentTarget.value,
    });
  }

  handleReturn() {
    const { dispatch } = this.props;
    dispatch(returnLogin());
  }

  // Sends a create account request to GraphQL when the create account button is clicked on
  handleSubmit(e) {
    const {
      password, firstName, lastName, email, mobileNo, typeOfUser,
    } = this.state;
    const { dispatch } = this.props;
    const username = email;
    dispatch(createAccount(username, password, firstName, lastName, mobileNo, typeOfUser));
  }
  render() {
    const { user } = this.props;
    const { error } = user;
    return (
      <div>
        <nav className="header__content">
          <div className="header__logo">
            <img src="/sprung.png" width="40" height="40" />
            <span>Sprung</span>
          </div>

          <div className="header__menu">
            {/*Todo add menu options*/}
          </div>
        </nav>
        <div className="signup_container">

          <div className="signup_form">
            <div className="signup_title">
              Account Information
            </div>
            <form className="signup_form">
              {FIELDS.map(field =>
                (<div className="signup-form__input__wrap" key={field.key}>
                  <input
                    placeholder={field.placeholder}
                    className="login-form__input"
                    onChange={this.handleChange.bind(this, field.key)}
                    type={field.type}
                    value={this.state[field.key]}
                    id={field.id}
                  />
                </div>),
              )}
            </form>
            <div className="signup_form_error">
              {error}
            </div>
            <div className="button_wrapper">
              <a
                className="login-form__submit button button--block"
                onClick={this.handleReturn}
                id="return_login_button"
              >
                Return To Login
              </a>
              <a
                className="login-form__submit button button--company button--block"
                id="signup_button"
                onClick={this.handleSubmit}
              >
                Create Account
              </a>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

SignUpForm.propTypes = propTypes;

export default SignUpForm;
