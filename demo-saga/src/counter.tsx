import * as React from 'react'
import * as redux from 'redux'
import { connect } from 'react-redux'
import { PlayPayload, Sagas } from './saga'
import * as state from './state'
import { ConnectProp, ConnectSaga, ReduxConnect } from "react-redux-annotation/saga";



class Props {
  myName?= "Nabil";
  @ConnectSaga(Sagas.PLAY) play?: (payload: PlayPayload) => void
  @ConnectSaga(Sagas.PAUSE) pause?: () => void
  @ConnectSaga(Sagas.STOP) stop?: () => void
  @ConnectProp((sta: state.Countdown) => {
    return sta;
  }) counter?: state.Countdown;
}

@ReduxConnect(Props)
export class PureCounter extends React.Component<Props> {
  _onPlay = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    this.props.play({ count: 10 })
  }
  _onPause = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    this.props.pause()
  }
  _onStop = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    this.props.stop()
  }
  render() {
    const { counter } = this.props
    return <div>
      <div >
        <strong>{counter.value}</strong>
        <strong> - {this.props.myName}</strong><br />
        {this.props.counter.playing == "play" && < h6 > Playing...</h6>}
      </div>
      <form>
        {this.props.counter.playing != "play" && <button onClick={this._onPlay}>Play</button>}
        {this.props.counter.playing == "play" && <button onClick={this._onPause}>Pause</button>}
        <button onClick={this._onStop}>Stop</button>
        <pre>
          {JSON.stringify({
            counter
          }, null, 2)}
        </pre>
      </form>
    </div >
  }
} 