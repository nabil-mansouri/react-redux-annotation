
//
import { Reducer, } from 'redux';
import { connect, MapStateToPropsParam, MapDispatchToProps, MapStateToProps } from 'react-redux';
import "reflect-metadata";
//@BindAction
//@DefaultAction
const actionMetaKey = Symbol("actionMetaKey");
const actionDefaultMetaKey = Symbol("actionDefaultMetaKey");
export function BindAction(func: string | string[]) {
    if (typeof func == "string") {
        func = [func];
    }
    return Reflect.metadata(actionMetaKey, func);
}
export function DefaultAction() {
    return Reflect.metadata(actionDefaultMetaKey, true);
}
export interface ReducerOpt {
    useReference: boolean
}
export function exportReducers<State>(type: { new(): any }, opts: ReducerOpt = { useReference: true }): Reducer<State> {
    let t = new type();
    let proto = Object.getPrototypeOf(t);
    let names = Object.getOwnPropertyNames(proto);
    const comp = opts.useReference ? ((current: string, action: string) => current === action) : ((current: string, action: string) => current == action);
    return (state: State, action: any) => {
        let def = null;
        for (let name of names) {
            let actions: string[] = Reflect.getMetadata(actionMetaKey, t, name) || [];
            let founded = actions.find(a => comp(a, action.type));
            if (founded) {
                let method = proto[name];
                return method(state, action);
            }
            //
            if (Reflect.getMetadata(actionDefaultMetaKey, t, name)) {
                def = proto[name];
            }
        }
        //CALL DEFAULT
        return def ? def(state, action) : state;
    }
}
//@ConnectProp
interface PropCall {
    propertyKey: string;
    callback: (state: any) => any
}
const connectPropKey = Symbol("connectPropKey");
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
export function exportMapState(propType: { new(): any }) {
    let example = new propType();
    let proto = Object.getPrototypeOf(example);
    let propCalls: PropCall[] = Reflect.getOwnMetadata(connectPropKey, proto) || [];
    let mapStateToProps: MapStateToProps<any, any> = (state, ownProps) => {
        let props = {};
        for (let propCall of propCalls) {
            props[propCall.propertyKey] = propCall.callback(state);
        }
        return props;
    }
    return mapStateToProps;
}

