import * as redux from 'redux';
import * as state from './state';
export interface JumpPayload {
    value: number;
}
export declare class Actions {
    static ADD: string;
    static JUMP: string;
    static INCREMENT: string;
    static INCREMENT_SUCCESS: string;
    static RESET: string;
    jump(dispatch: redux.Dispatch<state.Counter>, value: number): void;
    add(dispatch: redux.Dispatch<state.Counter>): void;
    increment(dispatch: redux.Dispatch<state.Counter>): void;
    reset(dispatch: redux.Dispatch<state.Counter>): void;
}
export declare const rActions: Actions;
