import * as React from 'react'
import * as redux from 'redux'
import { connect } from 'react-redux'
import { rActions } from './actions'
import * as state from './state'
import { ConnectAction, ConnectProp, ReduxConnected } from "react-redux-annotation";


class Props {
  myName?= "Nabil";
  @ConnectAction(rActions.add) add?: () => void
  @ConnectAction(rActions.increment) increment?: () => void
  @ConnectAction(rActions.reset) reset?: () => void;
  @ConnectAction(rActions.jump) jump?: (value: number) => void;
  @ConnectProp((sta: state.Counter) => sta) counter?: state.Counter;
}

@ReduxConnected(Props)
export class PureCounter extends React.Component<Props> {
  _onClickJump = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    this.props.jump(4)
  }
  _onClickIncrement = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    this.props.increment()
  }
  _onClickReset = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault()
    this.props.reset()
  }
  render() {
    const { counter } = this.props
    return <div>
      <div >
        <strong>{counter.value}</strong>
        <strong> - {this.props.myName}</strong><br />
        {this.props.counter.loading && <h6>Loading...</h6>}
      </div>
      <form>
        <button onClick={this._onClickIncrement}>Increment</button>
        <button onClick={this._onClickReset}>Reset</button>
        <button onClick={this._onClickJump}>Jump 4</button>
        <pre>
          {JSON.stringify({
            counter
          }, null, 2)}
        </pre>
      </form>
    </div>
  }
} 