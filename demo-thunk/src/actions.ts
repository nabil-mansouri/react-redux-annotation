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
  static jump(dispatch: redux.Dispatch<state.Counter>, value: number) {
    dispatch({ type: Actions.JUMP, value });
  }
  static add(dispatch: redux.Dispatch<state.Counter>) {
    dispatch({ type: Actions.ADD });
  }
  static increment(dispatch: redux.Dispatch<state.Counter>) {
    dispatch({ type: Actions.INCREMENT });
    setTimeout(() => {
      dispatch({ type: Actions.INCREMENT_SUCCESS });
    }, 3000)
  }
  static reset(dispatch: redux.Dispatch<state.Counter>) {
    dispatch({ type: Actions.RESET });
  }
} 