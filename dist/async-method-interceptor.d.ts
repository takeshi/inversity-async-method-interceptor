import * as inversify from "inversify";
export declare class AsyncInvocationContext {
    kernel: inversify.IKernel;
    applyThis: any;
    applyArgs: any;
    targetMethod: Function;
    constructor(kernel: inversify.IKernel, applyThis: any, applyArgs: any, targetMethod: Function);
    proceed(): Promise<any>;
    className: string;
    methodName: string;
}
export interface AsyncMethodInterceptor {
    (context: AsyncInvocationContext): Promise<any>;
}
export interface AsyncMethodInterceptorPattern {
    targetClass?: RegExp;
    excludeClass?: RegExp;
    targetMethod?: RegExp;
    excludeMethod?: RegExp;
}
export declare class AsyncMethodInterceptorConfig {
    pattern: AsyncMethodInterceptorPattern;
    interceptors: AsyncMethodInterceptor[];
}
export declare function AsyncMethodInterceptorModule(config: AsyncMethodInterceptorConfig): inversify.IKernelModule;
