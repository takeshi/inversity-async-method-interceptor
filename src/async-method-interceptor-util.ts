'use strict'

import {AsyncInvocationContext, AsyncMethodInterceptor, AsyncMethodInterceptorPattern} from "./async-method-interceptor";

function isFunction(funktion: any) {
    return funktion && {}.toString.call(funktion) === '[object Function]'
}

var logger = console.error.bind(console)


export function methodInterceptorMiddleware(kernel: inversify.IKernel, pattern: AsyncMethodInterceptorPattern, interceptor: AsyncMethodInterceptor) {
    return function interceptorMiddleware(planAndResolve: inversify.PlanAndResolve<any>): inversify.PlanAndResolve<any> {
        return (args: inversify.PlanAndResolveArgs) => {
            let results = planAndResolve(args);
            for (let i of results) {
                weaveInterceptorByMethodRegExp(kernel, pattern, i, interceptor);
            }
            return results;
        };
    }
}

function getPropertyNames(target: any): string[] {
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

function weaveInterceptorByMethodRegExp(kernel: inversify.IKernel, pattern: AsyncMethodInterceptorPattern, target: any, interceptor: AsyncMethodInterceptor) {
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
    return getPropertyNames(target).filter((methodName: string) => {
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
    }).map((key: string) => {
        return weaveInterceptor(kernel, target, key, interceptor);
    });
}

function weaveInterceptor(kernel: inversify.IKernel, target: any, methodName: string, interceptor: AsyncMethodInterceptor) {
    if (!target || !target[methodName]) {
        throw new Error('no original function ' + methodName + ' to wrap');
    }

    if (!interceptor) {
        throw new Error('no interceptor')
    }

    if (!isFunction(target[methodName]) || !isFunction(interceptor)) {
        throw new Error('original object and interceptor must be functions')
    }

    var original = target[methodName]
    target[methodName] = async function () {
        const context = new AsyncInvocationContext(kernel, this, arguments, original);
        return await interceptor(context);
    }

    return interceptor;
}