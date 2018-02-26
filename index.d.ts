import { Reducer } from 'redux';
import "reflect-metadata";
export declare function BindAction(func: string | string[]): {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
};
export declare function DefaultAction(): {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
};
export declare function exportReducers<State>(type: {
    new (): any;
}): Reducer<State>;
export declare function ConnectProp(callback: (state: any) => any): any;
export declare function ConnectAction(callback: Function): any;
export declare function exportConnected(propType: {
    new (): any;
}, compType: {
    new (): any;
}): any;
export declare function ReduxConnected(propType: {
    new (): any;
}): (target: any) => any;
