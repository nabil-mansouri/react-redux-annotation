import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as redux from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga';
import * as reducers from './reducers'
import { Sagas } from './saga'
import * as state from './state'
import { PureCounter } from './counter'

const sagaMiddleware = createSagaMiddleware()
const store: redux.Store<state.Countdown> = redux.createStore(
  reducers.cReducers, state.initialState, redux.applyMiddleware(sagaMiddleware)
)
sagaMiddleware.run(Sagas.playFlow);

const Root: React.SFC<{}> = () => (
  <Provider store={store}>
    <PureCounter />
  </Provider>
)

window.addEventListener('DOMContentLoaded', () => {
  const rootEl = document.getElementById('redux-app-root')
  ReactDOM.render(<Root />, rootEl)
})
