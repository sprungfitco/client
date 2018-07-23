/* eslint-disable import/first */
/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';

import RootContainer from './containers/RootContainer';
import configureStore from './store/configureStore';
import { StripeProvider } from 'react-stripe-elements';

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
        <Provider store={configureStore()}>
          <Component />
        </Provider>
    </AppContainer>,
    document.getElementById('root'),
  );
};

render(RootContainer);
