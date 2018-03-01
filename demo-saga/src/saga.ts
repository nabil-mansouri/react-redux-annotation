import * as redux from 'redux'
import * as state from './state'
import { delay } from 'redux-saga'
import { put, take, fork, cancel, cancelled, race, call } from 'redux-saga/effects'
// 
export interface PlayPayload {
  count: number
}
export interface ResetPayload {
  value: number;
  type: string;
}
export class Sagas {
  static START = "START";
  static DECREMENT = "DECREMENT";
  static PLAY = "PLAY";
  static STOP = "STOP";
  static PAUSE = "PAUSE";
  static RESUME = "RESUME";
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
  static * playFlow() {
    while (true) {
      const payload = yield take(Sagas.PLAY)
      yield put({ type: Sagas.START, value: payload.count }); 
      yield call(Sagas.play, payload)
    }
  }
} 