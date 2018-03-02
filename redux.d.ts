export * from "./commons";
export declare function ConnectAction(callback: Function | string): any;
export declare function exportConnect(propType: {
    new (): any;
}, compType: {
    new (): any;
}): any;
export declare function ReduxConnect(propType: {
    new (): any;
}): (target: any) => any;
