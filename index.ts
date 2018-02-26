
//
import { Reducer, } from 'redux';
import { connect, MapStateToPropsParam, MapDispatchToProps, MapStateToProps } from 'react-redux';
import "reflect-metadata";
const actionMetaKey = Symbol("actionMetaKey");
const actionDefaultMetaKey = Symbol("actionDefaultMetaKey");
export function BindAction(func: string | string[]) {
    return Reflect.metadata(actionMetaKey, func);
}
export function DefaultAction() {
    return Reflect.metadata(actionDefaultMetaKey, true);
}
export function exportReducers<State>(type: { new(): any }): Reducer<State> {
    let t = new type();
    let proto = Object.getPrototypeOf(t);
    let names = Object.getOwnPropertyNames(proto);
    return (state: State, action: any) => {
        let def = null;
        for (let name of names) {
            let method = proto[name];
            let type: string | string[] = Reflect.getMetadata(actionMetaKey, t, name);
            //
            let all: string[] = [];
            if (typeof type == "string") {
                all.push(type);
            } else if (type instanceof Array) {
                all = type;
            }
            let founded = all.find(a => a === action.type);
            if (founded) {
                return method(state, action);
            }
            //
            if (Reflect.getMetadata(actionDefaultMetaKey, t, name)) {
                def = proto[name];
            }
        }
        //CALL DEFAULT
        return def && def(state, action);
    }
}
interface PropCall {
    propertyKey: string;
    callback: (state: any) => any
}
interface ActionCall {
    propertyKey: string;
    callback: Function
}
const connectPropKey = Symbol("connectPropKey");
const connectActionKey = Symbol("connectActionKey");
export function ConnectProp(callback: (state: any) => any) {
    return <any>function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let funcs: PropCall[] = [];
        if (Reflect.hasMetadata(connectPropKey, target)) {
            funcs = Reflect.getMetadata(connectPropKey, target)
        }
        funcs.push({ callback, propertyKey })
        Reflect.defineMetadata(connectPropKey, funcs, target);
    };
}
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
export function exportConnected(propType: { new(): any }, compType: { new(): any }) {
    let example = new propType();
    let proto = Object.getPrototypeOf(example);
    let actionCalls: ActionCall[] = Reflect.getOwnMetadata(connectActionKey, proto);
    let propCalls: PropCall[] = Reflect.getOwnMetadata(connectPropKey, proto);
    let mapStateToProps: MapStateToProps<any, any> = (state, ownProps) => {
        let props = {};
        for (let propCall of propCalls) {
            props[propCall.propertyKey] = propCall.callback(state);
        }
        return props;
    }
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
    // 
    proto = Object.getPrototypeOf(compType);
    proto.defaultProps = example;
    return connect(mapStateToProps, mapDispatchToProps)(compType);
}



export function ReduxConnected(propType: { new(): any }) {
    return function (target) {
        return <any>exportConnected(propType, target)
    }
}