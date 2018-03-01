import * as React from 'react'
import * as redux from 'redux'
import { connect } from 'react-redux'
import { Actions } from './actions'
import * as state from './state'
import { ConnectAction, ConnectProp, ReduxConnect } from "react-redux-annotation/redux";


class Props {
  myName?= "Nabil"; 
  @ConnectAction(Actions.INCREMENT) increment?: () => void
  @ConnectAction(Actions.RESET) reset?: () => void;
  @ConnectAction(Actions.jump) jump?: (value: number) => void;
  @ConnectProp((sta: state.Counter) => sta) counter?: state.Counter;
}

@ReduxConnect(Props)
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