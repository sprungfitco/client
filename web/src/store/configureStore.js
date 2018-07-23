import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/index';

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);
const enhancers = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
);
export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState, enhancers);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(rootReducer);
    });
  }

  return store;
}
