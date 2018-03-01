import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as redux from 'redux'
import { Provider } from 'react-redux'
import * as reducers from './reducers'
import * as state from './state'
import { PureCounter } from './counter'

const store: redux.Store<state.Counter> = redux.createStore(
  reducers.cReducers,
  state.initialState
)

const Root: React.SFC<{}> = () => (
  <Provider store={store}>
    <PureCounter />
  </Provider>
)

window.addEventListener('DOMContentLoaded', () => {
  const rootEl = document.getElementById('redux-app-root')
  ReactDOM.render(<Root />, rootEl)
})
