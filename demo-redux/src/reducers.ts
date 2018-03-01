import { combineReducers } from 'redux'
import { BindAction, exportReducers, DefaultAction } from "react-redux-annotation";
import { Actions, JumpPayload } from "./actions"
import { Counter } from "./state"

export class Reducers {
  @BindAction(Actions.JUMP)
  add(state: Counter, action: JumpPayload): Counter {
    return { ...state, value: state.value + action.value };
  } 
  @BindAction([Actions.INCREMENT, Actions.ADD])
  incrementSuccess(state: Counter, action: any): Counter {
    return { value: state.value + 1, loading: false };
  }
  @BindAction(Actions.RESET)
  reset(state: Counter, action: any): Counter {
    return { ...state, value: 0 };
  }
  @DefaultAction()
  initial(): Counter {
    return { value: 0, loading: false }
  }
}

export const cReducers = exportReducers<Counter>(Reducers);