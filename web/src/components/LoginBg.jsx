import React, { Component } from 'react';

const LoginBg = (props) => {
  return (
    <div className="login-bg">
      <nav className="header__login__content">
        <div className="header__logo">
          <img src="/sprung.png" width="40" height="40" />
          <span>Sprung</span>
        </div>

        <div className="header__menu">
          {/*Todo add menu options*/}
        </div>
      </nav>
      <div className="login-bg__shard__parent">
        <div className="login-bg__shard" />
      </div>
      <div className="login-bg__bottom-shard__parent">
        <div className="login-bg__bottom-shard" />
      </div>
      <div className="login-bg__dots" />
    </div>
  );
}

export default LoginBg;
