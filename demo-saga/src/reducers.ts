import { combineReducers } from 'redux'
import { BindAction, exportReducers, DefaultAction } from "react-redux-annotation";
import { Sagas, ResetPayload } from "./saga"
import { Countdown, initialState } from "./state"

export class Reducers {
  @BindAction(Sagas.DECREMENT)
  decrement(state: Countdown): Countdown {
    return { ...state, value: state.value - 1 };
  }
  @BindAction([Sagas.START, Sagas.STOP])
  reset(state: Countdown, action: ResetPayload): Countdown {
    return { ...state, value: action.value || 0, playing: action.type == Sagas.START ? "play" : "stop" };
  }
  @BindAction(Sagas.PLAY)
  play(state: Countdown, action: ResetPayload): Countdown {
    return { ...state, playing: "play" };
  }
  @BindAction(Sagas.PAUSE)
  pause(state: Countdown): Countdown {
    return { ...state, playing: "pause" };
  }
  @DefaultAction()
  initial(state: Countdown = initialState): Countdown {
    return state
  }
}

export const cReducers = exportReducers<Countdown>(Reducers);