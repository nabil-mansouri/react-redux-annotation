# react-redux-annotation

A plugin to easily configure your react / redux / typescript project using class and decorators.
It actually work:
- without middleware (redux sync)
- with redux-thunk
- with redux-saga

Soon will integrate redux-promise and redux-observable.

Why it makes your code cleaner?
Because decorators manage for you:
- reducer <-> action binding
- react property <-> state binding
- react method <-> action binding
- more globally connection between react component and redux store

Install it using
```
npm i --save react-redux-annotation
```

> The plugin does not install react, readux or any middleware. They are defined as peerDependencies and let you choose deps you really need.

See demo-* folder and run :
```
npm run watch
npm run start
```

You have to import one of these files:
```
import {   } from "react-redux-annotation/redux";
import {   } from "react-redux-annotation/thunk";
import {   } from "react-redux-annotation/saga";
```


# Decorators
The plugin provide these decorators/functions:
- @ReduxConnect: connect react component to the redux store
- @BindAction: bind an action and a reducer
- @DefaultAction: set a reducer as default if action is not recognized
- @ConnectAction / @ConnectSaga: connect a react props methods to an action
- @ConnectProp: connect a react props property to the global state
- exportReducers: a function to export reducers

# Using without middlware

## Sample
Below a sample explaining how to use it with redux store.

### State
```typescript
export interface Counter {
  loading: boolean;
  value: number
}
export const initialState: Counter = {
    value: 0, loading: false
}
```

### Actions
```typescript
import * as redux from 'redux'
import * as state from './state'

//DEFINE A PAYLOAD INTERFACE USED ON REDUCER
export interface JumpPayload {
  value: number
}
export class Actions { 
  static JUMP = "JUMP";
  static ADD = "ADD"; 
  static INCREMENT = "INCREMENT"; 
  static RESET = "RESET";
  //ONLY DEFINE ACTION METHOD HAVING A PAYLOAD OR PARAMS OR LOGIC (API calls)
  static jump(  value: number) {
    return { type: Actions.JUMP, value };
  } 
} 
```

### Reducers

```typescript
import { combineReducers } from 'redux'
import { BindAction, exportReducers, DefaultAction } from "react-redux-annotation";
import { Actions, JumpPayload } from "./actions"
import { Counter } from "./state"

export class Reducers {
  @BindAction(Actions.JUMP)//YOU CAN USE ACTION PAYLOAD DEFINED IN THE ACTION FILE FOR STRING TYPING
  add(state: Counter, action: JumpPayload): Counter {
    return { ...state, value: state.value + action.value };
  } 
  @BindAction([Actions.INCREMENT, Actions.ADD])//YOU CAN BIND A REDUCER TO MULTIPLE ACTION
  incrementSuccess(state: Counter, action: any): Counter {
    return { value: state.value + 1, loading: false };
  }
  @BindAction(Actions.RESET)
  reset(state: Counter, action: any): Counter {
    return { ...state, value: 0 };
  }
  @DefaultAction()//BIND A DEFAULT REDUCER IF YOU WANT => by default it returns the current state
  initial(): Counter {
    return { value: 0, loading: false }
  }
}
//EXPORT REDUCERS - OPTIONS ARE NOT REQUIRED. useReference LET YOU COMPARE ACTION BY REFERENCE (enabling having duplicate). BY DEFAULT IT IS TRUE
export const cReducers = exportReducers<Counter>(Reducers,{useReference:false});
```

### React component

```typescript
import * as React from 'react'
import * as redux from 'redux'
import { connect } from 'react-redux'
import { Actions } from './actions'
import * as state from './state'
import { ConnectAction, ConnectProp, ReduxConnect } from "react-redux-annotation/redux";


class Props {
  myName?= "Nabil"; //DEFINE DEFAULT PARAMS OR ANY OTHER PARAMS NOT CONNECTED TO THE STORE
  @ConnectAction(Actions.INCREMENT) increment?: () => void //CONNECT THE PROPS METHOD TO AN ACTION TYPE
  @ConnectAction(Actions.RESET) reset?: () => void;
  @ConnectAction(Actions.jump) jump?: (value: number) => void;//CONNECT THE PROPS METHOD TO AN ACTION FUNCTION. YOU CAN DEFINE PARAMS OR IMPORT PAYLOAD FROM ACTION FILE
  @ConnectProp((sta: state.Counter) => sta) counter?: state.Counter;//CONNECT A PROPS PROPERTY TO THE STATE USING A SELECTOR
}

@ReduxConnect(Props) //CONNECT THE COMPONENT TO THE REDUX STORE
export class PureCounter extends React.Component<Props> {
  _onClickJump = (e: React.SyntheticEvent<HTMLButtonElement>) => { this.props.jump(4) }
  _onClickIncrement = (e: React.SyntheticEvent<HTMLButtonElement>) => { this.props.increment() }
  _onClickReset = (e: React.SyntheticEvent<HTMLButtonElement>) => { this.props.reset() }
  render() {
    const { counter } = this.props
    return <div>
      <div >
        <strong>{counter.value} - {this.props.myName}</strong><br />
        {this.props.counter.loading && <h6>Loading...</h6>}
      </div>
      <form>
        <button onClick={this._onClickIncrement}>Increment</button>
        <button onClick={this._onClickReset}>Reset</button>
        <button onClick={this._onClickJump}>Jump 4</button> 
      </form>
    </div>
  }
} 
```

### Configure the store

```typescript
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

```

## Redux thunk
The configuration with redux-thunk is more or less the same.
Only action and action binding changed.

### Actions
The decorator automatically send the dispatch function as first parameter:
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

### React component
You bind react props to an action using the reference to the function:

```typescript
import * as React from 'react'
import * as redux from 'redux'
import { connect } from 'react-redux'
import { Actions } from './actions'
import * as state from './state' 
import { ConnectAction, ConnectProp, ReduxConnect } from "react-redux-annotation/thunk";

class Props {
  myName?= "Nabil";
  @ConnectAction(Actions.add) add?: () => void
  @ConnectAction(Actions.increment) increment?: () => void
  @ConnectAction(Actions.reset) reset?: () => void;
  @ConnectAction(Actions.jump) jump?: (value: number) => void;
  @ConnectProp((sta: state.Counter) => sta) counter?: state.Counter;
}
@ReduxConnect(Props)
export class PureCounter extends React.Component<Props> {
  _onClickJump = (e: React.SyntheticEvent<HTMLButtonElement>) => { this.props.jump(4) }
  _onClickIncrement = (e: React.SyntheticEvent<HTMLButtonElement>) => { this.props.increment() }
  _onClickReset = (e: React.SyntheticEvent<HTMLButtonElement>) => { this.props.reset() }
  render() {
    const { counter } = this.props
    return <div>
      <div >
        <strong>{counter.value} - {this.props.myName}</strong><br />
        {this.props.counter.loading && <h6>Loading...</h6>}
      </div>
      <form>
        <button onClick={this._onClickIncrement}>Increment</button>
        <button onClick={this._onClickReset}>Reset</button>
        <button onClick={this._onClickJump}>Jump 4</button> 
      </form>
    </div>
  }
} 
```

### Store
The configuration of the store looks like:
```typescript
import thunk from 'redux-thunk'
import * as reducers from './reducers'
import * as state from './state' 

const store: redux.Store<state.Counter> = redux.createStore(
  reducers.cReducers,
  state.initialState,
  redux.applyMiddleware(thunk),
)
...
```

## Redux Saga
The configuration with redux-thunk is more or less the same.
Now you connect a method to a saga using @ConnectSaga

### Define Saga

```typescript
import * as redux from 'redux'
import * as state from './state'
import { delay } from 'redux-saga'
import { put, take, fork, cancel, cancelled, race, call } from 'redux-saga/effects'
// USE THE INTERFACE ON THE REACT COMPONENT
export interface PlayPayload {
  count: number
}
//USE THIS INTERFACE IN THE REDUCER (as params)
export interface ResetPayload {
  value: number;
  type: string;
}
export class Sagas {
  static START = "START";//DEFINE THE DISPATCH ACTIONS
  static DECREMENT = "DECREMENT";//USE IT ON REDUCER TO BIND THE REDUCER
  static PLAY = "PLAY";
  static STOP = "STOP";
  static PAUSE = "PAUSE";
  static RESUME = "RESUME";
  //USE THE PAYLOAD INTERFACE
  static * animate(payload: PlayPayload) { 
    yield delay(1000) 
    while (payload.count--) {
      yield put({ type: Sagas.DECREMENT }); 
      yield delay(750)
    } 
    yield put({ type: Sagas.STOP });
  }
  static * pause(payload: PlayPayload) {
    const { play } = yield race({
      stop: take(Sagas.STOP),
      play: take(Sagas.PLAY)
    })
    if (play) {
      yield call(Sagas.play, payload)
    }
  }
  static * play(payload: PlayPayload) { 
    const task = yield fork(Sagas.animate, payload); 
    const { pause } = yield race({
      stop: take(Sagas.STOP),
      pause: take(Sagas.PAUSE)
    })
    yield cancel(task)
    if (pause) {
      yield call(Sagas.pause, payload)
    }
  }
  //THE ENTRY POINT
  static * playFlow() {
    while (true) {
      const payload : PlayPayload= yield take(Sagas.PLAY)//GET THE PAYLOAD
      yield put({ type: Sagas.START, value: payload.count }); 
      yield call(Sagas.play, payload)
    }
  }
} 
``` 

### React component

Connect the react props to the saga action / state properties:
```typescript
import * as React from 'react'
import * as redux from 'redux'
import { connect } from 'react-redux'
import { PlayPayload, Sagas } from './saga'
import * as state from './state'
import { ConnectProp, ConnectSaga, ReduxConnect } from "react-redux-annotation/saga";



class Props {
  myName?= "Nabil";
  @ConnectSaga(Sagas.PLAY) play?: (payload: PlayPayload) => void //USE PAYLOAD INTERFACE
  @ConnectSaga(Sagas.PAUSE) pause?: () => void //CONNECT THE SAGA ACTION TO BE DISPATCHED
  @ConnectSaga(Sagas.STOP) stop?: () => void //USE CLEAN METHOD TO DISPATCH SAGA ACTION
  @ConnectProp((sta: state.Countdown) => {  return sta; }) counter?: state.Countdown;//BIND TO THE STATE USING SELECTOR
}

@ReduxConnect(Props)
export class PureCounter extends React.Component<Props> {
  _onPlay = (e: React.SyntheticEvent<HTMLButtonElement>) => { this.props.play({ count: 10 })  }
  _onPause = (e: React.SyntheticEvent<HTMLButtonElement>) => { this.props.pause() }
  _onStop = (e: React.SyntheticEvent<HTMLButtonElement>) => { this.props.stop() }
  render() {
    const { counter } = this.props
    return <div>
      <div >
        <strong>{counter.value} - {this.props.myName}</strong><br />
        {this.props.counter.playing == "play" && < h6 > Playing...</h6>}
      </div>
      <form>
        {this.props.counter.playing != "play" && <button onClick={this._onPlay}>Play</button>}
        {this.props.counter.playing == "play" && <button onClick={this._onPause}>Pause</button>}
        <button onClick={this._onStop}>Stop</button> 
      </form>
    </div >
  }
} 
```

# Credits
Credits to https://rjz.github.io/typescript-react-redux/ for the demo-* folder.
Demos are based on this example because it is clean and simple to understand.

# TODO

- add middlewares:  promise, observable
- add react-navigation
- add type checking