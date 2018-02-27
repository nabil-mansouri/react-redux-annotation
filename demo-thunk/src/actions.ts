import * as redux from 'redux'
import * as state from './state'

// 
export interface JumpPayload {
  value: number
}
export class Actions {
  static ADD = "ADD";
  static JUMP = "JUMP";
  static INCREMENT = "INCREMENT";
  static INCREMENT_SUCCESS = "INCREMENT_SUCCESS";
  static RESET = "RESET";
  jump(dispatch: redux.Dispatch<state.Counter>, value: number) {
    dispatch({ type: Actions.JUMP, value });
  }
  add(dispatch: redux.Dispatch<state.Counter>) {
    dispatch({ type: Actions.ADD });
  }
  increment(dispatch: redux.Dispatch<state.Counter>) {
    dispatch({ type: Actions.INCREMENT });
    setTimeout(() => {
      dispatch({ type: Actions.INCREMENT_SUCCESS });
    }, 3000)
  }
  reset(dispatch: redux.Dispatch<state.Counter>) {
    dispatch({ type: Actions.RESET });
  }
}
export const rActions = new Actions();