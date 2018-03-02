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
export interface ReducerOpt {
    useReference: boolean;
}
export declare function exportReducers<State>(type: {
    new (): any;
}, opts?: ReducerOpt): Reducer<State>;
export declare function ConnectProp(callback: (state: any) => any): any;
export declare function exportMapState(propType: {
    new (): any;
}): any;
