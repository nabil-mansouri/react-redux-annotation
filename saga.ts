import { connect, MapStateToPropsParam, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { exportMapState } from "./commons";
export * from "./commons";  

export interface SagaCall {
    saga: string[],
    propertyKey: string
}
const sagaKey = Symbol("sagaKey");
export function ConnectSaga(sagas: string | string[]) {
    return <any>function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let funcs: SagaCall[] = [];
        if (Reflect.hasMetadata(sagaKey, target)) {
            funcs = Reflect.getMetadata(sagaKey, target)
        }
        let saga = typeof sagas == "string" ? [sagas] : sagas;
        funcs.push({ saga, propertyKey })
        Reflect.defineMetadata(sagaKey, funcs, target);
    };
}


export function exportConnect(propType: { new(): any }, compType: { new(): any }) {
    let example = new propType();
    let proto = Object.getPrototypeOf(example);
    let actionCalls: SagaCall[] = Reflect.getOwnMetadata(sagaKey, proto) || [];
    let mapDispatchToProps: MapDispatchToProps<any, any> = (dispatch, ownProps) => {
        let actions = {};
        for (let actCall of actionCalls) {
            actions[actCall.propertyKey] = function (old) {
                let payload = old || {};
                actCall.saga.forEach(s => {
                    dispatch({ ...payload, type: s })
                })
            };
        }
        return actions;
    }
    let mapStateToProps = exportMapState(propType);
    // 
    proto = Object.getPrototypeOf(compType);
    proto.defaultProps = example;
    return connect(mapStateToProps, mapDispatchToProps)(compType);
}



export function ReduxConnect(propType: { new(): any }) {
    return function (target) {
        return <any>exportConnect(propType, target)
    }
}