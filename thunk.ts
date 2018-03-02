import { connect, MapStateToPropsParam, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { exportMapState } from "./commons";
export * from "./commons";  
interface ActionCall {
    propertyKey: string;
    callback: Function
}

const connectActionKey = Symbol("connectActionKey");
export function ConnectAction(callback: Function) {
    return <any>function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let funcs: ActionCall[] = [];
        if (Reflect.hasMetadata(connectActionKey, target)) {
            funcs = Reflect.getMetadata(connectActionKey, target)
        }
        funcs.push({ callback, propertyKey })
        Reflect.defineMetadata(connectActionKey, funcs, target);
    };
}
export function exportConnect(propType: { new(): any }, compType: { new(): any }) {
    let example = new propType();
    let proto = Object.getPrototypeOf(example);
    let actionCalls: ActionCall[] = Reflect.getOwnMetadata(connectActionKey, proto) || [];
    let mapDispatchToProps: MapDispatchToProps<any, any> = (dispatch, ownProps) => {
        let actions = {};
        for (let actCall of actionCalls) {
            actions[actCall.propertyKey] = function () {
                let old = Array.prototype.slice.call(arguments);
                let args = [dispatch].concat(old);
                actCall.callback.apply(this, args);
            };
        }
        return actions;
    }
    let mapStateToProps = exportMapState(propType)
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