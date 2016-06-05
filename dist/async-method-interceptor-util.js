'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const async_method_interceptor_1 = require("./async-method-interceptor");
function isFunction(funktion) {
    return funktion && {}.toString.call(funktion) === '[object Function]';
}
var logger = console.error.bind(console);
function methodInterceptorMiddleware(kernel, pattern, interceptor) {
    return function interceptorMiddleware(planAndResolve) {
        return (args) => {
            let results = planAndResolve(args);
            for (let i of results) {
                weaveInterceptorByMethodRegExp(kernel, pattern, i, interceptor);
            }
            return results;
        };
    };
}
exports.methodInterceptorMiddleware = methodInterceptorMiddleware;
function getPropertyNames(target) {
    var propNames = [];
    var o = target;
    while (true) {
        let names = Object.getOwnPropertyNames(o);
        o = Object.getPrototypeOf(o);
        if (!o) {
            break;
        }
        propNames = propNames.concat(names);
    }
    return propNames;
}
function weaveInterceptorByMethodRegExp(kernel, pattern, target, interceptor) {
    const className = target.constructor.name;
    if (pattern.excludeClass) {
        if (pattern.excludeClass.test(className)) {
            return;
        }
    }
    if (pattern.targetClass) {
        if (!pattern.targetClass.test(className)) {
            return;
        }
    }
    return getPropertyNames(target).filter((methodName) => {
        if (methodName === "constructor") {
            return;
        }
        if (!isFunction(target[methodName])) {
            return false;
        }
        if (pattern.excludeMethod) {
            if (pattern.excludeMethod.test(methodName)) {
                return false;
            }
        }
        if (pattern.targetMethod) {
            if (!pattern.targetMethod.test(methodName)) {
                return false;
            }
        }
        return true;
    }).map((key) => {
        return weaveInterceptor(kernel, target, key, interceptor);
    });
}
function weaveInterceptor(kernel, target, methodName, interceptor) {
    if (!target || !target[methodName]) {
        throw new Error('no original function ' + methodName + ' to wrap');
    }
    if (!interceptor) {
        throw new Error('no interceptor');
    }
    if (!isFunction(target[methodName]) || !isFunction(interceptor)) {
        throw new Error('original object and interceptor must be functions');
    }
    var original = target[methodName];
    target[methodName] = function () {
        return __awaiter(this, arguments, void 0, function* () {
            const context = new async_method_interceptor_1.AsyncInvocationContext(kernel, this, arguments, original);
            return yield interceptor(context);
        });
    };
    return interceptor;
}
