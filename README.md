# react-redux-annotation

A plugin to easily configure your store with redux and easy integrate typescript in your redux project.

# Annotations
The plugin provide these annotations:
- @ReduxConnect
- @BindAction
- @BindProps
- @Reducer

# Sample
Below a sample explaining how to use it.

## State
```typescript
export interface Counter {
  loading: boolean;
  value: number
}
```

## Actions
```typescript
import * as redux from 'redux'
import * as state from './state'

//DEFINE A PAYLOAD INTERFACE
export interface JumpPayload {
  value: number
}
export class Actions { 
  static JUMP = "JUMP";
  static DECREMENT = "DECREMENT";
  static INCREMENT = "INCREMENT";
  static INCREMENT_SUCCESS = "INCREMENT_SUCCESS";
  static RESET = "RESET"; 
  //SYNC ACTION
  decrement(dispatch: redux.Dispatch<state.Counter>) {
    dispatch({ type: Actions.DECREMENT }); 
  }
  //ASYNC ACTION
  increment(dispatch: redux.Dispatch<state.Counter>) {
    dispatch({ type: Actions.INCREMENT });
    setTimeout(() => {
      dispatch({ type: Actions.INCREMENT_SUCCESS });
    }, 3000)
  }
  //ACTION WITH PARAM
  jump(dispatch: redux.Dispatch<state.Counter>, value: number) {
    dispatch({ type: Actions.JUMP, value });
  }
  reset(dispatch: redux.Dispatch<state.Counter>) {
    dispatch({ type: Actions.RESET });
  }
}
export const rActions = new Actions();
```

## Reducer

```typescript
import { combineReducers } from 'redux'
import { Counter } from './state' 
import { BindAction, exportReducers, DefaultAction } from "react-redux-annotation";
import { rActions, Actions, JumpPayload } from "./actions"

export class Reducers {
  @BindAction(Actions.RESET)//BIND REDUCER TO ONE ACTION
  reset(state: Counter, action: any): Counter {
    return { ...state, value: 0 };
  }
  @BindAction(Actions.JUMP) //USE A PAYLOAD INTERFACE
  jump(state: Counter, action: JumpPayload): Counter {
    return { ...state, value: state.value + action.value };
  }
  @BindAction([Actions.INCREMENT, ...]) //BIND REDUCER TO MULTIPLE ACTIONS
  increment(state: Counter, action: any): Counter {
    return { ...state, loading: true };
  }
  @BindAction([Actions.INCREMENT_SUCCESS])
  incrementSuccess(state: Counter, action: any): Counter {
    return { value: state.value + 1, loading: false };
  }
  @DefaultAction() //BIND A DEFAULT REDUCER
  initial(): Counter {
    return { value: 0, loading: false }
  }
}
//EXPORT REDUCER
export const cReducers = exportReducers<Counter>(Reducers);
```

## React Component

```typescript
import {  ConnectAction, ConnectProp, ReduxConnected } from "react-redux-annotation";
class Props {
  myName?= "Nabils";//DEFAULT PROPERTY
  //CONNECT THE METHOD TO AN ACTION
  @ConnectAction(rActions.decrement) decrement?: () => void
  @ConnectAction(rActions.increment) increment?: () => void
  @ConnectAction(rActions.reset) reset?: () => void;
  @ConnectAction(rActions.jump)  jump?: (value: number) => void;
  //CONNECT THE PROPERTY TO THE STATE
  @ConnectProp((stateCounter: state.Counter) => stateCounter) counter?: state.Counter;
}
//Connect the component to the redux store
@ReduxConnected(Props)
export class Counter extends React.Component<Props> {
  _onClickAdd = () => {  this.props.jump(4) }
  _onClickDecrement = () => {  this.props.decrement() }
  _onClickIncrement = () => {  this.props.increment() }
  _onClickReset = () => { this.props.reset() }
  render() {
    const { counter } = this.props
    return <div>
      <div>
        <strong>{counter.value}</strong>
        <strong>{this.props.myName}</strong>
        {this.props.counter.loading && <h6>Loading...</h6>}
      </div>
      <form>
        <button onClick={this._onClickIncrement}>Increment</button>
        <button onClick={this._onClickDecrement}>Decrement</button>
        <button onClick={this._onClickReset}>Reset</button>
        <button onClick={this._onClickAdd}>Jump 4</button> 
      </form>
    </div>
  }
} 
```

## Configure the store

```typescript
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as redux from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import * as state from './state'
import {cReducers} from './reducers'
import { Counter } from './counter'

const store: redux.Store<state.Counter> = redux.createStore(
  cReducers,
  { value: 0 } as state.Counter,
  redux.applyMiddleware(thunk),
)
const Root: React.SFC<{}> = () => (
  <Provider store={store}>
    <Counter  />
  </Provider>
)
window.addEventListener('DOMContentLoaded', () => {
  const rootEl = document.getElementById('redux-app-root')
  ReactDOM.render(<Root />, rootEl)
})
```


## TODO

- add middleware: saga, promise, observable
- add react-navigation
- add demo folder