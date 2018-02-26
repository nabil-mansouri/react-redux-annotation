"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_redux_1 = require("react-redux");
require("reflect-metadata");
var actionMetaKey = Symbol("actionMetaKey");
var actionDefaultMetaKey = Symbol("actionDefaultMetaKey");
function BindAction(func) {
    return Reflect.metadata(actionMetaKey, func);
}
exports.BindAction = BindAction;
function DefaultAction() {
    return Reflect.metadata(actionDefaultMetaKey, true);
}
exports.DefaultAction = DefaultAction;
function exportReducers(type) {
    var t = new type();
    var proto = Object.getPrototypeOf(t);
    var names = Object.getOwnPropertyNames(proto);
    return function (state, action) {
        var def = null;
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var name_1 = names_1[_i];
            var method = proto[name_1];
            var type_1 = Reflect.getMetadata(actionMetaKey, t, name_1);
            //
            var all = [];
            if (typeof type_1 == "string") {
                all.push(type_1);
            }
            else if (type_1 instanceof Array) {
                all = type_1;
            }
            var founded = all.find(function (a) { return a === action.type; });
            if (founded) {
                return method(state, action);
            }
            //
            if (Reflect.getMetadata(actionDefaultMetaKey, t, name_1)) {
                def = proto[name_1];
            }
        }
        //CALL DEFAULT
        return def && def(state, action);
    };
}
exports.exportReducers = exportReducers;
var connectPropKey = Symbol("connectPropKey");
var connectActionKey = Symbol("connectActionKey");
function ConnectProp(callback) {
    return function (target, propertyKey, descriptor) {
        var funcs = [];
        if (Reflect.hasMetadata(connectPropKey, target)) {
            funcs = Reflect.getMetadata(connectPropKey, target);
        }
        funcs.push({ callback: callback, propertyKey: propertyKey });
        Reflect.defineMetadata(connectPropKey, funcs, target);
    };
}
exports.ConnectProp = ConnectProp;
function ConnectAction(callback) {
    return function (target, propertyKey, descriptor) {
        var funcs = [];
        if (Reflect.hasMetadata(connectActionKey, target)) {
            funcs = Reflect.getMetadata(connectActionKey, target);
        }
        funcs.push({ callback: callback, propertyKey: propertyKey });
        Reflect.defineMetadata(connectActionKey, funcs, target);
    };
}
exports.ConnectAction = ConnectAction;
function exportConnected(propType, compType) {
    var example = new propType();
    var proto = Object.getPrototypeOf(example);
    var actionCalls = Reflect.getOwnMetadata(connectActionKey, proto);
    var propCalls = Reflect.getOwnMetadata(connectPropKey, proto);
    var mapStateToProps = function (state, ownProps) {
        var props = {};
        for (var _i = 0, propCalls_1 = propCalls; _i < propCalls_1.length; _i++) {
            var propCall = propCalls_1[_i];
            props[propCall.propertyKey] = propCall.callback(state);
        }
        return props;
    };
    var mapDispatchToProps = function (dispatch, ownProps) {
        var actions = {};
        var _loop_1 = function (actCall) {
            actions[actCall.propertyKey] = function () {
                var old = Array.prototype.slice.call(arguments);
                var args = [dispatch].concat(old);
                actCall.callback.apply(this, args);
            };
        };
        for (var _i = 0, actionCalls_1 = actionCalls; _i < actionCalls_1.length; _i++) {
            var actCall = actionCalls_1[_i];
            _loop_1(actCall);
        }
        return actions;
    };
    // 
    proto = Object.getPrototypeOf(compType);
    proto.defaultProps = example;
    return react_redux_1.connect(mapStateToProps, mapDispatchToProps)(compType);
}
exports.exportConnected = exportConnected;
function ReduxConnected(propType) {
    return function (target) {
        return exportConnected(propType, target);
    };
}
exports.ReduxConnected = ReduxConnected;
//# sourceMappingURL=index.js.map