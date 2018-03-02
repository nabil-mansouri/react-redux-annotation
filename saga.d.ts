export * from "./commons";
export interface SagaCall {
    saga: string[];
    propertyKey: string;
}
export declare function ConnectSaga(sagas: string | string[]): any;
export declare function exportConnect(propType: {
    new (): any;
}, compType: {
    new (): any;
}): any;
export declare function ReduxConnect(propType: {
    new (): any;
}): (target: any) => any;
