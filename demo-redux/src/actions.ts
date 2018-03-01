import * as redux from 'redux'
import * as state from './state'

// 
export interface JumpPayload {
  value: number
}
export class Actions { 
  static JUMP = "JUMP";
  static ADD = "ADD"; 
  static INCREMENT = "INCREMENT"; 
  static RESET = "RESET";
  static jump(  value: number) {
    return { type: Actions.JUMP, value };
  } 
} 